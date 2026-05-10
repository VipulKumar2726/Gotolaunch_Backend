const razorpay = require("../config/razorpay");
const crypto = require('crypto');

class PaymentService {
  static async createOrder(amount) {
    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    return await razorpay.orders.create(options);
  }

  static async verifyPayment(paymentId, orderId, signature) {
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    return expectedSignature === signature;
  }
}

module.exports = PaymentService;