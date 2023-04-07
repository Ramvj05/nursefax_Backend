class Theory {
  constructor({
    examId,
    subjectIds,
    subClassIds,
    microClassIds,
    nanoClassIds,
    typeOfDoc,
    thumbnail,
    category,
    content,
    description: mainDesc,
    title,
    status,
  }) {
    this.examId = examId;
    this.subjectIds = subjectIds;
    this.subClassIds = subClassIds;
    this.microClassIds = microClassIds;
    this.nanoClassIds = nanoClassIds;
    this.typeOfDoc = typeOfDoc;
    this.category = category;
    this.thumbnail = thumbnail;
    this.content = content;
    this.description = mainDesc;
    this.title = title;
    this.status = status;
  }

  getModel() {
    return this;
  }
}

module.exports = Theory;
