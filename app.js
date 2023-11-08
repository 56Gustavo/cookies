// Importando o framework express
const express = require('express');

// Importando as bibliotecas de sessão e cookies
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Inicializar a aplicação express
const app = express();

// Configurando os cookies
app.use(cookieParser());

// Configurando as sessões
app.use(
    session({
        secret: 'minhachave', // chave secreta para assinar os cookies da sessão
        resave: false, // evitar regravar sessões sem alterações
        saveUninitialized: true, // salvar sessão não inicializada
    })
);

const produtos = [
    { id: 1, nome: 'Arroz', tipo: 1, preco: 25 },
    { id: 2, nome: 'Feijão', tipo: 1, preco: 15 },
    { id: 3, nome: 'Bife', tipo: 1, preco: 40 },
    { id: 4, nome: 'Detergente', tipo: 2, preco: 25 },
    { id: 5, nome: 'Água sanitária', tipo: 2, preco: 15 },
    { id: 6, nome: 'Sabão em pó', tipo: 2, preco: 40 },
];

// ROTA inicial
app.get('/produtos', (req, res) => {
    res.send(`
        <h1>Lista de Produtos</h1>
        <ul>
            ${produtos.map(
                (produto) => `<li>${produto.nome} - ${produto.preco} <a href="/adicionar/${produto.id}"> Adicionar ao Carrinho </a></li>`
            ).join('')}
        </ul>
        <a href="/carrinho"> Ver Carrinho</a>
    `);
});

// Rota de adicionar
app.get('/adicionar/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find((p) => p.id === id);

    if (produto) {
        if (!req.session.carrinho) {
            req.session.carrinho = [];
        }
        req.session.carrinho.push(produto);
    }

    res.redirect('/produtos');
});

// Rota do carrinho
app.get('/carrinho', (req, res) => {
    const carrinho = req.session.carrinho || [];
    const total = carrinho.reduce((acc, produto) => acc + produto.preco, 0);

    // Obter o tipo do último produto adicionado
    const ultimoTipoAdicionado = carrinho.length > 0 ? carrinho[carrinho.length - 1].tipo : null;

    // Filtrar os produtos no carrinho com o mesmo tipo do último produto adicionado
    const produtosMesmoTipo = carrinho.filter((produto) => produto.tipo === ultimoTipoAdicionado);

    res.send(`
        <h1>Carrinho de Compras</h1>
        <ul>
            ${carrinho.map(
                (produto) => `<li>${produto.nome} - ${produto.preco} ${produto.tipo}</li>`
            ).join('')}
        </ul>

        <h2>Produtos do Mesmo Tipo do Último Adicionado:</h2>
        <ul>
            ${produtosMesmoTipo.map(
                (produto) => `<li>${produto.nome} - ${produto.preco} ${produto.tipo}</li>`
            ).join('')}
        </ul>

        <p>Total: ${total}</p>
        <a href="/produtos">Continuar comprando</a>
    `);
});

app.listen(3000, () => console.log('Aplicação rodando'));
