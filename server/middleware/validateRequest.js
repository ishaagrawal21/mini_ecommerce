const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  description: Joi.string().min(1).required(),
  price: Joi.number().min(0).required(),

  // Category MUST be ObjectId string
  category: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid category ObjectId",
    }),

  imageURL: Joi.string().uri().allow("", null).optional(),
});

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((d) => d.message),
    });
  }

  next();
};

module.exports = { validateProduct };
