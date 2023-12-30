import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { AuthorEntity } from '../author.entity';

export class AuthorDto extends AbstractDto {
  @ApiProperty()
  authorName: string;

  constructor(author: AuthorEntity) {
    super(author);
    this.authorName = author.author_name;
  }
}
