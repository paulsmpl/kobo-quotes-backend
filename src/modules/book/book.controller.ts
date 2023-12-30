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
import { BookService } from './book.service';
import { BookDto } from './dto/book.dto';
import { BookPageOptionsDto } from './dto/book-page-options.dto';

@Controller('book')
@ApiTags('Book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get book list',
    type: PageDto,
  })
  getBooks(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: BookPageOptionsDto,
  ): Promise<PageDto<BookDto>> {
    return this.bookService.getBooks(pageOptionsDto);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get all book',
    type: BookDto,
  })
  getAllBook(): Promise<BookDto[]> {
    return this.bookService.getAllBook();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get book detail',
    type: BookDto,
  })
  getBook(@Param('id') bookId: number): Promise<BookDto> {
    return this.bookService.getBook(bookId);
  }
}
