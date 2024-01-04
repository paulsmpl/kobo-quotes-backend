import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { BookEntity } from '../book.entity';

export class BookDto extends AbstractDto {
  @ApiProperty()
  bookName: string;

  enabled: boolean;

  constructor(book: BookEntity) {
    super(book);
    this.bookName = book.bookName;
    this.enabled = book.enabled;
  }
}
