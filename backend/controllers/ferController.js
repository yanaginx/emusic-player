const asyncHandler = require("express-async-handler");
const { spawn } = require("child_process");

// @desc    Get emotion from camera
// @route   GET /api/fer
// @access  Public (for now, will be private later)
const getEmotion = asyncHandler(async (req, res) => {
  let output;
  const ferOutput = spawn("python", ["./backend/python_scripts/fer.py"]);
  // For debugging
  // ferOutput.stderr.on("data", (data) => {
  //   return res.status(500).json({
  //     error: data.toString(),
  //   });
  // });
  ////////////////////////////////////////////////
  ferOutput.stdout.on("data", (data) => {
    output = JSON.parse(data);
  });
  ferOutput.on("close", (code) => {
    if (code === 0) {
      res.status(200).json(output);
    } else {
      res.status(400).json({
        code: process.env.NODE_ENV === "production" ? null : code,
        message: "Somethings went wrong!",
      });
    }
  });
});

module.exports = { getEmotion };
