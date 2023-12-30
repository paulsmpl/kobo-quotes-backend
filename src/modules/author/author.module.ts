import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorController } from './author.controller';
import { AuthorEntity } from './author.entity';
import { AuthorService } from './author.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorEntity])],
  controllers: [AuthorController],
  exports: [AuthorService],
  providers: [AuthorService],
})
export class AuthorModule {}
