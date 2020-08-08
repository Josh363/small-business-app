const advancedResults = (model, populate) => async (req, res, next) => {
  let query
  //make a copy of query
  const reqQuery = {
    ...req.query,
  }
  //fields to remove from query
  const removeFields = ['select', 'sort', 'page', 'limit']
  //loop over removed fields
  removeFields.forEach((param) => delete reqQuery[param])
  //turn query into string to manipulate
  let queryStr = JSON.stringify(reqQuery)
  //regex for adding $
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  //turn query string back into json and find resource
  query = model.find(JSON.parse(queryStr))

  //Select
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  //sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  //Pagination
  const page = Number(req.query.page) || 1
  const limit = parseInt(req.query.limit, 10) || 20
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.countDocuments()

  query = query.skip(startIndex).limit(limit)

  //generic populate statement
  if (populate) {
    query = query.populate(populate)
  }

  //finish query
  const results = await query

  //pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  }

  next()
}

module.exports = advancedResults
