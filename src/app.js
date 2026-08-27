import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.route.js';
import userRoute from './routes/user.routes.js'
import { ApiResponse } from './utils/ApiResponse.js';
import { errorHandler } from './middleware/error.middleware.js';


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(morgan('dev'));

app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoute);


app.use((req, res) =>{
    return ApiResponse.error(res, 'Route Not Found', [], 404)
});

app.use(errorHandler);

export default app;
