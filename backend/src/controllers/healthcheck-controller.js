import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiRespnse.js"
import asyncHandler from "../utils/asyncHanedler.js"

const healthcheck = asyncHandler(async (req, res) => {
  const healthInfo = {
    status: "OK",
    uptime: process.uptime(), // seconds server has been running
    timestamp: new Date(),
    service: "YouTube Clone API", // optional: your service name
  };

  return res.status(200).json(new ApiResponse("Server is healthy", healthInfo));
});

export { healthcheck };
