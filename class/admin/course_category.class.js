class Category {
  constructor({ name, description, thumbnail }) {
    this.name = name;
    this.description = description;
    this.thumbnail = thumbnail;
  }

  getModel() {
    return this;
  }
}

module.exports = Category;
