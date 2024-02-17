/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { AuthorEntity } from '../../author/author.entity';
import type { BookEntity } from '../book.entity';

export class BookDto extends AbstractDto {
  @ApiProperty()
  bookName: string;

  @ApiProperty()
  enabled: boolean;

  @ApiPropertyOptional()
  author?: AuthorEntity;

  constructor(book: BookEntity) {
    super(book);
    this.bookName = book.bookName;
    this.enabled = book.enabled;
    this.author = book.author;
  }
}
