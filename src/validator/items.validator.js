const {celebrate,Joi,errors,Segments} = require('celebrate')


const creatItemvalid = {
    [Segments.BODY]:Joi.object().keys({
        itemName : Joi.string().required(),
        price : Joi.number().integer().required(),
        manufature_id :Joi.number(),
        expiryDate : Joi.date()
    })
}


const updateItemvalid = {
    [Segments.BODY]:Joi.object().keys({
        itemName : Joi.string(),
        price : Joi.number().integer(),
        item_image : Joi.string()
    })
}

const deletevalid = {
    [Segments.PARAMS]:{
        id : Joi.number().integer()
    }
}
module.exports = {creatItemvalid,updateItemvalid,deletevalid}