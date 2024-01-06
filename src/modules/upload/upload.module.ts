import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorModule } from '../author/author.module';
import { BookModule } from '../book/book.module';
import { QuoteModule } from '../quote/quote.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    AuthorModule,
    BookModule,
    QuoteModule,
  ],
  controllers: [UploadController],
  exports: [UploadService],
  providers: [UploadService],
})
export class UploadModule {}
