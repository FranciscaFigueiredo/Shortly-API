import joi from 'joi';

const urlSchema = joi.object({
    url: joi.string().uri().required(),
})

export {
    urlSchema,
};
