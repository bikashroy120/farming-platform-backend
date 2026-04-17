import express, { Application, NextFunction, Response, Request } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import quicker from './shared/quicker';
import { sendResponse } from './shared/customResponse';
import routes from './app/routes/index';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

app.use('/api', limiter);

app.get('/', (req, res) => {
  res.send('Your server is production ready!');
});

app.use('/api/v1', routes);

app.get('/health', async (req, res) => {
  const healthData = {
    application: quicker.getApplicationHealth(),
    system: quicker.getSystemHealth(),
    timeStamp: Date.now(),
  };

  const responseData = {
    message: ' Welcome to the farming platform API',
    statusCode: 200,
    success: true,
    data: healthData,
  };

  sendResponse(res, responseData);
});

app.use(globalErrorHandler);

app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'API route not found!',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'This URL does not exist. Please check the URL and try again.',
      },
    ],
  });
});

export default app;
