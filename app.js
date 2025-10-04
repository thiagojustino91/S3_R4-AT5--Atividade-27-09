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

app.get("/livros",(req,res) => {
    try {
        const data = fs.readFileSync('./livros.json','utf-8');

        let livros = JSON.parse(data);

        const { Titulo } = req.query;

        if (Titulo) {
             livros = livros.filter(livro =>
                livro.Titulo.toLowerCase()
                .includes(Titulo.toLowerCase())
             )
        }


         res.status(200).json(livros);



    } catch (error) {
        console.error('Erro ao ler arquivo JSON', error);
        res.status(500).json({ message: 'Erro interno no servidor' });

    }

});



app.post("/livros", (req,res)=>{
    try {
        const {Titulo,Autor,AnoDePublicacao,QtdDeDisponivel} = req.body;

        if (Titulo == "" || Titulo == undefined || Autor == "" || Autor  == undefined || AnoDePublicacao  == "" || AnoDePublicacao == undefined || QtdDeDisponivel == "" || QtdDeDisponivel == undefined || isNaN (AnoDePublicacao) || isNaN (QtdDeDisponivel)) {
            return res.status(400).json({message:"Campos obrigatorios nao preenchidos!"});

        }

        const data = fs.readFileSync(CAMINHO_ARQUIVO, "utf-8");
        let livros = JSON.parse(data);

        const novoLivro = {
            id: livros.length + 1,
            Titulo,
            Autor,
            AnoDePublicacao,
            QtdDeDisponivel

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