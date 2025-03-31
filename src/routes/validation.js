const Joi = require('joi');

// Define the schema for project validation
const projectSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    status: Joi.string().valid('In Progress', 'Not Started', 'Completed').required(),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().greater(Joi.ref('start_date')).required(),
    team_members: Joi.alternatives().try(
        Joi.array().items(Joi.string().min(1)),
        Joi.string()
    ).required(),
    image_url: Joi.string().uri().required()
});

// Middleware to validate the request body
const validateProject = (req, res, next) => {
    const { error } = projectSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ errors: errorMessages });
    }

    next();
};

module.exports = { validateProject };