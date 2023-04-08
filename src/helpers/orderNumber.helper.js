function generateOrderNumber(length = 8) {
    const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let orderNumber = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
      orderNumber += alphanumericChars[randomIndex];
    }
    return orderNumber;
  }

  module.exports = generateOrderNumber()