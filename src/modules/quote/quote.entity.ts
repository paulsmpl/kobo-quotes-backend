import { Column, Entity, ManyToOne } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import type { IAuthorEntity } from '../author/author.entity';
import { AuthorEntity } from '../author/author.entity';
import type { IBookEntity } from '../book/book.entity';
import { BookEntity } from '../book/book.entity';
import { QuoteDto } from './dto/quote.dto';

export interface IQuoteEntity extends IAbstractEntity<QuoteDto> {
  authorId: number;
  bookId: number;
  quote: string;
  position: number;
  enabled: boolean;
  author?: IAuthorEntity;
  book?: IBookEntity;
}

@Entity({ name: 'quotes' })
@UseDto(QuoteDto)
export class QuoteEntity
  extends AbstractEntity<QuoteDto>
  implements IQuoteEntity
{
  @Column({ type: 'int', unique: false, nullable: true })
  authorId: number;

  @Column({ type: 'int', unique: false, nullable: true })
  bookId: number;

  @Column({ type: 'text', unique: false, nullable: true })
  quote: string;

  @Column({ type: 'int', unique: false, nullable: true })
  position: number;

  @Column({ type: 'boolean', unique: false, nullable: true })
  enabled: boolean;

  @Column({ type: 'text', unique: false, nullable: true })
  startContainerPath: string;

  @Column({ type: 'text', unique: false, nullable: true })
  endContainerPath: string;

  @ManyToOne(() => AuthorEntity, (author) => author.quotes)
  author?: AuthorEntity;

  @ManyToOne(() => BookEntity, (book) => book.quotes)
  book?: BookEntity;
}
