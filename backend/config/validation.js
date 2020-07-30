//validation
const Joi= require('@hapi/joi');

//register validation
const registerValidation = (data) => {
    const schema=Joi.object({
        first_name: Joi.string().min(3).required(),
        last_name: Joi.string().min(3).required(),
        email:Joi.string().required().email(),
        password:Joi.string().required()
    })

   return schema.validate(data);
}


const loginValidation = (data) => {
    const schema=Joi.object({
        email:Joi.string().min(6).required().email(),
        password:Joi.string().min(6).required()
    })

   return schema.validate(data);
}




module.exports.loginValidation=loginValidation;
module.exports.registerValidation=registerValidation;