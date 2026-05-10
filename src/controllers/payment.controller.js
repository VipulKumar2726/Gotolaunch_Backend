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

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const isValid = await PaymentService.verifyPayment(razorpay_payment_id, razorpay_order_id, razorpay_signature);

    if (isValid) {
      // Here you can update your database, e.g., mark the payment as successful
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to verify payment" });
  }
};