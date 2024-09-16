const project = require("../db/models/project");
const catchAsync = require("../utils/catchAsync");
const user = require("../db/models/user");
const AppError = require("../utils/AppError");

const createProject = catchAsync(async (req, res, next) => {
  const body = req.body;
  const userId = req.user.id;

  const newProject = await project.create({
    title: body.title,
    productImage: body.productImage,
    price: body.price,
    shortDescription: body.shortDescription,
    description: body.description,
    productUrl: body.productUrl,
    category: body.category,
    tags: body.tags,
    createdBy: userId,
  });

  return res.status(201).json({
    status: "success",
    data: newProject,
  });
});

const getAllProject = catchAsync(async (req, res, next) => {
  const result = await project.findAll({
    include: {
      model: user,
      attributes: {
        exclude: ["password", "deletedAt"],
      },
    },
  });

  res.status(200).json({
    status: "success",
    data: result,
  });
});

const getProjectById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const projectResult = await project.findByPk(id, { include: user });
  if (projectResult === null) {
    return next(new AppError("Record Not found!", 400));
  }

  res.status(200).json({
    status: "success",
    data: projectResult,
  });
});

const updateProjectById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const body = req.body;
  const projectResult = await project.findOne({
    where: { id: id, createdBy: userId },
  });

  if (projectResult === null) {
    return next(new AppError("Record Not found!1", 400));
  }

  projectResult.title = body.title;
  projectResult.productImage = body.productImage;
  projectResult.price = body.price;
  projectResult.shortDescription = body.shortDescription;
  projectResult.description = body.description;
  projectResult.productUrl = body.productUrl;
  projectResult.category = body.category;
  projectResult.tags = body.tags;
  projectResult.createdBy = userId;

  const saved = await projectResult.save();
  res.status(200).json({
    status: "success",
    data: saved,
  });
});

const deleteProjectById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const projectResult = await project.findOne({
    where: { id: id, createdBy: userId },
  });

  if (projectResult === null) {
    return next(new AppError("Record Not found!1", 400));
  }

  await projectResult.destroy();

  const saved = await projectResult.save();
  res.status(200).json({
    status: "success",
    message: "Project deleted Successfully",
  });
});

module.exports = {
  createProject,
  getAllProject,
  getProjectById,
  updateProjectById,
  deleteProjectById,
};
