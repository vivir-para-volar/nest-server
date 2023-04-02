import { Module } from '@nestjs/common';
import { TextblocksController } from './textblocks.controller';
import { TextblocksService } from './textblocks.service';

@Module({
  controllers: [TextblocksController],
  providers: [TextblocksService]
})
export class TextblocksModule {}
