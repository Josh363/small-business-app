const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

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

//@desc Logout/clear cookie
//@route GET /api/v1/auth/logout
//@access Private
exports.logout = asyncHandler(async (req, res, next) => {
  //clear cookie
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    data: `User logged out`,
  })
})

//@desc Update User details
//@route POST /api/v1/auth/updatedetails
//@access Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  //update fields object
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: user,
  })
})

//@desc Update Password
//@route PUT /api/v1/auth/updatepassword
//@access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  //find user with password
  const user = await User.findById(req.user.id).select('+password')
  //check current password
  const isMatch = await user.matchPassword(req.body.currentPassword)
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401))
  }
  //if isMatch is true
  user.password = req.body.newPassword
  await user.save()

  sendTokenResponse(user, 200, res)
})

//@desc Forgot password
//@route POST /api/v1/auth/forgotpassword
//@access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  //check if user exists
  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404))
  }
  //Get reset token
  const resetToken = user.getResetPasswordToken()

  //save token to db..run validateBeforeSave to stop from validating name required, etc
  await user.save({ validateBeforeSave: false })

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`

  const message = `You are receiving this email because you requested a password reset. 
  Please make a PUT request to : \n \n ${resetUrl}`

  console.log(resetUrl)

  //call sendemail
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    })

    res.status(200).json({ success: true, data: 'Email sent' })
  } catch (err) {
    console.log(err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorResponse('Email could not be sent', 500))
  }
})

//@desc Reset password
//@route PUT /api/v1/auth/resetPassword/:resettoken
//@access Private
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')
  //find user by token and check expiration date
  const user = await User.findOne({
    resetPasswordToken,
    //make sure expiration date is greater than today
    resetPasswordExpire: { $gt: Date.now() },
  })
  //if user validation fails..
  if (!user) {
    return next(new ErrorResponse('Invalid token', 400))
  }

  //set new password if validation passes
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()

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
