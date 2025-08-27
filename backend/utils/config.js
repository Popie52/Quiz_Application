import "dotenv/config";

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const SECRET_KEY = process.env.SECRET_KEY;

export default {
    PORT,
    MONGODB_URL,
    SECRET_KEY,
}