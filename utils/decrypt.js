// const bcrypt = require("bcrypt");
var bcrypt = require("bcryptjs");

const decrypy = (plaintextPassword, hash) =>
	bcrypt.compareSync(plaintextPassword, hash);

module.exports = decrypy;
