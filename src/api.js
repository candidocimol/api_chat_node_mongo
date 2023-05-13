const express = require('express');
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const router = express.Router();

app.use('/', router.get('/', (req,res) => {
	res.status(200).send("<h4>API - CHAT</h4>");
}))

app.use("/", router.get('/sobre', (req,res) => {
	res.status(200).send({
		"nome":"API-CHAT",
		"versao":"0.1.0",
		"autor":"Cândido Farias"
	});
}));

module.exports=app;
