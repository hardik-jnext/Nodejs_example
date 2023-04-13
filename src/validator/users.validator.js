const {celebrate,Joi,errors,Segments} = require('celebrate')


const usercreatevalid = {
    [Segments.BODY]:Joi.object().keys({
        userName : Joi.string().required(),
        email :Joi.string().required(),
        age : Joi.number().integer().required(),
        address :Joi.string().required(),
        role : Joi.string().required(),
        password : Joi.string().required()      
        })
}

const loginvalid ={
    [Segments.BODY]: Joi.object().keys({
        email : Joi.string().required(),
        password : Joi.string().required()
    })
}

const findUser ={
    [Segments.PARAMS]:Joi.object().keys({
       id:Joi.number().integer() 
    })
}

const updateUservalidation = {
    [Segments.BODY]:Joi.object().keys({
        userName: Joi.string(),
        email: Joi.string(),
        age:Joi.number().integer(), 
        address: Joi.string()
    })
}


const onlyadminValidation ={
    [Segments.QUERY]:{
        start : Joi.date(),
        end : Joi.date()
    }
}

const changepasswordvalid = {
    [Segments.BODY]:Joi.object().keys({
        newpassword :Joi.string().required(),
        confirmpassword : Joi.string().required(),
        oldpassword : Joi.string().required()
    })
}

const forgetPasswordvalid = {
    [Segments.BODY]:Joi.object().keys({
        email : Joi.string().required(),
        newpassword : Joi.string().required(),
        confimpassword : Joi.string().required()
    }),
    [Segments.PARAMS]: {
        otp : Joi.number().integer()
    }
}

module.exports = {usercreatevalid,findUser,updateUservalidation,onlyadminValidation,changepasswordvalid,forgetPasswordvalid,loginvalid}
