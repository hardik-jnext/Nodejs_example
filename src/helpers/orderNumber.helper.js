//Task no.28 (Check how to create a function which returns random number with length of 8 Alphanumeric)
//Task no.29 (Create a common function in helper to use it in order number while creating order in createOrder API)


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