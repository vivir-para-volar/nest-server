import { UserRoles } from "./user-roles.model";
import { User } from "../users/users.models";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { RolesController } from "./roles.controller";
import { Role } from "./roles.models";
import { RolesService } from "./roles.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [RolesController],
  providers: [RolesService],

  imports: [SequelizeModule.forFeature([Role, User, UserRoles]), AuthModule],

  // Для того, чтобы сервис экспортировался вместе со всем модулем
  exports: [RolesService],
})
export class RolesModule {}