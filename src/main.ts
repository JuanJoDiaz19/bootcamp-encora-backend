import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONT_URL || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });
  

  const options = new DocumentBuilder()
    .setTitle('FitNest')
    .setVersion('1.0')
    .addTag('fitnest products')
    .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api/docs', app, document);


  await app.listen(3000);
}
bootstrap();
