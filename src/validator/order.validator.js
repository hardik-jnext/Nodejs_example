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
module.exports = {ordervalid,createOrdervalid,updateordervalid}


