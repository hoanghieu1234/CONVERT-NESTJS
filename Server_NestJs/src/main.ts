import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

require("dotenv").config();

const PORT = process.env.APP_PORT || 8000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigin = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:3001'
  ];

  //middleware
  const corsOptions = {
    origin: corsOrigin,
    credentials: true, // access-control-allow-credentials: true
    optionsSuccessStatus: 200, // Sửa tên thuộc tính thành optionsSuccessStatus
  };

  app.enableCors(corsOptions);
  //middleware
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
}
bootstrap();
