import { Column, Entity } from 'typeorm';

import type { IAbstractEntity } from '../../common/abstract.entity';
import { AbstractEntity } from '../../common/abstract.entity';
import { UseDto } from '../../decorators';
import { AuthorDto } from './dto/author.dto';

export interface IAuthorEntity extends IAbstractEntity<AuthorDto> {
  author_name: string;
}

@Entity({ name: 'authors' })
@UseDto(AuthorDto)
export class AuthorEntity
  extends AbstractEntity<AuthorDto>
  implements IAuthorEntity
{
  @Column({ type: 'varchar', unique: false, nullable: true })
  author_name: string;
}
