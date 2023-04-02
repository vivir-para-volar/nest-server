import { User } from "../users/users.model";
import { Module } from "@nestjs/common";
import { ProfilesController } from "./profiles.controller";
import { ProfilesService } from "./profiles.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "src/auth/auth.module";
import { Profile } from "./profiles.model";
import { UsersModule } from "src/users/users.module";

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [
    SequelizeModule.forFeature([Profile, User]),
    AuthModule,
    UsersModule,
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}
