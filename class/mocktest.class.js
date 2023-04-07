class MockTest {
	constructor({
		examId,
		name,
		description,
		numberOfSections,
		totalDuration,
		timeFormat,
		sections,
		instruction,
		generalInstruction,
	}) {
		this.examId = examId;
		this.numberOfSections = numberOfSections;
		this.totalDuration = totalDuration;
		this.timeFormat = timeFormat;
		this.name = name;
		this.description = description;
		this.sections = sections;
		this.instruction = instruction;
		this.generalInstruction = generalInstruction;
	}

	getModel() {
		return this;
	}
}

module.exports = MockTest;
