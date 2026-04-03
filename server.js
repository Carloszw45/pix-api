app.post("/webhook", (req, res) => {

    const tokenRecebido = req.headers["asaas-access-token"];
    const meuToken = "whsec_0v8tdYh7AaAHFs94UVHHaLMe4Sze9xgDqUmU1FzBdxY";

    // 🔒 Validação de segurança
    if (tokenRecebido !== meuToken) {
        console.log("Acesso não autorizado!");
        return res.sendStatus(401);
    }

    console.log("Webhook válido recebido:");
    console.log(req.body);

    const data = req.body;

    if (data.event === "PAYMENT_RECEIVED") {
        console.log("Pagamento confirmado!");
    }

    res.sendStatus(200);
});
