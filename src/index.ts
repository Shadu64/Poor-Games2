import express from 'express';
import cors from 'cors';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';



const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Server rodando na porta 3003");
});
type game = {
    id: string,
    pagina: number,
    nome: string,
    dataLancamento: string,
    genero: string
    preco: number
}

type user = {
    id: number,
    pagina : number,
    nick: string,
    senha: string 
    email: string,
}
const Users: user[] = [
{
    id: 1,
    pagina : 1,
    nick: "ADCpçãodaFamilia",
    senha:"SkibidiToiletRizz",
    email: "espantaxota@gmail.com"
},

{
    id: 2,
    pagina :1,
    nick: "Momoi",
    senha:"Kuyashi",
    email: "Kachira@gmail.com" 
}
]
const Games = [
    {
        id: uuidv4(),
        pagina: 1,
        nome: "Tower Of Fantasy",
        dataLancamento: "16/12/2021",
        genero: "MMORPG",
        preco: 200,
    },
    {
        id: uuidv4(),
        pagina: 1,
        nome: "Batman Arknight",
        dataLancamento: "23/06/2015",
        genero: "Ação",
        preco: 145
    }
];

app.get('/jogos', (req: Request, res: Response): any => {
    const { pagina = 1, limite = 10 } = req.query;

    const numeroPagina = Number(pagina);
    const numeroLimite = Number(limite);

    if (isNaN(numeroPagina) || isNaN(numeroLimite)) {
        return res.status(400).json({ message: "Página e Limite devem ser números" });
    }

    const jogosFiltrados = Games.filter(game => game.pagina === numeroPagina);

    const indexInicial = (numeroPagina - 1) * numeroLimite;
    const indexFinal = indexInicial + numeroLimite;

    const jogosPaginados = jogosFiltrados.slice(indexInicial, indexFinal);

    return res.json(jogosPaginados);
});

app.get('/jogos/genero', (req: Request, res: Response): any => {
    const { genero } = req.query;

    if (!genero) {
        return res.status(400).json({ message: "Gênero Obrigatório" });
    }

    const jogosPorGenero = Games.filter(game => game.genero === genero);

    if (jogosPorGenero.length === 0) {
        return res.status(404).json({ message: "Nenhum jogo encontrado" });
    }

    return res.json(jogosPorGenero);
});

app.post('/jogos', (req: Request, res: Response): any => {
    const { nome, dataLancamento, genero, preco } = req.body;

    if ( !nome || !dataLancamento || !genero || !preco) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }
    // id é criado usando uuid v7
    const id = uuidv4();
    
    const jogoExistente = Games.find(game => game.nome === nome);
    if (jogoExistente) {
        return res.status(400).json({ message: "Jogo com este ID já existe." });
    }

    const novoJogo: game = {
        id,
        pagina: 1,
        nome,
        dataLancamento,
        genero,
        preco
    };

    Games.push(novoJogo);

    return res.status(201).json(novoJogo);
});

app.put('/jogos/:id', (req: Request, res: Response): any => {
    const { id } = req.params;  
    const { nome, dataLancamento, genero, preco } = req.body;

    if (!nome || !dataLancamento || !genero || !preco) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    const jogoIndex = Games.findIndex(game => game.id === String(id));

    if (jogoIndex === -1) {
        return res.status(404).json({ message: "Jogo não encontrado" });
    }

    const jogoAtualizado = {
        ...Games[jogoIndex],
        nome,
        dataLancamento,
        genero,
        preco,
    };

    Games[jogoIndex] = jogoAtualizado;

    return res.json(jogoAtualizado);
});

app.delete('/jogos/:id', (req: Request, res: Response): any => {
    const { id } = req.params;

    const jogoIndex = Games.findIndex(game => game.id === String(id));

    if (jogoIndex === -1) {
        return res.status(404).json({ message: "Jogo não encontrado" });
    }

    Games.splice(jogoIndex, 1);

    return res.status(200).json({ message: "Jogo removido com sucesso" });
});



app.get('/usuarios', (req: Request, res: Response): any => {
    const { pagina = 1, limite = 10 } = req.query;

    const numeroPagina = Number(pagina);
    const numeroLimite = Number(limite);

    if (isNaN(numeroPagina) || isNaN(numeroLimite)) {
        return res.status(400).json({ message: "Página e Limite devem ser números" });
    }

    const usuariosFiltrados = Users.filter(user => user.pagina === numeroPagina);

    const indexInicial = (numeroPagina - 1) * numeroLimite;
    const indexFinal = indexInicial + numeroLimite;

    const usuariosPaginados = usuariosFiltrados.slice(indexInicial, indexFinal);

    return res.json(usuariosPaginados);
});




