import type { RequestHandler } from "express";
import { type AnySchema, ValidationError } from "yup";

const validate = (schema: AnySchema): RequestHandler => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    if (err instanceof ValidationError) {
      const errorMessages = err.inner.reduce((errors, inner) => {
        if (inner.path) {
          return { ...errors, [inner.path]: inner.errors.join()};
        } else {
          return errors;
        }
      }, {error: err.message});
      return res.status(400).json(errorMessages);
    } else {
      next(err);
    }
  }
};

export default validate;
