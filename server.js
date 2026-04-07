const express = require("express");
const cors = require("cors");

const app = express();

// 🔥 LIBERA ACESSO DO SEU SITE (ESSENCIAL)
app.use(cors());
app.use(express.json());

// ✅ ROTA PRINCIPAL
app.get("/", (req, res) => {
    res.send("Servidor online");
});

// ✅ WEBHOOK (ASAAS)
app.post("/webhook", (req, res) => {
    console.log("Webhook recebido");

    // 🔥 responde rápido (evita erro 408)
    res.sendStatus(200);

    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    const data = req.body;

    if (data.event === "PAYMENT_RECEIVED") {
        console.log("💰 Pagamento confirmado!");
    }
});

// ✅ CRIAR PAGAMENTO
app.post("/criar-pagamento", async (req, res) => {
    try {
        const { metodo } = req.body;

        const response = await fetch("https://api.asaas.com/v3/payments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "access_token": "$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjI4ZjhmNWI1LTQyNzMtNDQwZC05MDY5LTY4ODczODU4ZTdkNzo6JGFhY2hfZWQwOGFjMDgtOWU3My00Mjk2LWFjNGEtN2QwYTg1ZTdmZjNi" // 🔥 API KEY REAL DO ASAAS
            },
            body: JSON.stringify({
                customer: "cus_000000000", // depois ajustamos isso
                billingType: metodo, // 🔥 PIX, BOLETO ou CREDIT_CARD
                value: 10.00,
                dueDate: "2026-04-10",
                description: "Compra no site"
            })
        });

        const data = await response.json();

        console.log("Resposta Asaas:", data);

        res.json(data);

    } catch (erro) {
        console.error("Erro ao criar pagamento:", erro);
        res.status(500).json({ erro: "Erro ao criar pagamento" });
    }
});

// ✅ PORTA
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
});
