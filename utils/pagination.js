module.exports = async (model, page, pageSize, s) => {
	let sort = s ? s : "createdOn";
	if (page && pageSize) {
		if (sort) {
			return await model
				.sort({ [sort]: -1 })
				.skip((page - 1) * pageSize)
				.limit(pageSize);
		} else {
			return await model.skip((page - 1) * pageSize).limit(pageSize);
		}
	} else {
		if (sort) {
			return await model.sort({ [sort]: -1 });
		} else {
			return await model;
		}
	}
};
