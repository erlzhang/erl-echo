const listeners = {};

export default {
  $on(key, callback) {
    if (!listeners[key]) {
      listeners[key] = [];
    }

    listeners[key].push(callback);
  },

  $off(key, callback) {
    if (!listeners[key]) {
      return;
    }

    listeners[key] = listeners[key].filter(cb => cb === callback);
  },

  $emit(key, val) {
    if (!listeners[key]) {
      return;
    }

    listeners[key].forEach(callback => {
      callback(val);
    });
  },

  data: {
    book: null,
    summary: null
  },

  set book(val) {
    this.data.book = val;
    this.$emit('book', val);
  },

  get book() {
    return this.data.book;
  },

  set summary(val) {
    this.data.summary = val;
    this.$emit('summary', val)
  },

  get summary() {
    return this.data.summary;
  },

  getChapter(id: string) {
    if (!this.summary) {
      return null;
    }

    return this.summary.getChapter(id);
  },

  async updateChapter(id: string, obj: any) {
    const chapter = this.getChapter(id);
    chapter.update(obj);
    await this.summary?.update();
    this.$emit('chapter', this.summary.data);
    return chapter.clone();
  },

  async removeChapter(id: string) {
    const chapter = this.summary?.getChapter(id);
    await this.summary?.remove(chapter);
    this.updateWordCount();
    this.$emit('chapter', this.summary.data);
  },
  
  updateWordCount() {
    const wordCount = this.summary?.getWordCount();
    this.$emit('wordCount', wordCount);
  }
}