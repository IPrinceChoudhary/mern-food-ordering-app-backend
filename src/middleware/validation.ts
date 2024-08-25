// adding some validation to the request(put req./update current user profile) to make sure that all the necessary fills that we get in the request are there and they are the right type

import { body, validationResult } from "express-validator";
import {Request, Response, NextFunction } from "express";

const handleValidationErrors = async (req: Request, res: Response, next: NextFunction)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
  next()
} // this middleware apply the validation to the user

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name must be a string"),
  body("addressLine1").isString().notEmpty().withMessage("addressLine1 must be a string"),
  body("city").isString().notEmpty().withMessage("city must be a string"),
  body("country").isString().notEmpty().withMessage("country must be a string"),
  handleValidationErrors
] // in array because we are going to add bunch of pieces of middleware using one variable