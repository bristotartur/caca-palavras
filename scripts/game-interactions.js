import { getWords, getWordRowsMap } from './game-steup.js';

const html = document.querySelector('html');
const board = document.querySelector('.board')
const words = getWords();

let isMouseDown = false;
let lineRoot = {};
let wordsFound = 0;

let currentMiddleTile = null;
let currentWord = null;
let currentLetters = [];
let correctLines = new Set(); 

document.addEventListener('DOMContentLoaded', () => {
    const tiles = [...document.querySelectorAll('.tile')];

    html.addEventListener('mouseup', handlePointerUp);
    html.addEventListener('touchend', handlePointerUp);
    
    tiles.forEach((tile) => {
        // Eventos de mouse
        tile.addEventListener('mousedown', handlePointerDown);
        tile.addEventListener('mousemove', handlePointerMove);
        // Eventos de toque
        tile.addEventListener('touchstart', handlePointerDown);
        tile.addEventListener('touchmove', handlePointerMove);
    });
    window.tiles = tiles
});

function handlePointerDown(event) {
    event.preventDefault();

    const tile = event.currentTarget || event.target.closest('.tile');
    const [row, column] = tile.id.split('-').map(Number);

    addLine(tile);
    
    isMouseDown = true;
    currentMiddleTile = tile;
    lineRoot = { row: row, column: column };
    
    board.classList.add('drawing');
}

function handlePointerUp() {
    isMouseDown = false;

    if (currentMiddleTile) {
        let line = currentMiddleTile.querySelector('.draw-line#current');
    
        if (checkWord() && !correctLines.has(line)) {
            wordsFound++;

            line.id = `correct-${ currentMiddleTile.id }`; 
            line.classList.add('correct-line');
            line.style.background = `var(--color-${ wordsFound })`;
            line.style.zIndex = wordsFound;

            correctLines.add(line); 
            updateWordContainer();
        } else {
            currentMiddleTile.removeChild(line); 
        }
        currentMiddleTile = null;
        currentLetters = [];
    }
    board.classList.remove('drawing');
}

function handlePointerMove(event) {
    if (!isMouseDown) return;

    const tile = getTileFromEvent(event);

    if (tile && tile !== currentMiddleTile) drawLine(tile);
}

function getTileFromEvent(event) {
    event.preventDefault();

    if (event.type === 'touchmove') {
        const touch = event.touches[0];
        return document.elementFromPoint(touch.clientX, touch.clientY);
    }
    return event.currentTarget;
}

function checkWord() {
    let isWord = false;
    let w = currentLetters.join('');

    for (let word of words) {
        if (word === w || word === w.split('').reverse().join('')) {
            isWord = true;
            currentWord = word;
            break;
        }
    }
    return isWord;
}

function updateWordContainer() {
    const spanId = getWordRowsMap().get(currentWord.toUpperCase());
    const span = document.querySelector(`#${ spanId }`);

    span.classList.add('word-found');
}

function drawLine(tile) {
    const [row, column] = tile.id.split('-').map(Number);

    const rootRow = lineRoot.row;
    const rootColumn = lineRoot.column;

    if (rootRow === row && rootColumn === column) return;

    let lineIds = [];
    let orientation = '';

    // Encima
    if (rootRow > row && rootColumn === column) {
        lineIds = getStraightLineIds(row, rootRow, rootColumn, orientation = 'VERTICAL');
    }
    // Direita
    if (rootRow === row && rootColumn < column) {
        lineIds = getStraightLineIds(rootColumn, column, rootRow, orientation = 'HORIZONTAL');
    }
    // Embaixo 
    if (rootRow < row && rootColumn === column) {
        lineIds = getStraightLineIds(rootRow, row, rootColumn, orientation = 'VERTICAL');
    }
    // Esquerda
    if (rootRow === row && rootColumn > column) {
        lineIds = getStraightLineIds(column, rootColumn, rootRow, orientation = 'HORIZONTAL');
    }

    // Superior direito
    if ((rootRow > row && rootColumn < column) && (rootRow - row === column - rootColumn)) {
        lineIds = getDiagonalLineIds(rootRow, rootColumn, rootRow - row, orientation = 'RIGHT_TOP');
    }
    // Inferior direito
    if ((rootRow < row && rootColumn < column) && (row - rootRow === column - rootColumn)) {
        lineIds = getDiagonalLineIds(rootRow, rootColumn, row - rootRow, orientation = 'RIGHT_BOTTOM');
    }
    // Inferior esquerdo
    if ((rootRow < row && rootColumn > column) && (row - rootRow === rootColumn - column)) {
        lineIds = getDiagonalLineIds(rootRow, rootColumn, row - rootRow, orientation = 'LEFT_BOTTOM');
    }
    // Superior esquerdo
    if ((rootRow > row && rootColumn > column) && (rootRow - row === rootColumn - column)) {
        lineIds = getDiagonalLineIds(rootRow, rootColumn, rootRow - row, orientation = 'LEFT_TOP');
    }

    if (lineIds.length === 0) return;

    calcLinePosition(lineIds, orientation);
    currentLetters = getTilesLetters(lineIds);
}

function getStraightLineIds(start, range, freezeCoord, orientation) {
    let ids = [];

    for (let i = start; i <= range; i++) {
        if (orientation === 'VERTICAL') {
            ids.push({ row: i, column: freezeCoord });
        } else {
            ids.push({ row: freezeCoord, column: i });
        }
    }
    return ids;
}

function getDiagonalLineIds(rootRow, rootColumn, gap, direction) {
    let ids = [];

    switch (direction) {
        case 'RIGHT_TOP':
            for (let i = 0; i <= gap; i++) {
                ids.push({ row: rootRow - i, column: rootColumn + i });
            }
            break;
        case 'RIGHT_BOTTOM':
            for (let i = 0; i <= gap; i++) {
                ids.push({ row: rootRow + i, column: rootColumn + i });
            }
            break;
        case 'LEFT_BOTTOM':
            for (let i = 0; i <= gap; i++) {
                ids.push({ row: rootRow + i, column: rootColumn - i });
            }
            break;
        case 'LEFT_TOP':
            for (let i = 0; i <= gap; i++) {
                ids.push({ row: rootRow - i, column: rootColumn - i });
            }
            break;
    }
    return ids;
}

function calcLinePosition(lineIds, orientation) {
    const size = lineIds.length;
    const middleId = lineIds[Math.floor((size - 1) / 2)];

    let line = currentMiddleTile.querySelector('.draw-line#current');
    if (line) {
        currentMiddleTile.removeChild(line);
    }

    currentMiddleTile = window.tiles.find((tile) => {
        return tile.id === `${ middleId.row }-${ middleId.column }`;
    });

    if (currentMiddleTile && !currentMiddleTile.querySelector('.draw-line#current')) {
        line = addLine(currentMiddleTile);
    }
    calcLineSize(line, size, orientation);
}

function addLine(tile) {
    const line = document.createElement('div');

    line.classList.add('draw-line');
    line.id = 'current'; 

    tile.appendChild(line);
    return line;
}

function getTilesLetters(ids) {
    let tiles = ids.map((id) => {
        return window.tiles.find(tile => tile.id === `${ id.row }-${ id.column }`);
    });

    return tiles.map((tile) => {
        const span = tile.querySelector('span');
        return span ? span.innerHTML : '';
    });
}

function calcLineSize(line, tilesCount, orientation) {
    const verticalLength = `var(--tile-height) / 5 * (5 * ${ tilesCount } - var(--line-discount))`;
    const horizonalLength = `var(--tile-width) / 5 * (5 * ${ tilesCount } - var(--line-discount))`;
    const diagonalLength = `var(--tile-width) / 5 * (5 * ${ Math.sqrt(2) * tilesCount } - var(--diagonal-line-discount))`;

    let isEven = tilesCount % 2 === 0;

    switch (orientation) {
        case 'VERTICAL':
            line.style.height = `calc(${ verticalLength })`;
            if (isEven) {
                line.style.top = 'var(--tile-height)';
            }
            break;
        case 'HORIZONTAL':
            line.style.width = `calc(${ horizonalLength })`;
            if (isEven) {
                line.style.left = 'var(--tile-width)';
            }
            break;
        case 'RIGHT_TOP':
            line.style.width = `calc(${ diagonalLength} - 1rem)`;
            line.style.transform = `translate(-50%, -50%) rotate(${ getRotationAngle(orientation) }deg)`;

            if (isEven) {
                line.style.left = 'calc(50% + var(--tile-width) / 2)';
                line.style.top = 'calc(50% - var(--tile-height) / 2)';
            }
            break;
        case 'RIGHT_BOTTOM':
            line.style.width = `calc(${ diagonalLength } - 1rem)`;
            line.style.transform = `translate(-50%, -50%) rotate(${ getRotationAngle(orientation) }deg)`;

            if (isEven) {
                line.style.left = 'calc(50% + var(--tile-width) / 2)';
                line.style.top = 'calc(50% + var(--tile-height) / 2)';
            }
            break;
        case 'LEFT_BOTTOM':
            line.style.width = `calc(${ diagonalLength } - 1rem)`;
            line.style.transform = `translate(-50%, -50%) rotate(${ getRotationAngle(orientation) }deg)`;

            if (isEven) {
                line.style.left = 'calc(50% - var(--tile-width) / 2)';
                line.style.top = 'calc(50% + var(--tile-height) / 2)';
            }
            break;
        case 'LEFT_TOP':
            line.style.width = `calc(${ diagonalLength } - 1rem)`;
            line.style.transform = `translate(-50%, -50%) rotate(${ getRotationAngle(orientation) }deg)`;

            if (isEven) {
                line.style.left = 'calc(50% - var(--tile-width) / 2)';
                line.style.top = 'calc(50% - var(--tile-height) / 2)';
            }
            break;
    }
}

function getRotationAngle(orientation) {
    switch (orientation) {
        case 'RIGHT_TOP': return -45;
        case 'RIGHT_BOTTOM': return 45;
        case 'LEFT_BOTTOM': return 135;
        case 'LEFT_TOP': return -135;
    }
}
