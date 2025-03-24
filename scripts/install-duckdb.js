const os = require("node:os")
const { execSync } = require("node:child_process")

const arch = os.arch()
const platform = os.platform()

if (platform === "darwin" && arch === "arm64") {
  try {
    execSync("npm install duckdb --target_arch=arm64", { stdio: "inherit" })
  } catch (error) {
    console.error("Failed to install duckdb with arm64, falling back to x64 via Rosetta")
    execSync("arch -x86_64 npm install duckdb", { stdio: "inherit" })
  }
} else {
  execSync("npm install duckdb", { stdio: "inherit" })
}
