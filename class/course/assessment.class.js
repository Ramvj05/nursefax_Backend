class Theory {
  constructor({
    courseId,
    title,
    description: mainDesc,
    passingPercentage,
    numberOfAttempts,
    status,
  }) {
    this.courseId = courseId;
    this.description = mainDesc;
    this.title = title;
    this.passingPercentage = passingPercentage;
    this.numberOfAttempts = numberOfAttempts;
    this.status = status;
  }

  getModel() {
    return this;
  }
}

module.exports = Theory;
