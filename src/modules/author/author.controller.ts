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
import { AuthorService } from './author.service';
import { AuthorDto } from './dto/author.dto';
import { AuthorPageOptionsDto } from './dto/author-page-options.dto';

@Controller('author')
@ApiTags('Author')
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get author list',
    type: PageDto,
  })
  getAuthors(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: AuthorPageOptionsDto,
  ): Promise<PageDto<AuthorDto>> {
    return this.authorService.getAuthors(pageOptionsDto);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse({
    description: 'Get all author',
    type: AuthorDto,
  })
  getAllAuthor(): Promise<AuthorDto[]> {
    return this.authorService.getAllAuthor();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get author detail',
    type: AuthorDto,
  })
  getAuthor(@Param('id') authorId: number): Promise<AuthorDto> {
    return this.authorService.getAuthor(authorId);
  }
}
