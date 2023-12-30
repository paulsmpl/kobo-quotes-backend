import { Column, Entity, OneToMany } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import type { IQuoteEntity } from '../quote/quote.entity';
import { QuoteEntity } from '../quote/quote.entity';
import { AuthorDto } from './dto/author.dto';

export interface IAuthorEntity extends IAbstractEntity<AuthorDto> {
  author_name: string;
  quotes?: IQuoteEntity[];
}

@Entity({ name: 'authors' })
@UseDto(AuthorDto)
export class AuthorEntity
  extends AbstractEntity<AuthorDto>
  implements IAuthorEntity
{
  @Column({ type: 'varchar', unique: false, nullable: true })
  author_name: string;

  @OneToMany(() => QuoteEntity, (quote) => quote.author)
  quotes?: QuoteEntity[];
}
