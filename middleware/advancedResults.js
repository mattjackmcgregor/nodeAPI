const advancedResults = (model, populate) => async (req, res, next) => {
  let query
  //copy of req query
  const reqQuery = {
    ...req.query
  }
  //feilds to exclude from query
  const removeFeilds = ['select', 'sort', 'page', 'limit']
  //loop over and delete from query
  removeFeilds.forEach(feild => delete reqQuery[feild])
  //query object to string
  let queryStr = JSON.stringify(reqQuery)


  //create mongodb query operators 
  queryStr = queryStr.replace(/\b(eq|gt|gte|in|lt|lte|ne|nin)\b/g, match => `$${match}`)
  console.log(queryStr)

  //finding query results
  query = model.find(JSON.parse(queryStr))

  //select query check
  if (req.query.select) {
    let feilds = req.query.select.split(',').join(' ')
    query = query.select(feilds)
  }

  //sort query check
  if (req.query.sort) {
    let sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query.sort('createdAt')
  }

  if(populate) {
    query = query.populate(populate)
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  //startIndex specifies numer of docs to skip to return the ones you are trying to recieve
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.countDocuments()

  //adding pagnation to query
  query = query.skip(startIndex).limit(limit)

  //executing query
  const results = await query

  //pagination
  const pagination = {}

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  res.advancedResults = {
    sucess: true,
    count: results.length,
    pagination,
    data: results
  }

  next()
}

module.exports = advancedResults