class Theory {
  constructor({
    courseId,
    category,
    thumbnail,
    description: mainDesc,
    title,
    status,
  }) {
    this.courseId = courseId;
    this.category = category;
    this.description = mainDesc;
    this.title = title;
    this.thumbnail = thumbnail;
    this.status = status;
  }

  getModel() {
    return this;
  }
}

module.exports = Theory;
