import { AuthModule } from "./../auth/auth.module";
import { Module } from "@nestjs/common";
import { TextblocksController } from "./textblocks.controller";
import { TextblocksService } from "./textblocks.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Textblock } from "./textblocks.model";
import { FilesModule } from "src/files/files.module";

@Module({
  controllers: [TextblocksController],
  providers: [TextblocksService],
  imports: [SequelizeModule.forFeature([Textblock]), AuthModule, FilesModule],
  exports: [TextblocksService],
})
export class TextblocksModule {}
