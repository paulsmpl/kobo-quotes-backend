import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuoteController } from './quote.controller';
import { QuoteEntity } from './quote.entity';
import { QuoteService } from './quote.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuoteEntity])],
  controllers: [QuoteController],
  exports: [QuoteService],
  providers: [QuoteService],
})
export class QuoteModule {}
