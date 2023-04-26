const express = require("express");
const https = require("https");
const { default: axios } = require("axios");
const { v4: uuidv4 } = require("uuid");
const app = express();

// const PaytmChecksum = require("./config/cheksum");
// const PaytmConfig = require("./config/config");
const endpoints = require("../../endpoints/endpoints");

const router = express.Router();


const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Learn React Today" }],
  [2, { priceInCents: 20000, name: "Learn CSS Today" }],
])

router.post("/create-checkout-session", async (req, res) => {
  try {
    console.log(req.body,"ooooooooooooooooooooooooo")

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        }
      }),
      success_url: `${"http://localhost:3001/dashboard/courses"}`,
      cancel_url: `${"http://localhost:3001/dashboard/courses"}`,
    })
    res.json({ url: session.url })
  } catch (e) {
    console.log(e,"ooooooooooooooooooooooooo")
    res.status(500).json({ error: e.message })
  }
})


module.exports = router;




      