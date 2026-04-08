const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 SUA API KEY DO ASAAS
const ASAAS_API_KEY = "$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjRhNDBkMjFmLWQ1MzMtNDQ2Zi04ODhmLWRiYzUwODFkNmFiNzo6JGFhY2hfZjdmNmY0ZGYtZmMwYi00OWU1LTg0ODYtZTQ5MTM3NGRiMmVi"; // ⚠️ TROCA ISSO

// ✅ ROTA PRINCIPAL
app.get("/", (req, res) => {
    res.send("Servidor online");
});

// ✅ WEBHOOK (NÃO BLOQUEIA MAIS NADA)
app.post("/webhook", (req, res) => {
    console.log("Webhook recebido");

    res.sendStatus(200);

    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
});

// ✅ CRIAR PAGAMENTO (COM CLIENTE AUTOMÁTICO)
app.post("/criar-pagamento", async (req, res) => {
    try {
        const { metodo, valor } = req.body;

        // 🔥 1. CRIAR CLIENTE
        const clienteRes = await fetch("https://api.asaas.com/v3/customers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "access_token": ASAAS_API_KEY
            },
            body: JSON.stringify({
                name: "Cliente Teste",
                cpfCnpj: "12345678909", // pode trocar depois
                email: "teste@email.com"
            })
        });

        const cliente = await clienteRes.json();

        if (!cliente.id) {
            console.log("Erro ao criar cliente:", cliente);
            return res.status(400).json(cliente);
        }

        // 🔥 2. CRIAR PAGAMENTO
        const pagamentoRes = await fetch("https://api.asaas.com/v3/payments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "access_token": ASAAS_API_KEY
            },
            body: JSON.stringify({
                customer: cliente.id,
                billingType: metodo, // PIX, BOLETO, CREDIT_CARD
                value: valor,
                dueDate: "2026-04-10",
                description: "Compra no site"
            })
        });

        const pagamento = await pagamentoRes.json();

console.log("Resposta Asaas:", pagamento);

// 🔥 SE FOR PIX, BUSCA QR CODE
if (metodo === "PIX") {
    const pixRes = await fetch(
        `https://api.asaas.com/v3/payments/${pagamento.id}/pixQrCode`,
        {
            method: "GET",
            headers: {
                "access_token": ASAAS_API_KEY
            }
        }
    );

    const pixData = await pixRes.json();

    return res.json({
        ...pagamento,
        pixQrCode: pixData.payload,
        pixQrCodeImage: pixData.encodedImage
    });
}

// outros métodos
res.json(pagamento);

    } catch (erro) {
        console.error("Erro:", erro);
        res.status(500).json({ erro: "Erro ao criar pagamento" });
    }
});

// ✅ PORTA
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
});
