import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../utils/config.js';

const loginRouter = express.Router();

loginRouter.post("/", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            res.status(400).json({error: "missing username or password"});
        }
        const user = await User.findOne({username}); // Check user exist in db
        const passwordHash = user !== null ? await bcrypt.compare(password, user.passwordHash) : false;

        if(!(user || passwordHash)) {
            return res.status(401).json({error: "user or password invalid"})
        }

        const userForToken = {
            username: user.username,
            id: user._id 
        }
        const token = jwt.sign(userForToken, config.SECRET_KEY);
        res.status(200).json({token, username: user.username})
    } catch (error) {
        next(error);
    }
})


export default loginRouter;