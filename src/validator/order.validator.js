const {celebrate,Joi,errors,Segments} = require('celebrate')


const ordervalid = {
    [Segments.QUERY]:{
        status : Joi.string()
    }  
}

const createOrdervalid = {
    [Segments.BODY]:Joi.object().keys({
        item_id : Joi.number().integer().required(),
        status : Joi.string().required()
    })
}


const updateordervalid = {
    [Segments.BODY]: Joi.object().keys({
        status : Joi.string().required()
    })
}
const validpayment ={
    [Segments.BODY]:Joi.object().keys({
        cardnumber : Joi.number().integer().required,
        exp_month : Joi.number().integer().required,
        exp_year : Joi.number().integer().required,
        cvv : Joi.number().integer().required
    })
}
module.exports = {ordervalid,createOrdervalid,updateordervalid,validpayment}
