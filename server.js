const express = require("express");
const app = express();

app.use(express.json());

// rota principal
app.get("/", (req, res) => {
    res.send("Servidor online");
});

// webhook
app.post("/webhook", (req, res) => {
    console.log("Webhook recebido:");
    console.log(req.body);

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando");
});
