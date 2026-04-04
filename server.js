const express = require("express");
const app = express();

app.use(express.json());

// ✅ ROTA PRINCIPAL
app.get("/", (req, res) => {
    res.send("Servidor online");
});

// ✅ WEBHOOK (SEM ERRO 401 / 408)
app.post("/webhook", (req, res) => {
    console.log("Webhook recebido");

    // 🔥 responde imediatamente (ESSENCIAL)
    res.sendStatus(200);

    // logs para ver o que chega
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    const data = req.body;

    // exemplo de evento
    if (data.event === "PAYMENT_RECEIVED") {
        console.log("💰 Pagamento confirmado!");
    }
});

// ✅ CRIAR PAGAMENTO (PIX, BOLETO, CARTÃO)
app.post("/criar-pagamento", async (req, res) => {
    try {
        const response = await fetch("https://api.asaas.com/v3/payments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "access_token": "whsec_l1M4NqFT6EFQmZ044sqDuFKqEfc6na5DHoIT2xpMxCo" // 🔥 COLOCA SUA API KEY DO ASAAS
            },
            body: JSON.stringify({
                customer: "cus_000000000", // depois você pode melhorar isso
                billingType: "PIX", // PIX, BOLETO ou CREDIT_CARD
                value: 10.00,
                dueDate: "2026-04-10",
                description: "Compra no site"
            })
        });

        const data = await response.json();

        res.json(data);

    } catch (erro) {
        console.error("Erro ao criar pagamento:", erro);
        res.status(500).json({ erro: "Erro ao criar pagamento" });
    }
});

// ✅ PORTA (Render usa automaticamente)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
});
