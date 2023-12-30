import { Column, Entity } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { QuoteDto } from './dto/quote.dto';

export interface IQuoteEntity extends IAbstractEntity<QuoteDto> {
  author_id: number;
  book_id: number;
  quote: string;
  position: number;
  enabled: boolean;
}

@Entity({ name: 'quotes' })
@UseDto(QuoteDto)
export class QuoteEntity
  extends AbstractEntity<QuoteDto>
  implements IQuoteEntity
{
  @Column({ type: 'int', unique: false, nullable: true })
  author_id: number;

  @Column({ type: 'int', unique: false, nullable: true })
  book_id: number;

  @Column({ type: 'text', unique: false, nullable: true })
  quote: string;

  @Column({ type: 'int', unique: false, nullable: true })
  position: number;

  @Column({ type: 'bool', unique: false, nullable: true })
  enabled: boolean;
}
