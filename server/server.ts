import express, { Request, Response } from 'express';
import 'dotenv/config'

import cors from 'cors'
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import userRouter from './routes/userRoutes.js';
import Projectrouter from './routes/projectRoutes.js';
import { stripeWebhook } from './controllers/stripeWebhooks.js';
const app = express();

const port = process.env.PORT || 3000;


const corsOPtions={
    origin:process.env.TRUSTED_ORIGINS?.split(',')|| [],
    credentials:true
} 
app.set("trust proxy", 1);
app.use(cors(corsOPtions))

app.post('/api/stripe',express.raw({type:'application/json'}),stripeWebhook)
app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json({limit:'50mb'} ))

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use('/api/user',userRouter)
app.use('/api/project',Projectrouter)
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});