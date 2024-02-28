import Book from '@/models/book';
import Summary from '@/models/summary';
import Chapter from '@/models/chapter';

import TurndownService from 'turndown/lib/turndown.browser.es';
import JSZip from 'jszip';
import {
  saveAs
} from '@/utils/file';

import {
  CATEGORY
} from '@/const/book';

export default class {
  id: number;
  turndownService: TurndownService;

  constructor(id: number) {
    this.id = id;
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      hr: '---',
      emDelimiter: '*'
    });
  }

  async export(book:Book, summary: Summary): Promise<any> {
    const chapters = summary.data;

    const _chapters = [];
    let parent = null;
    chapters.forEach(chapter => {
      if (!chapter.level || !parent) {
        parent = {
          chapter,
          children: [],
          slug: chapter.slug,
          path: chapter.slug + '.md'
        };
        _chapters.push(parent);
      } else {
        parent.children.push({
          chapter,
          path: `${parent.slug}/${chapter.slug}.md`
        });
      }
    });

    const contents = [this.bookToMd(book)];
    _chapters.forEach((obj, idx) => {
      if (obj.children && obj.children.length) {
        obj.path = `${obj.slug}/index.md`;
      }
      contents.push(this.chapterToMd(obj.chapter, idx, obj.path));
      obj.children.forEach((child, _idx) => {
        contents.push(
          this.chapterToMd(child.chapter, _idx, child.path)
        )
      })
    });

    return Promise.all(contents)
      .then(pages => {
        const zip = new JSZip();
        let folder: any = zip;
        pages.forEach(({name, content}) => {
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
category: ${CATEGORY[book.category].label}
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

  async chapterToMd(chapter: Chapter, idx: number, path: string): Promise<{
    name: string,
    content: string
  }> {
    const post = await chapter.getContent();
    const content = `---
title: ${chapter.title || ""}
index: ${idx + 1}
---
${this.turndownService.turndown(post || "")}
    `;
    return {
      name: path,
      content
    };
  }
}