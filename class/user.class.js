class UserClass {
  constructor({
    fullName,
    profileUri,
    password,
    mobile,
    email,
    about,
    emailVerified,
    mobileVerified,
    country,
    countryCode,
    mcc,
    UserCountry,
    userType,
    active,
  }) {
    this.fullName = fullName;
    this.profileUri = profileUri;
    this.password = password;
    this.mobile = mobile;
    this.email = email;
    this.about = about;
    this.emailVerified = emailVerified;
    this.mobileVerified = mobileVerified;
    this.country = country;
    this.countryCode = countryCode;
    this.UserCountry = UserCountry;
    this.mcc = mcc;
    this.userType = userType;
    this.active = active;
  }

  getModel() {
    return this;
  }
}

module.exports = UserClass;
