class Course {
  constructor({
    category,
    courseAdmin,
    thumbnail,
    phone,
    features,
    courseFeatures,
    whyTakeCourse,
    course_provider,
    keywords,
    sections,
    faqs,
    price,
    inr_price,
    original_price,
    original_inr_price,
    featured,
    priority,
    seo,
    headings,
    name,
    live,
    wishlist,
    description,
    active,
  }) {
    this.name = name;
    this.courseAdmin = courseAdmin;
    this.category = category;
    this.thumbnail = thumbnail;
    this.phone = phone;
    this.features = features;
    this.courseFeatures = courseFeatures;
    this.course_provider = course_provider;
    this.whyTakeCourse = whyTakeCourse;
    this.keywords = keywords;
    this.sections = sections;
    this.faqs = faqs;
    this.price = price;
    this.inr_price = inr_price;
    this.original_price = original_price;
    this.original_inr_price = original_inr_price;
    this.featured = featured;
    this.priority = priority;
    this.seo = seo;
    this.wishlist = wishlist;
    this.live = live;
    this.description = description;
    this.active = active;
    this.headings = headings;
  }

  getModel() {
    return this;
  }
}

module.exports = Course;
