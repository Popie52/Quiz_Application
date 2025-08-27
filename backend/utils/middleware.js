import logger from "./logger.js";
import User from "../models/User.js";
import jwt from 'jsonwebtoken';
import config from "./config.js";

const errorHandler = (error, req, res, next) => {
  logger.error(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return res
      .status(400)
      .json({ error: "expected `username` to be unique" });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization');
    if(authorization && authorization.startsWith('Bearer')) {
        req.token = authorization.replace('Bearer ', '');
    } else {
        req.token = null;
    }
    next();
}

const userExtractor = async (req, res, next) => {
    const token = req.token;
    try {
        if(!token) {
            return res.status(401).json({error: "token missing"});
        }
        // token verification
        const decodedToken = jwt.verify(token, config.SECRET_KEY);
        if(!decodedToken.id) {
            return res.status(401).json({error: "token invalid"});
        }

        const user = await User.findById(decodedToken.id);
        if(!user) {
            return res.status(404).json({error: "user not found"});
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}


const unknownEndpoint = (req, res) => {
    res.status(404).send({error: "unknown endpoint"});
}

export default {
  errorHandler,
  tokenExtractor,
  unknownEndpoint,
  userExtractor,
};
