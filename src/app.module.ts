import { UserRoles } from "./roles/user-roles.model";
import { Role } from "./roles/roles.models";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { RolesModule } from "./roles/roles.module";
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/users.models";
import { AuthModule } from "./auth/auth.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ProfilesModule } from './profiles/profiles.module';
import { Profile } from "./profiles/profiles.model";
import * as path from 'path';

@Module({
  controllers: [],
  providers: [],

  imports: [
    // Получаем путь до файла .env, тк он разный на этапе разработки и в продакшн
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),

    // Чтобы сервер мог раздовать статику
    ServeStaticModule.forRoot({
      rootPath: path.resolve( __dirname, 'static'),
    }),

    // Настройка параметров конфигурации БД
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, Profile],
      autoLoadModels: true,
    }),

    UsersModule,
    RolesModule,
    AuthModule,
    ProfilesModule,
  ],
})
export class AppModule {}
