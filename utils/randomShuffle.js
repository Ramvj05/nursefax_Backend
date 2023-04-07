module.exports = (n, array) => {
	// [0,10,20,30,...,490]
	var shuffled = array.sort(function () {
		return 0.5 - Math.random();
	});
	var selected = shuffled.slice(0, n);
	return selected;
};
