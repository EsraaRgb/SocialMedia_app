const methods = ["headers", "params", "query", "body"];

export const validate = (Schema) => {
  return (req, res, next) => {
    const validationErrors = [];
    methods.forEach(method => {
      if (Schema[method]) {
        const result = Schema[method].validate(req[method], {aportEarly: false});
        if (result.error) {
          validationErrors.push(result.error.details);
        }
      }
    });
    if (validationErrors.length) {
      res.status(403).json({ message: "Validation error", validationErrors });
    } else {
      next();
    }
  };
};
