//Configurar o servidor
const express = require("express")
const server = express()

//Configurar o servidor para apresentar arquivos extras (css, js, png, etc)

server.use(express.static('public'))

//habilitar corpo (body) do formulário

server.use(express.urlencoded({extended: true}))

//Configurar a conexao com o banco de dados

const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: '5432',
    database: 'doe'
})

//Configurar a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//Configurar a apresentação da página
server.get("/",function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if(err)
            return res.send("Erro de banco de dados.")
        
        const donors = result.rows
        return res.render("index.html",{donors})    
    })

    
})

server.post("/", function(req, res){
    //Pegar dados do formulário

    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == "")
        return res.send("Todos os campos são obrigatórios.")

    //colocar valores dentro do banco de dados.
    const query = `
        INSERT INTO "donors" ("name", "email", "blood")
        VALUES ($1, $2, $3)`
    
    db.query(query, [name, email, blood], function(err){
        //fluxo de erro
        if(err)
            return res.send("Erro no Banco de Dados.")
        //fluxo normal
        return res.redirect("/")    
    })
})

//Ligar o Servidor usando a porta 3000
server.listen(3000, function(){
    console.log("servidor iniciado.")
})