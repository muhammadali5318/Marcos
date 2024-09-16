const { Sequelize } = require("sequelize");
const user = require("../db/models/user");
const catchAsync = require("../utils/catchAsync");

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await user.findAll({
    where: {
      userType: { [Sequelize.Op.ne]: "0" },
    },
    attributes: { exclude: ['password', 'deletedAt'] },
  });

  if (!users) {
    return next(new AppError("Something went wrong", 400));
  }
  return res.status(200).json({
    status: "success",
    result: users,
  });
});

module.exports = {
  getAllUsers,
};
