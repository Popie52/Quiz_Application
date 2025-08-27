import app from "./app.js";
import config from "./utils/config.js";
import logger from "./utils/logger.js";

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server started at Port ${PORT}`)
})