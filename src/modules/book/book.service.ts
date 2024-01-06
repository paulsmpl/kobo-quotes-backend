/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import type { PageDto } from '../../common/dto/page.dto';
import { BookEntity } from './book.entity';
import type { BookDto } from './dto/book.dto';
import type { BookPageOptionsDto } from './dto/book-page-options.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private bookRepository: Repository<BookEntity>,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Find one
   */
  findOne(findData: FindOptionsWhere<BookEntity>): Promise<BookEntity | null> {
    return this.bookRepository.findOneBy(findData);
  }

  /**
   * Find all
   */
  findBy(findData: FindOptionsWhere<BookEntity>): Promise<BookEntity[] | null> {
    return this.bookRepository.findBy(findData);
  }

  async getBooks(
    pageOptionsDto: BookPageOptionsDto,
  ): Promise<PageDto<BookDto>> {
    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    queryBuilder.andWhere('book.enabled = :enabled', { enabled: true });

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getBook(bookId: number): Promise<BookDto> {
    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    queryBuilder.andWhere('book.id = :bookId', { bookId });

    queryBuilder.andWhere('book.enabled = :enabled', { enabled: true });

    const bookEntity = await queryBuilder.getOne();

    if (!bookEntity) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: this.i18n.t('book.errors.notFound'),
          error: this.i18n.t('book.errors.notFound'),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return bookEntity.toDto();
  }

  async getAllBook(): Promise<BookDto[]> {
    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    queryBuilder.andWhere('book.enabled = :enabled', { enabled: true });

    const bookEntity = await queryBuilder.getMany();

    return bookEntity.toDtos();
  }

  async insert(books) {
    await this.bookRepository.clear();

    const bookEntities = this.bookRepository.create(books);

    await this.bookRepository.insert(bookEntities);

    return bookEntities;
  }
}
