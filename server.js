const express = require("express");
const app = express();

app.use(express.json());

// rota principal
app.get("/", (req, res) => {
    res.send("Servidor online");
});

// webhook com segurança
app.post("/webhook", (req, res) => {
    try {
        const tokenRecebido = req.headers["asaas-access-token"];
        const meuToken = "whsec_Q4IofYJCnmuXCL_BEwFEZZz5SpoCZXGfVpbdcz2hGm0";

        if (!tokenRecebido || tokenRecebido !== meuToken) {
            console.log("Token inválido");
            return res.sendStatus(401);
        }

        console.log("Webhook válido recebido:");
        console.log(req.body);

        const data = req.body;

        if (data.event === "PAYMENT_RECEIVED") {
            console.log("Pagamento confirmado!");
        }

        res.sendStatus(200);

    } catch (erro) {
        console.error("Erro no webhook:", erro);
        res.sendStatus(500);
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando");
});
