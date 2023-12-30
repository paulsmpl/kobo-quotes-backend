import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import type { PageDto } from '../../common/dto/page.dto';
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

    const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

    return items.toPageDto(pageMetaDto);
  }

  async getQuote(quoteId: number): Promise<QuoteDto> {
    const queryBuilder = this.quoteRepository.createQueryBuilder('quote');

    queryBuilder.where('quote.id = :quoteId', { quoteId });

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

    const quoteEntity = await queryBuilder.getMany();

    return quoteEntity.toDtos();
  }
}
