/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sonarjs/cognitive-complexity */
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

  getPosition = (startContainerPath: any) => {
    let result = 0;

    if (!startContainerPath) {
      return result;
    }

    const array = startContainerPath.split('/');

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
    const [oldAuthors, oldBooks, oldQuotes] = await Promise.all([
      await this.authorService.getAllAuthor(),
      await this.bookService.getAllBook(),
      await this.quoteService.getAllQuote(),
    ]);

    const dataSqlite: any = db
      .prepare(
        `SELECT ct.Attribution AS authorName, ct.title AS bookName,
        bm.Text AS quote, bm.StartContainerPath AS startContainerPath, bm.EndContainerPath AS endContainerPath
        FROM content AS ct
        JOIN Bookmark AS bm
        ON ct.ContentId = bm.volumeId`,
      )
      .all();

    let authors: any = [...oldAuthors];
    let books: any = [...oldBooks];
    let quotes: any = [...oldQuotes];

    for (const quote of dataSqlite) {
      const indexAuthor = authors.findIndex(
        (element) => element.authorName === quote.authorName,
      );
      const indexBook = books.findIndex(
        (element) => element.bookName === quote.bookName,
      );
      const indexQuote = quotes.findIndex(
        (element) =>
          element.startContainerPath === quote.startContainerPath &&
          element.endContainerPath === quote.endContainerPath,
      );

      if (indexAuthor === -1) {
        authors = [
          ...authors,
          { id: authors.length + 1, authorName: quote.authorName },
        ];
      } else {
        authors[indexAuthor] = {
          ...authors[indexAuthor],
          authorName: quote.authorName,
        };
      }

      if (indexBook === -1) {
        books = [
          ...books,
          {
            id: books.length + 1,
            bookName: quote.bookName,
            authorId: indexAuthor === -1 ? authors.length : indexAuthor,
            enabled: true,
          },
        ];
      } else {
        books[indexBook] = {
          ...books[indexBook],
          bookName: quote.bookName,
          authorId: authors[indexAuthor].id,
          enabled: true,
        };
      }

      if (indexQuote === -1) {
        quotes = [
          ...quotes,
          {
            id: quotes.length + 1,
            authorId: indexAuthor === -1 ? authors.length : indexAuthor,
            bookId: indexBook === -1 ? books.length : indexBook,
            quote: quote.quote,
            position: this.getPosition(quote.startContainerPath),
            enabled: true,
            startContainerPath: quote.startContainerPath,
            endContainerPath: quote.endContainerPath,
          },
        ];
      } else {
        quotes[indexQuote] = {
          ...quotes[indexQuote],
          authorId: authors[indexAuthor].id,
          bookId: books[indexBook].id,
          quote: quote.quote,
          position: this.getPosition(quote.startContainerPath),
          enabled: true,
          startContainerPath: quote.startContainerPath,
          endContainerPath: quote.endContainerPath,
        };
      }
    }

    await Promise.all([
      this.authorService.insert(authors),
      this.bookService.insert(books),
      this.quoteService.insert(quotes),
    ]);

    // remove file
    fs.unlinkSync(`${file.destination}/${file.filename}`);
    fs.unlinkSync(`${file.destination}/${file.filename}-shm`);
    fs.unlinkSync(`${file.destination}/${file.filename}-wal`);
  }
}
