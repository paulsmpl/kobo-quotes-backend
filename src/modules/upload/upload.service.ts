/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UploadedFile } from '@nestjs/common';
import Database from 'better-sqlite3';
import * as fs from 'fs-extra';

@Injectable()
export class UploadService {
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const db = new Database(`${file.destination}/${file.filename}`);

    const authors = db.prepare('SELECT * FROM authors').all();
    const books = db.prepare('SELECT * FROM books').all();
    const quotes = db.prepare('SELECT * FROM quotes').all();

    // remove file
    fs.unlinkSync(`${file.destination}/${file.filename}`);
  }
}
