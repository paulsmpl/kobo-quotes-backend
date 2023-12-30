import { Column, Entity } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { BookDto } from './dto/book.dto';

export interface IBookEntity extends IAbstractEntity<BookDto> {
  book_name: string;
  enabled: boolean;
}

@Entity({ name: 'books' })
@UseDto(BookDto)
export class BookEntity extends AbstractEntity<BookDto> implements IBookEntity {
  @Column({ type: 'varchar', unique: false, nullable: true })
  book_name: string;

  @Column({ type: 'bool', unique: false, nullable: true })
  enabled: boolean;
}
