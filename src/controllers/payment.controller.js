const PaymentService = require("../services/payment.service");

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await PaymentService.createOrder(amount);

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: "Failed to create order" });
  }
};