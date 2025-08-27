import express from 'express';
import cors from 'cors';
import userRouter from './controllers/users.js';
import loginRouter from './controllers/login.js';
import registerRouter from './controllers/register.js'; 
import config from './utils/config.js';
import middleware from './utils/middleware.js';
import mongoose from 'mongoose';


(async () => {
    try {
        await mongoose.connect(config.MONGODB_URL);
        console.log(`Connected to MongoDB!`)
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
})();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use(middleware.tokenExtractor);
app.use("/api/users", userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;