const advancedResults = (model, populate) => async (req, res, next) => {
  const removeFields = ['select', 'sort', 'page', 'limit'];
  let reqQuery = {...req.query};
  removeFields.forEach((param) => delete reqQuery[param]);
  // Fix query to mongodb
  let query = JSON.stringify(reqQuery);
  reqQuery = JSON.parse(
      query.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`));
  query = model.find(reqQuery);

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // console.log(query)
  const result = await query;
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.advancedResults = {
    success: true,
    count: result.length,
    pagination,
    data: result,

  };
  next();
};

module.exports = advancedResults;
