class QuestionPool {
  constructor({
    exam,
    category,
    categoryColor,
    topic,
    description,
    showOnStudent,
    thumbnail,
    questions,
    type,
    duration,
    status,
    marks,
    live,
  }) {
    this.marks = marks;
    this.duration = duration;
    this.showOnStudent = showOnStudent;
    this.exam = exam;
    this.category = category;
    this.categoryColor = categoryColor;
    this.topic = topic;
    this.status = status;
    this.type = type;
    this.description = description;
    this.thumbnail = thumbnail;
    this.questions = questions;
    this.live = live;
  }

  getModel() {
    return this;
  }
}

module.exports = QuestionPool;
