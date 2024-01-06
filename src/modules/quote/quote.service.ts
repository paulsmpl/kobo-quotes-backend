/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import type { PageDto } from '../../common/dto/page.dto';
import type { ParamRandomQuoteDto } from './dto/params-random-quote.dto';
import type { QuoteDto } from './dto/quote.dto';
import type { QuotePageOptionsDto } from './dto/quote-page-options.dto';
import { QuoteEntity } from './quote.entity';

@Injectable()
export class QuoteService {
  constructor(
    @InjectRepository(QuoteEntity)
    private quoteRepository: Repository<QuoteEntity>,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Find single
   */
  findOne(
    findData: FindOptionsWhere<QuoteEntity>,
  ): Promise<QuoteEntity | null> {
    return this.quoteRepository.findOneBy(findData);
  }

  /**
   * Find list
   */
  findBy(
    findData: FindOptionsWhere<QuoteEntity>,
  ): Promise<QuoteEntity[] | null> {
    return this.quoteRepository.findBy(findData);
  }

  async getQuotes(
    pageOptionsDto: QuotePageOptionsDto,
  ): Promise<PageDto<QuoteDto>> {
    const queryBuilder = this.quoteRepository.createQueryBuilder('quote');

    queryBuilder.andWhere('quote.enabled = :enabled', { enabled: true });

    queryBuilder.leftJoinAndSelect('quote.author', 'author');

    queryBuilder.leftJoinAndSelect('quote.book', 'book');

    queryBuilder.andWhere('book.enabled = :enabled', { enabled: true });

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getQuote(quoteId: number): Promise<QuoteDto> {
    const queryBuilder = this.quoteRepository.createQueryBuilder('quote');

    queryBuilder.andWhere('quote.enabled = :enabled', { enabled: true });

    queryBuilder.andWhere('quote.id = :quoteId', { quoteId });

    queryBuilder.leftJoinAndSelect('quote.author', 'author');

    queryBuilder.leftJoinAndSelect('quote.book', 'book');

    queryBuilder.andWhere('book.enabled = :enabled', { enabled: true });

    const quoteEntity = await queryBuilder.getOne();

    if (!quoteEntity) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: this.i18n.t('quote.errors.notFound'),
          error: this.i18n.t('quote.errors.notFound'),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return quoteEntity.toDto();
  }

  async getAllQuote(): Promise<QuoteDto[]> {
    const queryBuilder = this.quoteRepository.createQueryBuilder('quote');

    queryBuilder.andWhere('quote.enabled = :enabled', { enabled: true });

    queryBuilder.leftJoinAndSelect('quote.author', 'author');

    queryBuilder.leftJoinAndSelect('quote.book', 'book');

    queryBuilder.andWhere('book.enabled = :enabled', { enabled: true });

    const quoteEntity = await queryBuilder.getMany();

    return quoteEntity.toDtos();
  }

  async getRandomQuote(
    paramRandomQuoteDto?: ParamRandomQuoteDto,
  ): Promise<QuoteDto> {
    const queryBuilder = this.quoteRepository.createQueryBuilder('quote');

    queryBuilder.andWhere('quote.enabled = :enabled', { enabled: true });

    queryBuilder.leftJoinAndSelect('quote.author', 'author');

    queryBuilder.leftJoinAndSelect('quote.book', 'book');

    queryBuilder.andWhere('book.enabled = :enabled', { enabled: true });

    // first time
    if (
      !paramRandomQuoteDto?.newBookId &&
      !paramRandomQuoteDto?.currerntQuoteId
    ) {
      queryBuilder.orderBy('RAND()');
    }

    let currerntQuote: QuoteDto;

    // same book, based on ascending position
    if (paramRandomQuoteDto?.currerntQuoteId) {
      currerntQuote = await this.getQuote(paramRandomQuoteDto.currerntQuoteId);

      queryBuilder.andWhere('book.id = :currerntBookId', {
        currerntBookId: currerntQuote.bookId,
      });

      queryBuilder.andWhere('quote.position > :currerntQuotePosition', {
        currerntQuotePosition: currerntQuote.position,
      });

      queryBuilder.andWhere('quote.id != :currerntQuoteId', {
        currerntQuoteId: currerntQuote.id,
      });

      queryBuilder.orderBy('quote.position', 'ASC');
    }

    // change book
    if (paramRandomQuoteDto?.newBookId) {
      queryBuilder.andWhere('book.id = :bookId', {
        bookId: paramRandomQuoteDto.newBookId,
      });

      queryBuilder.orderBy('quote.position', 'ASC');
    }

    const quoteEntity = await queryBuilder.getOne();

    if (!quoteEntity) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: this.i18n.t('quote.errors.notFound'),
          error: this.i18n.t('quote.errors.notFound'),
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return quoteEntity.toDto();
  }

  async insert(quotes) {
    await this.quoteRepository.clear();

    const quoteEntities = this.quoteRepository.create(quotes);

    await this.quoteRepository.insert(quoteEntities);

    return quoteEntities;
  }
}
