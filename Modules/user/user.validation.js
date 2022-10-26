import joi from "joi";

  export const updateProfile = {
    body: joi
      .object()
      .required()
      .keys({
        email: joi
          .string()
          .email({ tlds: { allow: ["com", "edu", "net", "org"] } }),
        userName: joi.string().min(3).max(35),
        gender: joi.string().valid("male", "female"),
        age:joi.number().integer().max(100).min(5)
      }),
  };
