import express from 'express';
import User from '../models/User.js';

const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json(users); 
    } catch(error) {
        
    }

})

export default userRouter;