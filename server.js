const express = require("express");
const app = express();

app.use(express.json());

// rota principal
app.get("/", (req, res) => {
    res.send("Servidor online");
});

// 🔥 WEBHOOK (AQUI)
app.post("/webhook", (req, res) => {
    const tokenRecebido = req.headers["asaas-access-token"];
    const meuToken = "whsec_l1M4NqFT6EFQmZ044sqDuFKqEfc6na5DHoIT2xpMxCo";

    if (!tokenRecebido) {
        return res.sendStatus(200);
    }

    if (tokenRecebido !== meuToken) {
        return res.sendStatus(401);
    }

    console.log("Webhook recebido:", req.body);

    res.sendStatus(200);
});

// sua rota de pagamento continua aqui
app.post("/criar-pagamento", async (req, res) => {
    // seu código aqui
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando");
});
