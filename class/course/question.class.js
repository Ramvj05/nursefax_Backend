class QuestionsClass {
  constructor({
    comment,
    question,
    options,
    explanation,
    keywords,
    typeOfQuestion,
    correctAnswer,
    status,
    courseId,
  }) {
    this.comment = comment;
    this.question = question;
    this.options = options;
    this.explanation = explanation;
    this.keywords = keywords;
    this.correctAnswer = correctAnswer;
    this.status = status;
    this.typeOfQuestion = typeOfQuestion;
    this.courseId = courseId;
  }

  getModel() {
    return this;
  }
}

module.exports = QuestionsClass;
