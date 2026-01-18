const LaunchService = require("../services/launch.service");

exports.createLaunch = async (req, res, next) => {
  try {
    const launch = await LaunchService.createLaunch(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Launch created successfully",
      launch: formatLaunch(launch),
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllLaunches = async (req, res, next) => {
  try {
    const launches = await LaunchService.getAllLaunches(req.user.id);

    res.status(200).json({
      success: true,
      count: launches.length,
      launches: launches.map(formatLaunch),
    });
  } catch (error) {
    next(error);
  }
};

exports.getLaunch = async (req, res, next) => {
  try {
    const launch = await LaunchService.getLaunchById(
      req.user.id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      launch: formatLaunch(launch),
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteLaunch = async (req, res, next) => {
  try {
    await LaunchService.deleteLaunch(req.user.id, req.params.id);

    res.status(200).json({
      success: true,
      message: "Launch deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// 🔹 Response formatter (SECURITY BEST PRACTICE)
const formatLaunch = (launch) => ({
  id: launch._id,
  productName: launch.productName,
  productUrl: launch.productUrl,
  launchDate: launch.launchDate,
  timezone: launch.timezone,
  status: launch.status,
  createdAt: launch.createdAt,
});
