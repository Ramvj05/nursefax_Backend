class MicroClass {
	constructor({ name, description, subject, subClass }) {
		this.name = name;
		this.description = description;
		this.subject = subject;
		this.subClass = subClass;
	}

	getModel() {
		return this;
	}
}

module.exports = MicroClass;
