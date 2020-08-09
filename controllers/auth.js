const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

//@desc Register user
//@route Get /api/v1/auth/register
//@access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  //create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  })

  sendTokenResponse(user, 200, res)
})

//@desc Login user
//@route POST /api/v1/auth/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  //validate email and pw
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400))
  }

  //Check user
  const user = await User.findOne({ email }).select('+password')
  //validate user with email
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }
  //check if password matches..returns true or false based on if a match
  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }
  //call sendtoken response
  sendTokenResponse(user, 200, res)
})

//Get token from model, create cookie, send response
const sendTokenResponse = (user, statusCode, res) => {
  //create token
  const token = user.getSignedJwtToken()
  //cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }
  //secure cookie if in production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }
  //res object
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  })
}

//@desc Get current logged in user
//@route POST /api/v1/auth/me
//@access Private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = req.user
  //const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    data: user,
  })
})
