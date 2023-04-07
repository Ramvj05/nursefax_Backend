class LoginClass {
	constructor({ userName, password, userType }) {
		this.userName = userName;
		this.password = password;
		this.userType = userType;
	}

	getModel() {
		return this;
	}
}

module.exports = LoginClass;
