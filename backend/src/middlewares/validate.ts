import type { RequestHandler } from "express";
import { type AnySchema, ValidationError } from "yup";

const validate = (schema: AnySchema): RequestHandler => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message });
    } else {
      next(err);
    }
  }
};

export default validate;
