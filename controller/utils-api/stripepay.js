const express = require("express");
const https = require("https");
const { default: axios } = require("axios");
const { v4: uuidv4 } = require("uuid");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// const PaytmChecksum = require("./config/cheksum");
// const PaytmConfig = require("./config/config");
const endpoints = require("../../endpoints/endpoints");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

router.post("/create-checkout-session", cors(), async (req, res) => {
  let { amounts, id } = req.body;
  let amount = Math.round(amounts * 100);
  // console.log(amount,"ooooooooooooooooo");

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "INR",
      description: "NurseFax Course Enrolment",
      payment_method: id,
      confirm: true,
    });
    // console.log("Paymentsssssssssssssss", payment.status)
    if (payment.status === "succeeded") {
      // Payment successful!
      res.json({
        status: 200,
        success: true,
        message: "Payment Successful!",
        id: paymentIntent.id,
      });
    } else if (payment.status === "requires_action") {
      res.json({
        status: 200,
        success: true,
        message: "3D secure required",
        actionRequired: true,
        clientSecret: payment.client_secret,
      });
    } else {
      res.json({
        message: "Payment successful",
        success: true,
      });
    }
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment failed",
      success: false,
    });
  }
});
router.get("/check/:id", async (req, res) => {
  try {
    console.log("11111111111111111111");
    const id = req.params.id;
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    if (paymentIntent?.status === "succeeded") {
      return res.json({
        status: 200,
        message: "Payment successful!",
        id,
      });
    }
    res.status(400).json({
      status: 200,
      message: "Payment failed! Please try again later.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});

module.exports = router;
