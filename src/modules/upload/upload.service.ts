/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UploadedFile } from '@nestjs/common';
import Database from 'better-sqlite3';
import * as fs from 'fs-extra';

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

  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const db = new Database(`${file.destination}/${file.filename}`);

    const authorsSqlite = db.prepare('SELECT * FROM authors').all();
    const booksSqlite = db.prepare('SELECT * FROM books').all();
    const quotesSqlite = db.prepare('SELECT * FROM quotes').all();

    const authors = authorsSqlite.map((value: any) => ({
      id: value?.id,
      authorName: value?.author_name,
    }));
    const books = booksSqlite.map((value: any) => ({
      id: value?.id,
      bookName: value?.book_name,
      enabled: value?.enabled === 'true',
    }));
    const quotes = quotesSqlite.map((value: any) => ({
      id: value?.id,
      authorId: value?.author_id,
      bookId: value?.book_id,
      quote: value?.quote,
      position: value?.position,
      enabled: value?.enabled === 'true',
    }));

    await Promise.all([
      this.authorService.insert(authors),
      this.bookService.insert(books),
      this.quoteService.insert(quotes),
    ]);

    // remove file
    fs.unlinkSync(`${file.destination}/${file.filename}`);
  }
}
