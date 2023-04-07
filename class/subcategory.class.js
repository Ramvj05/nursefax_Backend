class SubCategory {
	constructor({ name, description, category }) {
		this.name = name;
		this.description = description;
		this.category = category;
	}

	getModel() {
		return this;
	}
}

module.exports = SubCategory;
