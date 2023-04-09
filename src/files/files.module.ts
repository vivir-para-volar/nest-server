import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "./../auth/auth.module";
import { FileInfo } from "./files.model";
import { FilesController } from "./files.controller";

@Module({
  providers: [FilesService],
  imports: [SequelizeModule.forFeature([FileInfo]), AuthModule],
  exports: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
