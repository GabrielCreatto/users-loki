import dotenv from 'dotenv';
dotenv.config();
import { init_routers } from './routers/users.router';
import logger from './utils/users.logger';

const start = async () => {

    const app = await init_routers();
    const port = process.env.PORT || 3001;

    app.listen(port);

    logger.info({message: `Application startes at port ${port}`, labels: {'porta':3000, 'applciationName': 'users-loki'}});
    console.log(`Application startes at port ${port}`);
};

start();