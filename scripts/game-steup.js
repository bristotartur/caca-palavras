import { Dictionary } from './words.js';

const letters = 'ABCDEFGHIJLMNOPQRSTUVXZÇÁÃÂÉÊÍÓÔÚ';
const specialCharacters = 'ÇÁÃÂÉÊÍÓÔÚ';

const rowsCount = 12;
const columnsCount = 12;

const words = [];
const wordRowsMap = new Map();
const orientations = ['VERTICAL', 'HORIZONTAL', 'DIAGONAL'];
const diagonalOrientations = ['LEFT_TOP', 'LEFT_BOTTOM', 'RIGHT_TOP', 'RIGHT_BOTTOM'];

let wordLetters = [];

document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    const boardTiles = populateBoard(board);
    
    addLetters(board.children);
    addWords(boardTiles);
    addWordRows();
});

export function getWords() {
    return words;
}

export function getWordRowsMap() {
    return wordRowsMap;
}

function populateBoard(board) {
    let tiles = [];

    for (let i = 0; i < rowsCount; i++) {
        tiles[i] = [];

        for (let j = 0; j < columnsCount; j++) {
            let tile = document.createElement('div');
    
            tile.classList.add('tile');
            tile.id = `${ i }-${ j }`;
            
            board.appendChild(tile);
            tiles[i][j] = tile;
        }
    }
    return tiles;
}

function addLetters(tiles) {
    const totalLetters = letters.length;

    for (let tile of tiles) {
        if (wordLetters.includes(tile)) continue;

        let letter = letters.charAt(Math.floor(Math.random() * totalLetters));

        if (specialCharacters.includes(letter)) {
            letter = letters.charAt(Math.floor(Math.random() * totalLetters));
        }
        let span = tile.querySelector('span');

        if (span) {
            span.innerHTML = letter;
        } else {
            span = document.createElement('span');
            span.innerHTML = letter;
            tile.appendChild(span);
        }
    }
}

function addWords(tiles) {
    const dictionary = new Dictionary();

    let wordsToAdd = 12; 
    
    while (wordsToAdd > 0 ) {
        let wordAdded = false;
        let range = orientations.length;
        let word = dictionary.getRandomWord().toUpperCase();

        let orientation = orientations[Math.floor(Math.random() * range)];

        switch (orientation) {
            case 'VERTICAL':
                wordAdded = setStraightWord(word, tiles, orientation);
                break;
            case 'HORIZONTAL':
                wordAdded = setStraightWord(word, tiles, orientation);
                break;
            case 'DIAGONAL':
                wordAdded = setDiagonalWord(word, tiles);
                break;
        }
        if (wordAdded) {
            words.push(word);
            wordsToAdd--;
        }
    }
}

function addWordRows() {
    const row1 = document.querySelector('.row-1');
    const row2 = document.querySelector('.row-2');
    const row3 = document.querySelector('.row-3');

    words.forEach((word, i) => {
        let span = document.createElement('span');
        span.id = `span-${ i }`;
        span.innerHTML = word;

        if (i <= 3) {
            row1.appendChild(span);
            wordRowsMap.set(word, span.id);
        } else if (i <= 7) {
            row2.appendChild(span);
            wordRowsMap.set(word, span.id);
        } else {
            row3.appendChild(span)
            wordRowsMap.set(word, span.id);
        }
    });
}

function setStraightWord(word, tiles, orientation) {
    const isVertical = orientation === 'VERTICAL';
    const wordSize = word.length;

    let wasWordAdded = false;
    let attempts = 10;

    while (!wasWordAdded && attempts > 0) {
        attempts--;

        let row = Math.floor(Math.random() * rowsCount);
        let column = Math.floor(Math.random() * columnsCount);

        word = reverseWord(word);

        if ((isVertical && wordSize > rowsCount - row) || (!isVertical && wordSize > columnsCount - column)) continue;

        let wordFits = true;

        for (let i = 0; i < wordSize; i++) {
            let tile = (isVertical) ? tiles[row + i][column] : tiles[row][column + i];
            wordFits = checkLetterToFitTile(word.charAt(i), tile);

            if (!wordFits) break;
        }

        if (wordFits) {
            word.split('').forEach((letter, i) => {
                let tile = (isVertical) ? tiles[row + i][column] : tiles[row][column + i];
                addLetterToTile(letter, tile);
            });
            wasWordAdded = true;
        }
    }
    return wasWordAdded;
}

function setDiagonalWord(word, tiles) {
    const wordSize = word.length;
    
    let wasWordAdded = false;
    let attempts = 10;

    while (!wasWordAdded && attempts > 0) {
        attempts--;

        let orientation = diagonalOrientations[Math.floor(Math.random() * diagonalOrientations.length)];
        let targetCoords = getDiagonalCoordinates(orientation, wordSize);

        word = reverseWord(word);

        if (targetCoords.length !== wordSize) continue;

        let wordFits = true;

        for (let i = 0; i < wordSize; i++) {
            let tile = tiles[targetCoords[i].row][targetCoords[i].column];
            wordFits = checkLetterToFitTile(word.charAt(i), tile);

            if (!wordFits) break;
        }

        if (wordFits) {
            word.split('').forEach((letter, i) => {
                let tile = tiles[targetCoords[i].row][targetCoords[i].column];
                addLetterToTile(letter, tile);
            });
            wasWordAdded = true;
        }
    }
    return wasWordAdded;
}

function reverseWord(word) {
    let willReverse = Math.floor(Math.random() * 5) % 5 === 0;
    if (willReverse) {
        word = word.split('').reverse().join('');
    }
    return word;
}

function checkLetterToFitTile(letter, tile) {
    let span = tile.querySelector('span');

    if (wordLetters.includes(tile) && span.innerHTML !== letter) {
        return false;
    }
    return true;
}

function addLetterToTile(letter, tile) {
    if (!wordLetters.includes(tile)) {
        // tile.classList.add('belongs-to-word');   // para testes
        wordLetters.push(tile);
    }
    tile.querySelector('span').innerHTML = letter;
}

function getDiagonalCoordinates(orientation, wordSize) {
    let row = Math.floor(Math.random() * rowsCount);
    let column = Math.floor(Math.random() * columnsCount);
    let coords = [];

    for (let i = 0; i < wordSize; i++) {
        let coord = {};
        switch (orientation) {
            case 'RIGHT_TOP':
                coord = { row: row - i, column: column + i };
                break;
            case 'RIGHT_BOTTOM':
                coord = { row: row + i, column: column + i };
                break;
            case 'LEFT_BOTTOM':
                coord = { row: row + i, column: column - i };
                break;
            case 'LEFT_TOP':
                coord = { row: row - i, column: column - i };
                break;
        }
        if (coord.row < 0 || coord.row >= rowsCount || coord.column < 0 || coord.column >= columnsCount) break;

        coords.push(coord);
    }
    return coords;
}
