import joi from "joi";

export const addpost = {
  body: joi
    .object()
    .required()
    .keys({
      body: joi.string().required(),
    }),
};
export const updatepost = {
  body: joi
    .object()
    .required()
    .keys({
      body: joi.string().required(),
    }),
    params:joi.object().required().keys({
      id:joi.string().required().min(24).max(24)
    })
};
export const postID = {
    params:joi.object().required().keys({
      id:joi.string().required().min(24).max(24)
    })
};
export const replay = {
  params:joi.object().required().keys({
    id:joi.string().required().min(24).max(24),
    replayid:joi.string().required().min(24).max(24)
  })
};