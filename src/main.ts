import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "./pipes/validation.pipe";

async function start() {
  const PORT = process.env.PORT || 8080;
  const app = await NestFactory.create(AppModule);

  // Создание и настройка документации
  const config = new DocumentBuilder()
    .setTitle("Серверное приложение на Nest")
    .setDescription("Документация REST API")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);

  app.useGlobalPipes(new ValidationPipe())
  
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
