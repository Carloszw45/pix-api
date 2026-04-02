const express = require("express");
const app = express();

app.use(express.json());

const ASAAS_API_KEY = "$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjBkOGFkMDkyLTUwNTktNDRhMi1hMGFjLTFhM2E4YzVhNGMwYTo6JGFhY2hfZDExOWVhZWEtMDcxOS00Yzk5LTkwNmItNGU4OGM1MWMxMjE5";

// rota teste
app.get("/", (req, res) => {
    res.send("Servidor online");
});

// webhook
app.post("/webhook", async (req, res) => {
    try {
        const data = req.body;

        console.log("Webhook recebido:", data);

        if (data.event === "PAYMENT_RECEIVED") {

            const paymentId = data.payment.id;

            console.log("Consultando pagamento:", paymentId);

            // consulta na API do Asaas
            const response = await fetch(`https://api.asaas.com/v3/payments/${paymentId}`, {
                method: "GET",
                headers: {
                    "access_token": ASAAS_API_KEY,
                    "Content-Type": "application/json"
                }
            });

            const pagamento = await response.json();

            console.log("Dados do pagamento:", pagamento);

            // validação segura
            if (pagamento.status === "RECEIVED") {
                console.log("💰 PAGAMENTO CONFIRMADO DE VERDADE");

                // 👉 liberar produto aqui
            } else {
                console.log("Pagamento ainda não confirmado");
            }
        }

        res.sendStatus(200);

    } catch (error) {
        console.error("Erro:", error);
        res.sendStatus(500);
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando");
});
