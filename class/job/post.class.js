class Post {
  constructor({
    title,
    description,
    thumbnail,
    sections,
    label,
    employerName,
    location,
    minSalary,
    maxSalary,
    postId,
    expireOn,
  }) {
    this.title = title;
    this.description = description;
    this.label = label;
    this.sections = sections;
    this.employerName = employerName;
    this.location = location;
    this.minSalary = minSalary;
    this.maxSalary = maxSalary;
    this.postId = postId;
    this.expireOn = expireOn;
    this.thumbnail = thumbnail;
  }

  getModel() {
    return this;
  }
}

module.exports = Post;
