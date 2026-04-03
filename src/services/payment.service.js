const razorpay = require("../config/razorpay");

class PaymentService {
  static async createOrder(amount) {
    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    return await razorpay.orders.create(options);
  }
}

module.exports = PaymentService;