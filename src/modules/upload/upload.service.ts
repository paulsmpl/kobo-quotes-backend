/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UploadedFile } from '@nestjs/common';
import Database from 'better-sqlite3';
import * as fs from 'fs-extra';
import { isNaN } from 'lodash';

import { AuthorService } from '../author/author.service';
import { BookService } from '../book/book.service';
import { QuoteService } from '../quote/quote.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly authorService: AuthorService,
    private readonly bookService: BookService,
    private readonly quoteService: QuoteService,
  ) {}

  getPosition = (value: any) => {
    let result = 0;

    if (!value) {
      return result;
    }

    const array = value.split('/');

    if (array.length > 0) {
      let lastString = array[array.length - 1];

      if (lastString.endsWith(')')) {
        lastString = lastString.replace(')', '');
      }

      const arrayNumber: string[] = lastString.split(':');

      result = Number(arrayNumber[0]) * 10 + Number(arrayNumber[1]);
    }

    return isNaN(result) ? 0 : result;
  };

  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const db = new Database(`${file.destination}/${file.filename}`);

    const oldAuthors = await this.authorService.getAllAuthor();
    const oldBooks = await this.bookService.getAllBook();
    const oldQuotes = await this.quoteService.getAllQuote();

    const dataSqlite: any = db
      .prepare(
        `SELECT ct.Attribution AS authorName, ct.title AS bookName,
        bm.Text AS quote, bm.StartContainerPath AS startContainerPath, bm.EndContainerPath AS endContainerPath
        FROM content AS ct
        JOIN Bookmark AS bm
        ON ct.ContentId = bm.volumeId`,
      )
      .all();

    let newAuthors: any = [];
    let newBooks: any = [];
    let newQuotes: any = [];

    for (const [index, row] of dataSqlite.entries()) {
      const position = this.getPosition(row?.startContainerPath);

      let quote: any = {
        id: index + 1,
        quote: row?.quote,
        position,
        enabled: true,
        startContainerPath: row?.startContainerPath,
        endContainerPath: row?.endContainerPath,
      };
      const indexAuthor = newAuthors.findIndex(
        (element) => element?.authorName === row?.authorName,
      );
      const indexBook = newBooks.findIndex(
        (element) => element?.bookName === row?.bookName,
      );

      if (indexAuthor === -1) {
        newAuthors = [
          ...newAuthors,
          {
            id: newAuthors.length + 1,
            authorName: row?.authorName,
          },
        ];
        quote = {
          ...quote,
          authorId: newAuthors.length,
        };
      } else {
        quote = {
          ...quote,
          authorId: indexAuthor + 1,
        };
      }

      if (indexBook === -1) {
        newBooks = [
          ...newBooks,
          {
            id: newBooks.length + 1,
            bookName: row?.bookName,
            enabled: true,
          },
        ];
        quote = {
          ...quote,
          bookId: newBooks.length,
        };
      } else {
        quote = {
          ...quote,
          bookId: indexBook + 1,
        };
      }

      newQuotes = [...newQuotes, quote];
    }

    let authors = [...oldAuthors];
    let books = [...oldBooks];
    let quotes = [...oldQuotes];

    // TODO Check if quote exists then update. If not, add the book and author arrays then the quotes array

    // await Promise.all([
    //   this.authorService.insert(newAuthors),
    //   this.bookService.insert(newBooks),
    //   this.quoteService.insert(newQuotes),
    // ]);

    // remove file
    fs.unlinkSync(`${file.destination}/${file.filename}`);
    fs.unlinkSync(`${file.destination}/${file.filename}-shm`);
    fs.unlinkSync(`${file.destination}/${file.filename}-wal`);
  }
}
