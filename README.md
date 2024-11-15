# Caça-palavras

Este projeto é um jogo de caça-palavras desenvolvido utilizando HTML, CSS e JavaScript. O objetivo do jogo é encontrar todas as palavras escondidas na grade de letras. O jogo contém mais de 200 palavras que são sorteadas aleatoriamente toda vez que a página é carregada.

Caso queira jogar, [cliqe aqui](https://bristotartur.github.io/caca-palavras/) ou acesse `https://bristotartur.github.io/caca-palavras/`.

## Demonstração

![Exemplo do jogo](./assets/imagem-exemplo.png)

## Estrutura do Projeto

```bash
caca-palavras/
├── assets/
│   └── imagem-exemplo.png
│
├── scripts/
│   ├── game-interactions.js
│   ├── game-steup.js
│   └── words.js
│
├── styles/
│   ├── index.css
│   └── media-queries.css
│
├── index.html
├── README.md
```

- **index.html**: Contém a estrutura HTML básica da página.

- **game-setup.js**: Gera todo o restante da estrutura, adicionando as letras e posicionando as palavras na grade.

- **game-interactions.js**: Define todas as interações possíveis do usuário no jogo, como o traçamento das linhas, além da geração do destaque nas palavras encontradas.

- **words.js**: Contém a classe *Dictionary* responsável por fornecer as palavras a serem utilizadas.

- **style.css**: Contém os estilos CSS para o layout e aparência do jogo.

- **media-queries.css**: Contém as *media queries* para tornar o layout responsívo.

## Rodando o Projeto

Abra o terminal de sua preferência e clone o repositório:

```bash
git clone https://github.com/bristotartur/caca-palavras.git
```

Existem diversas formas de rodar o projeto, sendo uma das mais simples utilizando `http-server`. Para utlizá-lo, instale-o globalmente (se ainda não tiver):

```bash
npm install -g http-server
```

Após instalá-lo, navegue até o diretório do projeto e inicialize o servidor:

```bash
http-server -p 8000
```

Com o servidor rodando, você pode abrir o seu navegador e acessar o projeto em `http://localhost:8000`.

Uma outra maneira, e ainda mais simples, de rodar o projeto é através do próprio `VS Code`. Basta ter a extensão `Live Server` instalada e utilizar o comando `[Alt + L, Alt + O]` no arquivo `index.html` para iniciar o servidor e abrir a página diretamente em seu navegador padrão.

## Como Contribuir

1. Faça um fork do repositório.

2. Crie uma nova branch (`git checkout -b feature/nova-funcionalidade`).

3. Faça suas modificações.

4. Faça o commit de suas alterações com uma mensagem clara e, se possível, com uma descrição detalhada das alterações adicionadas (`git commit -m 'Nova funcionalidade adicionada' -m 'Descrição da funcionalidade'`).

5. Faça o push para a branch (`git push origin feature/nova-funcionalidade`).

6. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
