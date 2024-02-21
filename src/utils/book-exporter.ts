import Book from '@/models/book';
import Post from '@/models/post';
import Chapter from '@/models/chapter';

import TurndownService from 'turndown/lib/turndown.browser.es';
import JSZip from 'jszip';
import {
  saveAs
} from '@/utils/file';

import {
  CATEGORY
} from '@/const/book';
import db from '@/api/db';

export default class {
  id: number;

  constructor(id: number) {
    this.id = id;
  }

  async export(): Promise<any> {
    const book = await Book.get(this.id);
    const chapters = await book.getChapters();
    var turndownService = new TurndownService({
      headingStyle: 'atx',
      hr: '---',
      emDelimiter: '*'
    });
    const contents = [this.bookToMd(book)];
    chapters.forEach((chapter, idx) => {
      contents.push(this.chapterToMd(chapter, idx, turndownService));
    });

    return Promise.all(contents)
      .then(pages => {
        const zip = new JSZip();
        let folder: any = zip;
        pages.forEach(({name, content, volume, level}) => {
          if (!level) {
            if (volume) {
              folder = zip.folder(volume);
            } else {
              folder = zip;
            }
          }

          folder.file(name, content);
        });

        return zip.generateAsync({type:"blob"}).then(function(content) {
          return saveAs(content, book.slug + ".zip");
        });
      });
  }

  async bookToMd(book: Book): Promise<{
    name: string,
    content: string
  }> {
    const content = `---
title: ${book.title}
category: ${CATEGORY[book.category]}
start: ${book.start}
end: ${book.end}
---
${book.content || ""}
`;
    return {
      name: 'index.md',
      content
    };
  }

  async chapterToMd(chapter: Chapter, idx: number, service: TurndownService): Promise<{
    name: string,
    content: string,
    volume: string,
    level: number
  }> {
    const post = await Post.get(chapter.path);
    const content = `---
title: ${chapter.title || ""}
index: ${idx + 1}
---
${service.turndown(post.content || "")}
    `;
    let name = chapter.slug + '.md';
    if (chapter.volume) {
      name = 'index.md'
    }
    return {
      name: name,
      content,
      volume: chapter.volume ? chapter.slug : '',
      level: chapter.level
    };
  }
}