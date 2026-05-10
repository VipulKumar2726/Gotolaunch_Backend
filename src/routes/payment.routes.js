const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.post("/create-order", paymentController.createOrder);
router.post("/verify-payment", paymentController.verifyPayment);
router.get("/test", (req, res) => {
  res.json({ message: "Payment route is working!" });
});

module.exports = router;