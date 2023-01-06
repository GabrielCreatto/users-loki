import { init_routers } from './routers/router';
import dotenv from 'dotenv';

const start = async () => {
    dotenv.config();

    const app = await init_routers();
    const port = process.env.PORT;

    app.listen(port);

    console.log(`Application startes at port ${port}`);
};

start();