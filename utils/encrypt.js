// const bcrypt = require("bcrypt");
var bcrypt = require("bcryptjs");

const generateSalt = () => {
	let s = bcrypt.genSaltSync(10);
	return s;
};
const generateHash = (plaintextPassword, salt) => {
	let h = bcrypt.hashSync(plaintextPassword, salt);
	return h;
};
module.exports = {
	generateHash,
	generateSalt,
};
