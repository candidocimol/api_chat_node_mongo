const express = require('express');
const cors = require('cors');


const token = require('./util/token');
const salaController = require("./controllers/salaController");
const usuarioController = require("./controllers/usuarioController");
const app = express();
app.use(cors());
app.listen(3000, () => {
  console.log('Servidor API iniciado na porta 3000');
});
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const router = express.Router();

app.use('/', router.get('/', async (req,res) => {
	let resp= await salaController.get();
	res.status(200).send("<h4>API - CHAT</h4>");
}))

app.use("/sobre", router.get('/sobre', (req,res) => {
	res.status(200).send({
		"nome":"API-CHAT",
		"versao":"0.1.0",
		"autor":"Cândido Farias"
	});
}));

app.use("/entrar", router.post("/entrar", async (req, res, next) => {
	
	let resp = await usuarioController.entrar(req.body.nick);
	res.status(200).send(resp);
	console.log(resp);
}))

app.use('/criarSala', router.post ("/criarSala", async (req, res) => {
	if(await token.checkToken(req.headers.token,req.headers.idUser,req.headers.nick)) {
		let resp = await salaController.criarSala(req.body.nomeSala);
		res.status(200).send(resp);
	}else{
		res.status(400).send({msg:"Erro ao criar sala"});
	}

}));

app.use("/salas",router.get("/salas", async (req, res,next) => {
		if(await token.checkToken(req.headers.token,req.headers.idUser,req.headers.nick)) {
		let resp= await salaController.get();
		res.status(200).send(resp);
	}else{
		res.status(400).send({msg:"Usuário não autorizado"});
	}	
}))

app.use("/sala/entrar", router.put("/sala/entrar", async (req, res)=>{
	if(!token.checkToken(req.headers.token,req.headers.idUser,req.headers.nick)) return false;
	let resp= await salaController.entrar(req.headers.idUser, req.query.idsala);
	res.status(200).send(resp);
}))

app.use("/sala/mensagem/", router.post("/sala/mensagem", async (req, res) => {
	if(!token.checkToken(req.headers.token,req.headers.idUser,req.headers.nick)) return false;
	let resp= await salaController.enviarMensagem(req.headers.nick, req.body.msg,req.body.idSala);
	res.status(200).send(resp);
}))

app.use("/sala/mensagens/", router.get("/sala/mensagens", async (req, res) => {
	if(!token.checkToken(req.headers.token,req.headers.idUser,req.headers.nick)) return false;
	let resp= await salaController.buscarMensagens(req.query.idSala, req.query.timestamp);
	res.status(200).send(resp);
}))

app.use("/sala/sair/", router.put("/sala/sair", async (req, res) => {
	if(!token.checkToken(req.headers.token,req.headers.idUser,req.headers.nick)) return false;
	let resp= await salaController.sairSala(req.query.idsala, req.headers.idUser);
	res.status(200).send(resp);
}))

module.exports=app;
