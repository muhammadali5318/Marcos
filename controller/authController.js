const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const generateJWTToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRECT, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

const signUp = catchAsync(async (req, res, next) => {
  const body = req.body;

  if (!["1", "2"].includes(body.userType)) {
    throw new AppError("Invalid user Type", 400);
  }

  const newUser = await user.create({
    userType: body.userType,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  if (!newUser) {
    throw new AppError("Failed to create user", 400);
  }

  const savedUser = newUser.toJSON();

  delete savedUser.password;
  delete savedUser.confirmPassword;
  delete savedUser.deletedAt;

  savedUser.token = generateJWTToken({
    id: savedUser.id,
    firstName: savedUser.firstName,
  });

  return res.status(201).json({
    status: "Success",
    data: savedUser,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  const result = await user.findOne({ where: { email } });
  if (!result || !(await bcrypt.compare(password, result.password))) {
    throw new AppError("Icorrect email or Password", 400);
  }

  let token = generateJWTToken({ id: result.id });
  result.token = token;
  result.toJSON();
  delete result.password;
  delete result.confirmPassword;
  delete result.deletedAt;

  res.status(201).json({
    status: "Success",
    data: token,
  });
});

const authentication = catchAsync(async (req, res, next) => {
  let idToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
  }

  if (!idToken) {
    return next(new AppError("Please Login to get access", 401));
  }

  const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRECT);
  const newUser = await user.findByPk(tokenDetail.id);

  if (!newUser) {
    return next(new AppError("User does not exist", 400));
  }

  req.user = newUser;
  console.log(newUser);
  return next();
});

const restrictUser = (...userType) => {
  const checkPermission = (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }
    return next();
  };
  return checkPermission;
};

module.exports = {
  signUp,
  login,
  authentication,
  restrictUser,
};
