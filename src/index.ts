#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { parseArgs } from "node:util"
import { z } from "zod"
import pkg from "../package.json"
import {
  closeDuckDBHandler,
  createEventProjectorHandler,
  createProjectionTableHandler,
  getAllStreamsHandler,
  getStreamInfoHandler,
  initializeDuckDBHandler,
  queryDatabaseHandler,
  startEventStreamProjectionHandler,
  stopEventStreamProjectionHandler,
} from "./tools/duckdb-tools"
import { exchangePat } from "./utils/pat-exchange"

// Parse command line arguments
const { values: parsedValues } = parseArgs({
  // Use process.argv if Bun is not available
  args: typeof Bun !== "undefined" ? Bun.argv : process.argv,
  options: {
    username: { type: "string" },
    pat: { type: "string" },
  },
  allowPositionals: true,
})

const username = parsedValues.username as string
const pat = parsedValues.pat as string

if (!username && !pat) {
  throw new Error("No username or PAT provided")
}

// Create an MCP server
const server = new McpServer({
  name: "Flowcore Local Read Model",
  version: pkg.version,
  description: `## Flowcore Local Read Model
    An MCP server for creating a local Read Model and feeding it with events from the Flowcore Platform.`,
  prompts: [],
  resources: [],
})

// Register DuckDB tools
server.tool(
  "initialize_duckdb",
  "Initialize an in-memory DuckDB database for the read model",
  {
    file: z.string().optional().describe("absolute path to the DuckDB database file"),
  },
  initializeDuckDBHandler(),
)

server.tool(
  "close_duckdb",
  "Close the DuckDB database, this will stop the event stream projection. If the database is in-memory it will be lost.",
  {},
  closeDuckDBHandler(),
)

server.tool(
  "stop_event_stream_projection",
  "Stop the event stream projection for a given stream ID",
  { streamId: z.string().describe("ID of the stream to stop") },
  stopEventStreamProjectionHandler(),
)

server.tool(
  "create_projection_table",
  `Create a projection table in the DuckDB database using SQL - allows full control over the table definition

When creating tables in DuckDB, follow these guidelines:

1. Data Types and Formats:
   - TIMESTAMP: Use ISO 8601 format (YYYY-MM-DD HH:MM:SS.SSS)
   - DATE: Use ISO format (YYYY-MM-DD)
   - TIME: Use 24-hour format (HH:MM:SS.SSS)
   - DECIMAL/NUMERIC: Specify precision and scale (e.g., DECIMAL(10,2))
   - VARCHAR: Always specify length limit (e.g., VARCHAR(100))

2. Column Constraints:
   - Use NOT NULL when data integrity is critical
   - Define PRIMARY KEY constraints explicitly
   - Consider UNIQUE constraints where appropriate
   - Set DEFAULT values in correct format matching column type

3. Best Practices:
   - Use lowercase for table and column names
   - Use snake_case for naming conventions
   - Include appropriate indexes for query optimization
   - Consider partitioning for large tables
   - Use appropriate compression options when available

4. Example Format:
<example sql code>
CREATE TABLE table_name (
    id INTEGER PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    valid_from DATE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
</example sql code>

if using a file path the table might exist already, so you have to take account of that when creating the table
`,
  {
    createTableSQL: z
      .string()
      .describe("DuckDB SQL CREATE TABLE statement (e.g. 'CREATE TABLE users (id INTEGER, name VARCHAR)')"),
  },
  createProjectionTableHandler(),
)

server.tool(
  "create_event_projector",
  `Create and register a JavaScript projector function that transforms Flowcore events into database records. The function must adhere to the following specifications:

1. Function Structure:
   - Input: Flowcore event object containing event data
   - Output: Object matching a single projection table schema
   - Must be pure function with no side effects
   - Handle null/undefined values gracefully
   - Objects or array of object returned must match the projection table schema or it will fail to insert into the database

2. Data Type Formatting Requirements:
   - Timestamps: ISO 8601 format (YYYY-MM-DD'T'HH:mm:ss.sssZ)
   - Dates: ISO 8601 date format (YYYY-MM-DD)
   - Booleans: true/false (not 1/0 or string representations)
   - Numbers: 
     - Integers: whole numbers without decimals
     - Decimals: Use exact decimal representation (avoid floating-point)
     - Currency: Handle with appropriate precision (typically 2 decimal places)
   - Strings: Properly escaped, trimmed where appropriate
   - Arrays: Serialized as JSON strings if storing in string columns
   - JSON: Stringified for JSON columns

3. Error Handling:
   - Validate required fields
   - Provide type coercion where necessary
   - Include error handling for malformed input
   - Return null for unmappable fields rather than throwing errors

4. Example Function Structure:

input: raw event object from Flowcore
output: object or array of objects that match the projection table schema

***the function should only handle one table type output, if you need to project to multiple tables you can use the same function multiple times using a switch statement or if statements***
The function must return a single object or an array of objects, it can also return a promise that resolves to a single object or an array of objects.

<example js code>
function projectEvent(event) {
    return {
        id: event.id,
        timestamp: new Date(event.timestamp).toISOString(),
        amount: Number.parseFloat(event.amount).toFixed(2),
        status: String(event.status).toLowerCase(),
        metadata: JSON.stringify(event.metadata),
        is_active: Boolean(event.active)
    };
}
module.exports = projectEvent;
</example js code>
  `,
  {
    name: z.string().describe("A unique name for this projector"),
    absoluteFilePath: z
      .string()
      .describe("Absolute file path to the JavaScript file that contains the projector function"),
  },
  createEventProjectorHandler(),
)

server.tool(
  "start_event_stream_projection",
  "Start streaming events from Flowcore and projecting them to the database",
  {
    tenant: z.string().describe("Tenant name"),
    dataCore: z.string().describe("Name of the data core"),
    flowTypeName: z.string().describe("Name of the flow type"),
    eventTypeNames: z.array(z.string()).describe("Name of the event types to project, can be multiple event types but only within the same flow type, this will maintain the ordering of the events"),
    startDate: z.string().describe("Start date for event streaming"),
    endDate: z.string().describe("End date for event streaming"),
    projectorName: z.string().describe("Name of the projector to use for events"),
    targetTable: z.string().describe("Name of the table to project events to"),
    maxParallelism: z
      .number()
      .optional()
      .describe(
        "Maximum number of events to process in parallel (default: 100), this can be used to speed up the projection, but don't increase it too much as it will use more local resources",
      ),
  },
  startEventStreamProjectionHandler(async () => exchangePat(username, pat)),
)

server.tool(
  "query_database",
  "Execute a SQL query on the DuckDB database",
  {
    query: z.string().describe("SQL query to execute"),
  },
  queryDatabaseHandler(),
)

server.tool(
  "get_stream_info",
  "Get information about a specific event stream projection",
  {
    streamId: z.string().describe("ID of the stream to get information for"),
  },
  getStreamInfoHandler(),
)

server.tool("get_all_streams", "Get information about all active event stream projections", {}, getAllStreamsHandler())

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport()
await server.connect(transport)
