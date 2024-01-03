import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { ApiPageOkResponse } from '../../decorators';
import { QuoteDto } from './dto/quote.dto';
import { QuotePageOptionsDto } from './dto/quote-page-options.dto';
import { QuoteService } from './quote.service';

@Controller('quote')
@ApiTags('Quote')
export class QuoteController {
  constructor(private quoteService: QuoteService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get quote list',
    type: PageDto,
  })
  getQuotes(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: QuotePageOptionsDto,
  ): Promise<PageDto<QuoteDto>> {
    return this.quoteService.getQuotes(pageOptionsDto);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get all quote',
    type: QuoteDto,
  })
  getAllQuote(): Promise<QuoteDto[]> {
    return this.quoteService.getAllQuote();
  }

  @Get('random')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get random quote',
    type: QuoteDto,
  })
  getRandomQuote(): Promise<QuoteDto> {
    return this.quoteService.getRandomQuote();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get quote detail',
    type: QuoteDto,
  })
  getQuote(@Param('id') quoteId: number): Promise<QuoteDto> {
    return this.quoteService.getQuote(quoteId);
  }
}
