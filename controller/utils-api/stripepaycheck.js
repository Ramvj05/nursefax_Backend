const express = require("express");
const https = require("https");
const { default: axios } = require("axios");
const { v4: uuidv4 } = require("uuid");
const app = express();
require("dotenv").config()
const bodyParser = require("body-parser")
const cors = require("cors")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// const PaytmChecksum = require("./config/cheksum");
// const PaytmConfig = require("./config/config");
const endpoints = require("../../endpoints/endpoints");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)


router.get("/check/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    if (paymentIntent?.status === "succeeded") {
      return res.json({
        status: 200,
        message: "Payment successful!",
        id,
      });
    }
    res
      .status(400)
      .json({
        status: 200,
        message: "Payment failed! Please try again later.",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});

module.exports = router;




      