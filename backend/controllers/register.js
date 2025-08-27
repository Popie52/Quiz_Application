import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../utils/config.js';

const registerRouter = express.Router();

registerRouter.post("/", async(req, res, next) => {
    const saltRounds = 10;
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            return res.status(400).json({error: "Missing username or password"});
        }
        const existingUser = await User.findOne({username});
        if(existingUser) {
            return res.status(409).json({error: "username already exists"});
        }

        const passwordHash = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            username,
            passwordHash 
        });
        const savedUser = await newUser.save();
        const userForToken = {
            username: savedUser.username,
            id: savedUser.id 
        }
        const token = jwt.sign(userForToken, config.SECRET_KEY);
        const newToken = {token, username};
        res.status(200).json(newToken);
    } catch (error) {
        next(error);
    }
})


export default registerRouter;