/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import type { PageDto } from '../../common/dto/page.dto';
import { AuthorEntity } from './author.entity';
import type { AuthorDto } from './dto/author.dto';
import type { AuthorPageOptionsDto } from './dto/author-page-options.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorEntity)
    private authorRepository: Repository<AuthorEntity>,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Find single
   */
  findOne(
    findData: FindOptionsWhere<AuthorEntity>,
  ): Promise<AuthorEntity | null> {
    return this.authorRepository.findOneBy(findData);
  }

  /**
   * Find list
   */
  findBy(
    findData: FindOptionsWhere<AuthorEntity>,
  ): Promise<AuthorEntity[] | null> {
    return this.authorRepository.findBy(findData);
  }

  async getAuthors(
    pageOptionsDto: AuthorPageOptionsDto,
  ): Promise<PageDto<AuthorDto>> {
    const queryBuilder = this.authorRepository.createQueryBuilder('author');

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getAuthor(authorId: number): Promise<AuthorDto> {
    const queryBuilder = this.authorRepository.createQueryBuilder('author');

    queryBuilder.where('author.id = :authorId', { authorId });

    const authorEntity = await queryBuilder.getOne();

    if (!authorEntity) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: this.i18n.t('author.errors.notFound'),
          error: this.i18n.t('author.errors.notFound'),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return authorEntity.toDto();
  }

  async getAllAuthor(): Promise<AuthorDto[]> {
    const queryBuilder = this.authorRepository.createQueryBuilder('author');

    const authorEntity = await queryBuilder.getMany();

    return authorEntity.toDtos();
  }

  async insert(authors) {
    await this.authorRepository.clear();

    const authorEntities = this.authorRepository.create(authors);

    await this.authorRepository.insert(authorEntities);

    return authorEntities;
  }
}
