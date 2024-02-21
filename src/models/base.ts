export default class Base {
  toJson() {
    const result = {};
    const names = Object.getOwnPropertyNames(this);
    names.forEach(name => {
      if (name.indexOf('_') < 0) {
        result[name] = this[name];
      }
    })

    return result;
  }

  fromJson(json: any) {
    Object.assign(this, json);
    return this;
  }
}