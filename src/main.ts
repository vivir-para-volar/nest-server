import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";

async function start() {
  const PORT = process.env.PORT || 8080;
  const app = await NestFactory.create(AppModule);

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
