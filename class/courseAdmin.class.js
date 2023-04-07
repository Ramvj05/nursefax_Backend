class UserClass {
	constructor({
		userName,
		password,
		profileUri,
		fullName,
		mobile,
		email,
		examAssigned,
		location,
		status,
		roles,
	}) {
		this.userName = userName;
		this.profileUri = profileUri;
		this.examAssigned = examAssigned;
		this.password = password;
		this.fullName = fullName;
		this.mobile = mobile;
		this.email = email;
		this.location = location;
		this.status = status;
		this.roles = roles;
	}

	getModel() {
		return this;
	}
}

module.exports = UserClass;
