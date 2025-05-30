# Changelog

## [1.2.1](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/compare/v1.2.0...v1.2.1) (2025-05-12)


### Bug Fixes

* **index:** :lock: Update event stream projection description for sensitive data handling ([d2c7965](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/commit/d2c79659187238befc1ed3a75204cda653e67782))

## [1.2.0](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/compare/v1.1.2...v1.2.0) (2025-05-12)


### Features

* bumped sdk and data pump dependencies and added support for sensitive data event streams ([b485973](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/commit/b48597351ecfee49be92e8c1e685a89c4c7a09b4))

## [1.1.2](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/compare/v1.1.1...v1.1.2) (2025-03-26)


### Bug Fixes

* **package:** :sparkles: Update @flowcore/data-pump to version 0.3.5 ([70350ca](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/commit/70350ca7f18a4006605b67a8b6d0e4e2ae12a846))

## [1.1.1](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/compare/v1.1.0...v1.1.1) (2025-03-25)


### Bug Fixes

* **package:** :sparkles: Update build script to use bun run for bundling ([02a1a8d](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/commit/02a1a8d87249724fd2d2698f33d11909268febcb))
* **package:** :sparkles: Update dependencies and add bunfig.toml configuration ([09a950c](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/commit/09a950c585129e324fbaced48c2435ffa69ab239))

## [1.1.0](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/compare/v1.0.0...v1.1.0) (2025-03-25)


### Features

* **duckdb:** :sparkles: Add support for native arm64 DuckDB on macOS ([4b27114](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/commit/4b2711416102dfeb802121ad1331915e3e39b7a6))


### Bug Fixes

* **bun.lock:** :sparkles: Update biome package with additional optional dependencies for various platforms ([9f206c4](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/commit/9f206c4ba2ac48f4b588a0e9d6d12ce8f7172cc8))
* **package:** :fire: Remove DuckDB dependencies from package.json ([f9a6373](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/commit/f9a637331b386c5738fff2e48745bd1930833b4e))
* **package:** :sparkles: Add postinstall script for DuckDB installation and copy script to dist ([f33c36f](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/commit/f33c36f95d3e1f31fefe2857157095ed548782af))

## 1.0.0 (2025-03-24)


### Features

* **duckdb:** :sparkles: Add duckdb-async support and enhance DuckDB tools ([1dfad08](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/commit/1dfad08ccdd3756e5b04f49dfa53ae72884e15c2))
* **initial:** :sparkles: Initialize Flowcore Local Read Model MCP Server with essential files and configurations ([0df6421](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/commit/0df64219a057a1de82e5bdbb5f1a8be522404d36))


### Bug Fixes

* **duckdb:** :bug: Ensure proper closure of DuckDB connection ([5957ac6](https://github.com/flowcore-io/mcp-flowcore-local-readmodel/commit/5957ac6a60b0a67d61dcd9f72ccc2530b859fc29))

## [1.6.0](https://github.com/flowcore-io/mcp-flowcore-platform/compare/v1.5.3...v1.6.0) (2025-03-18)


### Features

* **index:** :sparkles: Add support for PAT exchange and update service account handling ([43aa0c5](https://github.com/flowcore-io/mcp-flowcore-platform/commit/43aa0c5bf168885759ac531a544112aa9449d1a9))

## [1.5.3](https://github.com/flowcore-io/mcp-flowcore-platform/compare/v1.5.2...v1.5.3) (2025-03-14)


### Bug Fixes

* **index:** :bug: Adjust default pageSize to 10 and improve cursor handling in event ingestion ([a54dda8](https://github.com/flowcore-io/mcp-flowcore-platform/commit/a54dda81e55580f3e0464c700c69e9512c80f8a2))

## [1.5.2](https://github.com/flowcore-io/mcp-flowcore-platform/compare/v1.5.1...v1.5.2) (2025-03-13)


### Bug Fixes

* **index:** :memo: Update documentation for get_events tool with additional pagination and filtering details ([ece6df3](https://github.com/flowcore-io/mcp-flowcore-platform/commit/ece6df36285ac3fd1751d77313889a646d371ccc))

## [1.5.1](https://github.com/flowcore-io/mcp-flowcore-platform/compare/v1.5.0...v1.5.1) (2025-03-12)


### Bug Fixes

* **index:** :art: Update events type to array for consistency in ingestion ([804af9a](https://github.com/flowcore-io/mcp-flowcore-platform/commit/804af9ab09c10a7b5f3c54898d76e7831236986a))

## [1.5.0](https://github.com/flowcore-io/mcp-flowcore-platform/compare/v1.4.0...v1.5.0) (2025-03-12)


### Features

* **index:** :sparkles: Add ingest tool for event ingestion with API key support ([bbec794](https://github.com/flowcore-io/mcp-flowcore-platform/commit/bbec7948847f93f2081b457755c0af32584686d4))

## [1.4.0](https://github.com/flowcore-io/mcp-flowcore-platform/compare/v1.3.0...v1.4.0) (2025-03-12)


### Features

* **index:** :sparkles: Add handlers for tenant retrieval and updates for data core, flow type, and event type ([50053ad](https://github.com/flowcore-io/mcp-flowcore-platform/commit/50053ad4075ae36465b79d25d69b3b4201b20c94))

## [1.3.0](https://github.com/flowcore-io/mcp-flowcore-platform/compare/v1.2.1...v1.3.0) (2025-03-12)


### Features

* **index:** :sparkles: Add new tools for data core, flow type, and event type management ([7f17118](https://github.com/flowcore-io/mcp-flowcore-platform/commit/7f17118ddb7cf216a2cadc5d55bd517f76ee58a6))
* **prompts:** :sparkles: Add platform prompts for Flowcore Platform interaction and contract creation ([7d1abdd](https://github.com/flowcore-io/mcp-flowcore-platform/commit/7d1abdd7a6819814ec7f90dd92bcf11dd978a1ec))

## [1.2.1](https://github.com/flowcore-io/mcp-flowcore-platform/compare/v1.2.0...v1.2.1) (2025-03-12)


### Bug Fixes

* **index:** :memo: Add prompts array to server configuration ([2124a37](https://github.com/flowcore-io/mcp-flowcore-platform/commit/2124a3792b2da0a062c99cf91cee50c73a1b4213))

## [1.2.0](https://github.com/flowcore-io/mcp-flowcore-platform/compare/v1.1.1...v1.2.0) (2025-03-12)


### Features

* **build:** :sparkles: Add shebang line to build process and create add-shebang script ([9203216](https://github.com/flowcore-io/mcp-flowcore-platform/commit/92032166cacac335fb6bb05099a93b93115a25f5))

## [1.1.1](https://github.com/flowcore-io/mcp-flowcore-platform/compare/v1.1.0...v1.1.1) (2025-03-12)


### Bug Fixes

* **index:** :memo: Update server description and add information on Flowcore Platform usage ([096f7ce](https://github.com/flowcore-io/mcp-flowcore-platform/commit/096f7cea626a53087bb8d10c830d36d3891f0e67))

## [1.1.0](https://github.com/flowcore-io/mcp-flowcore-platform/compare/v1.0.3...v1.1.0) (2025-03-12)


### Features

* **build:** :sparkles: Add file copying to build process ([3dd3399](https://github.com/flowcore-io/mcp-flowcore-platform/commit/3dd3399a90fef7e0e1076385a8def5052ee7d133))


### Bug Fixes

* **package:** :art: Update entry point and restructure CLI implementation ([4b5533c](https://github.com/flowcore-io/mcp-flowcore-platform/commit/4b5533c3cc42ded5c22d23bb4b1ec414ce606820))

## [1.0.3](https://github.com/flowcore-io/mcp-flowcore-platform/compare/v1.0.2...v1.0.3) (2025-03-12)


### Bug Fixes

* **ci:** :sparkles: Enhance npm publish workflow with auth token and version logging ([5c3b423](https://github.com/flowcore-io/mcp-flowcore-platform/commit/5c3b423576289be8aef0d90ef98bf65c4f91989e))

## [1.0.2](https://github.com/flowcore-io/mcp-flowcore-platform/compare/v1.0.1...v1.0.2) (2025-03-12)


### Bug Fixes

* **ci:** :sparkles: Add registry URL for npm in publish workflow ([8262529](https://github.com/flowcore-io/mcp-flowcore-platform/commit/8262529c929858255b5386af7dff5dfaaf97f75b))
* **ci:** :sparkles: Add scope for npm in publish workflow ([919b4d6](https://github.com/flowcore-io/mcp-flowcore-platform/commit/919b4d64bfc9d25890259a7d0ab0ae53627c250b))

## [1.0.1](https://github.com/flowcore-io/mcp-flowcore-platform/compare/v1.0.0...v1.0.1) (2025-03-12)


### Bug Fixes

* **ci:** :bug: Switch from bun publish to npm publish in workflow ([009e89d](https://github.com/flowcore-io/mcp-flowcore-platform/commit/009e89df8a92999078e2b1ff0220e1d169c5b269))

## 1.0.0 (2025-03-12)


### Features

* **project:** :tada: Initialize Flowcore Platform MCP Server project ([d31f599](https://github.com/flowcore-io/mcp-flowcore-platform/commit/d31f599abbecb30669ff10aec8aa2daf11e51528))


### Bug Fixes

* **ci:** :bug: Update build command in publish workflow ([8a9183d](https://github.com/flowcore-io/mcp-flowcore-platform/commit/8a9183db397c1be89fe99362ba2dfbfa4258c0a5))
* **project:** :wrench: Add Biome for linting and formatting ([ebd49a6](https://github.com/flowcore-io/mcp-flowcore-platform/commit/ebd49a68bf1cc36cd8c9c2fb1c934e4852b1ed3d))
