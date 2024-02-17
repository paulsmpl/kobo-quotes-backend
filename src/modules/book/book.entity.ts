import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import type { IAuthorEntity } from '../author/author.entity';
import { AuthorEntity } from '../author/author.entity';
import type { IQuoteEntity } from '../quote/quote.entity';
import { QuoteEntity } from '../quote/quote.entity';
import { BookDto } from './dto/book.dto';

export interface IBookEntity extends IAbstractEntity<BookDto> {
  bookName: string;
  authorId?: number;
  enabled: boolean;
  quotes?: IQuoteEntity[];
  author?: IAuthorEntity;
}

@Entity({ name: 'books' })
@UseDto(BookDto)
export class BookEntity extends AbstractEntity<BookDto> implements IBookEntity {
  @Column({ type: 'varchar', unique: false, nullable: true })
  bookName: string;

  @Column({ type: 'int', unique: false, nullable: true })
  authorId: number;

  @Column({ type: 'boolean', unique: false, nullable: true })
  enabled: boolean;

  @OneToMany(() => QuoteEntity, (quote) => quote.author)
  quotes?: QuoteEntity[];

  @ManyToOne(() => AuthorEntity, (author) => author.books)
  author?: AuthorEntity;
}
