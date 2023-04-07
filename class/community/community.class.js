class Theory {
  constructor({ title, description: mainDesc, thumbnail, groups }) {
    this.title = title;
    this.description = mainDesc;
    this.thumbnail = thumbnail;
    this.groups = groups;
  }

  getModel() {
    return this;
  }
}

module.exports = Theory;
