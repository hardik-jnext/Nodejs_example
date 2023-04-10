//Task no. 35  (Check how to create otp using function, do define common function in helper folder)

const otpGenrator = (number = 4)=>{
    const totalValue = Math.floor(Math.random() * (9 * Math.pow(10, number - 1)))
     const lowestvalue = totalValue + Math.pow(10, number - 1)
 return lowestvalue
}

module.exports = otpGenrator()