class QuestionsClass {
	constructor({
		comment,
		question,
		options,
		explanation,
		keywords,
		subject,
		nanoClass,
		microClass,
		typeOfQuestion,
		subClass,
		correctAnswer,
		status,
		chooseAnswer,
		lastAttemptOn,
		examId,
		testId,
	}) {
		this.lastAttemptOn = lastAttemptOn,
		this.comment = comment;
		this.question = question;
		this.options = options;
		this.chooseAnswer = chooseAnswer,
		this.explanation = explanation;
		this.keywords = keywords;
		this.correctAnswer = correctAnswer;
		this.status = status;
		this.typeOfQuestion = typeOfQuestion;
		this.subject = subject;
		this.nanoClass = nanoClass;
		this.microClass = microClass;
		this.subClass = subClass;
		this.examId = examId;
		this.testId = testId
	}

	getModel() {
		return this;
	}
}

module.exports = QuestionsClass;
