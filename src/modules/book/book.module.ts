import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookController } from './book.controller';
import { BookEntity } from './book.entity';
import { BookService } from './book.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity])],
  controllers: [BookController],
  exports: [BookService],
  providers: [BookService],
})
export class BookModule {}
