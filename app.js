const express = require("express")
const app = express();
const PORT = 8080;
const fs = require("fs");
const CAMINHO_ARQUIVO = "./livros.json";

// Middlewere para interpretar JSON no corpo da requisição
app.use(express.json());


if(!fs.existsSync(CAMINHO_ARQUIVO)) {
    fs.writeFileSync(CAMINHO_ARQUIVO,'[]');
}

app.post("/livros", (req,res)=>{
    try {
        const {nome,preco,autor,genero} = req.body;

        if (nome == "" || nome == undefined || preco == undefined || autor == "" || autor  == undefined || genero == "" || genero == undefined || isNaN(preco)) {
            return res.status(400).json({message:"Campos obrigatorios nao preenchidos!"});

        }

        const data = fs.readFileSync(CAMINHO_ARQUIVO, "utf-8");
        let livros = JSON.parse(data);

        const novoLivro = {
            id: livros.length + 1,
            nome,
            preco,
            autor,
            genero

        }

        livros.push(novoLivro);

        fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(livros, null, 4));


            res.status(201).json({
                message: `Livro cadastrado com sucesso!`,
                livros: novoLivro
            });
    } catch (error) {
        console.error(`Erro ao cadastrar livros${error}`);
        res.status(500),json({message: `Erro interno no servidor`});
        
    }

})

app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta${PORT}`);


});