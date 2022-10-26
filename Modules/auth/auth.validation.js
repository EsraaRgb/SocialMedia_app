import joi from "joi";

export const signUp = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "edu", "net", "org"] } })
        .required(),
      password: joi
        .string()
        .required()
        .pattern(new RegExp(/^(?=.*\d)(?=.*[A-Z])(.{6,50})$/)), // one digit, Capital letter at least and length from  6 to 50
      cpassword: joi.string().valid(joi.ref("password")).required(),
      userName: joi.string().required().min(3).max(25),
      gender: joi.string().valid("male", "female"),
    })
    .options({ allowUnknown: true }),
};

export const tokenValidation = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};
export const signIn = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "edu", "net", "org"] } })
        .required(),
      password: joi
        .string()
        .required()
        .pattern(new RegExp(/^(?=.*\d)(?=.*[A-Z])(.{6,50})$/)),
    }),
};
export const tokenAuth = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .unknown(true),
};
