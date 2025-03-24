#!/usr/bin/env bun
/**
 * This script copies package.json and README.md to the dist folder
 * It's used as part of the build process
 */

import { mkdir } from "node:fs/promises"
import { join } from "node:path"

// Ensure dist directory exists
await mkdir("dist", { recursive: true })

// Copy package.json to dist folder
const packageJson = Bun.file("package.json")
await Bun.write(join("dist", "package.json"), packageJson)
console.log("✅ Copied package.json to dist folder")

// Copy README.md to dist folder
const readme = Bun.file("README.md")
await Bun.write(join("dist", "README.md"), readme)
console.log("✅ Copied README.md to dist folder")

// Copy install-duckdb.js to dist folder
const installDuckdb = Bun.file("scripts/install-duckdb.js")
await Bun.write(join("dist", "scripts", "install-duckdb.js"), installDuckdb)
console.log("✅ Copied install-duckdb.js to dist/scripts folder")

console.log("🎉 All files copied successfully!")
