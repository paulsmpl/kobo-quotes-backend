import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { AuthorEntity } from '../../author/author.entity';
import type { QuoteEntity } from '../quote.entity';

export class QuoteDto extends AbstractDto {
  @ApiProperty()
  authorId: number;

  bookId: number;

  quote: string;

  position: number;

  enabled: boolean;

  author?: AuthorEntity;

  constructor(quote: QuoteEntity) {
    super(quote);
    this.authorId = quote.author_id;
    this.bookId = quote.book_id;
    this.quote = quote.quote;
    this.position = quote.position;
    this.enabled = quote.enabled;
    this.author = quote.author;
  }
}
