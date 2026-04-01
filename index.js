const express = require("express");
const mercadopago = require("mercadopago");

const app = express();
app.use(express.json());

mercadopago.configure({
  access_token: process.env.TOKEN
});

app.post("/pix", async (req, res) => {
  try {
    const payment = await mercadopago.payment.create({
      transaction_amount: 50,
      description: "Produto",
      payment_method_id: "pix",
      payer: {
        email: "teste@email.com"
      }
    });

    res.json({
      copiaecola: payment.body.point_of_interaction.transaction_data.qr_code,
      qr: payment.body.point_of_interaction.transaction_data.qr_code_base64
    });

  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(process.env.PORT || 3000);
