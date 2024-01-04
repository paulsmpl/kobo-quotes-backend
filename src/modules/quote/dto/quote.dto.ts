/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { AuthorEntity } from '../../author/author.entity';
import type { BookEntity } from '../../book/book.entity';
import type { QuoteEntity } from '../quote.entity';

export class QuoteDto extends AbstractDto {
  @ApiProperty()
  authorId: number;

  @ApiProperty()
  bookId: number;

  @ApiProperty()
  quote: string;

  @ApiProperty()
  position: number;

  @ApiProperty()
  enabled: boolean;

  @ApiPropertyOptional()
  author?: AuthorEntity;

  @ApiPropertyOptional()
  book?: BookEntity;

  constructor(quote: QuoteEntity) {
    super(quote);
    this.authorId = quote.author_id;
    this.bookId = quote.book_id;
    this.quote = quote.quote;
    this.position = quote.position;
    this.enabled = quote.enabled;
    this.author = quote.author;
    this.book = quote.book;
  }
}
