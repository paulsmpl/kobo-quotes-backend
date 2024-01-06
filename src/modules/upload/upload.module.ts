import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [UploadController],
  exports: [UploadService],
  providers: [UploadService],
})
export class UploadModule {}
