module.exports = function stringParse(value) {
	return value.split(',').map((v) => v.trim());
};
