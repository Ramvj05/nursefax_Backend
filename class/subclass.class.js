class SubClass {
	constructor({ name, description, subject }) {
		this.name = name;
		this.description = description;
		this.subject = subject;
	}

	getModel() {
		return this;
	}
}

module.exports = SubClass;
