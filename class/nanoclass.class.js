class NanoClass {
	constructor({ name, description, subject, subClass, microClass }) {
		this.name = name;
		this.description = description;
		this.subject = subject;
		this.microClass = microClass;
		this.subClass = subClass;
	}

	getModel() {
		return this;
	}
}

module.exports = NanoClass;
