class Category {
  constructor({ name, description }) {
    this.name = name;
    this.description = description;
  }

  getModel() {
    return this;
  }
}

module.exports = Category;
