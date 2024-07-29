import express from 'express';
import cors from 'cors';
import auth from './middlewares/auth/index';
import router from './routes/routes';
const corsOptions = {
    //PRODUCTION:
    origin: ['https://safyra.com.br','https://www.safya.com.br','https://*.safyra.com.br'],
    //DEVELOPMENT:
    //origin: "*",
    optionsSuccessStatus: 200
}

const app = express();

app.use(express.json())
app.use(cors())
app.use(cors(corsOptions))
app.use('/files', express.static('files'));

app.use(auth()) // all routes below have authorization validation

app.use(router)


app.listen(2211, () => console.log('Server Up on 2211 port'));