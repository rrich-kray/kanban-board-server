const Joi = require("joi");

const UserSchema = Joi.object({
  first_name: Joi.string().trim(true),
  last_name: Joi.string().trim(true),
  email: Joi.string().email(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_-!@#%^*]{5,40}$")),
});

const TaskSchema = Joi.object({
  task_name: Joi.string().trim(true),
});
