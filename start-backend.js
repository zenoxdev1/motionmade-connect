const { spawn } = require("child_process");
const path = require("path");

console.log("🚀 Starting Motion Connect Backend Server...");

// Start the backend server
const backend = spawn("node", ["server.js"], {
  cwd: path.join(__dirname, "server"),
  stdio: "inherit",
});

backend.on("error", (error) => {
  console.error("❌ Failed to start backend:", error);
});

backend.on("close", (code) => {
  console.log(`🛑 Backend process exited with code ${code}`);
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("🛑 Shutting down backend...");
  backend.kill("SIGINT");
  process.exit();
});

process.on("SIGTERM", () => {
  console.log("🛑 Shutting down backend...");
  backend.kill("SIGTERM");
  process.exit();
});
