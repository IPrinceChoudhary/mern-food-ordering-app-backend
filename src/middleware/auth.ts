import { auth } from "express-oauth2-jwt-bearer";
import {Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import User from "../models/user";

// custom properties in TS // extending the type so that we can add our own properties
declare global{
  namespace Express{
    interface Request{
      userId: string;
      auth0Id: string
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {authorization} = req.headers;

  if(!authorization || !authorization.startsWith("Bearer ")){
    return res.sendStatus(401)
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    console.log(decoded)
    const auth0Id = decoded.sub // auth0 id of the user 

    const user = await User.findOne({auth0Id})

    if(!user){
      return res.sendStatus(401);
    }

    // appending some info about the user who's trying to make request to the actual request object itself which is update current user controller // these are the custom properties to the request the typescript doesn't understand
    req.auth0Id = auth0Id as string // it tells typescript that we are sure that this object or this variable is going to be a string
    req.userId = user._id.toString() // mongodb id
    next() // telling express we're finished of the middleware and to carry on do what you were going to do next

  } catch (error) {
    return res.sendStatus(401)
  }
}