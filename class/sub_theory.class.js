class Theory {
  constructor({
    theoryId,
    typeOfDoc,
    content,
    thumbnail,
    description: mainDesc,
    title,
    status,
  }) {
    this.theoryId = theoryId;
    this.typeOfDoc = typeOfDoc;
    this.content = content;
    this.thumbnail = thumbnail;
    this.description = mainDesc;
    this.title = title;
    this.status = status;
  }

  getModel() {
    return this;
  }
}

module.exports = Theory;
