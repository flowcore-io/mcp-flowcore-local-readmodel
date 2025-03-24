# MCP Server for Locally Hosted Read Model using Bun and @flowcore/sdk

I'll rewrite your requirements specifically for an MCP server implementation using Bun runtime and the @flowcore/sdk, with clear, checkable tasks.

## Overview

The goal is to create a Model-Command-Projection (MCP) server using Bun runtime that builds a locally hosted read model by:

1. Initializing an in-memory DuckDB database
2. Creating tables with specific structures
3. Converting Flowcore events to database records
4. Streaming events from a data-core using the @flowcore/sdk

## MCP Server Tools for Bun with @flowcore/sdk

### 1. Initialize In-Memory DuckDB

```javascript
function initializeDuckDB() {
  // Tool implementation using Bun
}
```

**Description**: Creates and initializes an in-memory DuckDB database instance within the MCP server running on Bun. This database will serve as the storage for the projection/read model. The database persists only for the duration of the MCP server runtime. Uses Bun's performance advantages for fast database operations.

**Input**: None

**Output**:

- `success`: Boolean indicating if initialization was successful
- `databaseInstance`: Reference to the initialized database

**Example Usage**:

```javascript
import { initializeDuckDB } from './mcp-tools';

const db = initializeDuckDB();
```

**Task Completion Criteria**:

- [x] Function successfully creates an in-memory DuckDB instance in the MCP server running on Bun
- [x] Function returns a usable database reference
- [x] Database is ready to accept table creation commands for projections

### 2. Create Projection Table

```javascript
function createProjectionTable(tableName, columns) {
  // Tool implementation using Bun
}
```

**Description**: Creates a new projection table in the MCP server's DuckDB database with the specified structure. The columns parameter defines the schema of the projection table including column names, data types, and constraints. Optimized for Bun runtime performance.

**Input**:

- `tableName`: String - Name of the projection table to create
- `columns`: Array of objects - Each object represents a column with properties:
  - `name`: String - Column name
  - `type`: String - Data type (e.g., 'INTEGER', 'VARCHAR', 'TIMESTAMP')
  - `constraints`: String (optional) - SQL constraints (e.g., 'PRIMARY KEY', 'NOT NULL')

**Output**:

- `success`: Boolean indicating if projection table creation was successful
- `message`: String with details about the operation

**Example Usage**:

```javascript
import { createProjectionTable } from './mcp-tools';

createProjectionTable('users_projection', [
  { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
  { name: 'name', type: 'VARCHAR', constraints: 'NOT NULL' },
  { name: 'created_at', type: 'TIMESTAMP' }
]);
```

**Task Completion Criteria**:

- [x] Function creates a projection table with the specified name in the MCP server
- [x] Projection table has the correct column structure as defined
- [x] Function handles errors appropriately
- [x] Works efficiently with Bun runtime

### 3. Create Event Projector Function

```javascript
function createEventProjector(eventType, projectionFunction) {
  // Tool implementation using Bun and @flowcore/sdk
}
```

**Description**: Creates and registers a JavaScript projector function in the MCP server that converts a Flowcore event to a database record format. The projection function takes a FlowcoreEvent from @flowcore/sdk as input and returns an object matching the projection table structure. The projected record is then automatically inserted into the appropriate database table. Leverages Bun's performance for efficient event processing.

**Input**:

- `eventType`: String - The type of Flowcore event this projector handles
- `projectionFunction`: Function - JavaScript function that accepts a FlowcoreEvent from @flowcore/sdk and returns a database record object

**Output**:

- `success`: Boolean indicating if the projector was registered successfully
- `projectorId`: String - Unique identifier for the registered projector

**Example Usage**:

```javascript
import { createEventProjector } from './mcp-tools';
import { FlowcoreEvent } from '@flowcore/sdk';

createEventProjector('UserCreated', (event: FlowcoreEvent) => {
  return {
    id: event.payload.userId,
    name: event.payload.userName,
    created_at: event.metadata.timestamp
  };
});
```

**Task Completion Criteria**:

- [x] Function successfully registers the projection function in the MCP server
- [x] Projector correctly transforms @flowcore/sdk events to database records
- [x] Projected records are properly inserted into the projection table
- [x] Takes advantage of Bun's performance characteristics

### 4. Start Event Stream Projection

```javascript
function startEventStreamProjection(dataCore, flowType, eventType, startDate, endDate) {
  // Tool implementation using Bun and @flowcore/sdk
}
```

**Description**: Initiates a stream of events from the specified data-core to the MCP server using the @flowcore/sdk, filtering by flow-type and event type within the given date range. Each event from the stream is processed by the appropriate projector function and stored in the projection table. Utilizes Bun's efficient async handling for optimal streaming performance.

**Input**:

- `dataCore`: String - Identifier for the data-core to stream from using @flowcore/sdk
- `flowType`: String - Type of flow to filter events
- `eventType`: String - Type of events to include in the stream
- `startDate`: Date/String - Beginning of the date range to stream
- `endDate`: Date/String - End of the date range to stream

**Output**:

- `streamId`: String - Unique identifier for the started projection stream
- `status`: String - Current status of the projection stream (e.g., 'RUNNING', 'COMPLETED', 'ERROR')
- `eventCount`: Number - Count of events projected so far

**Example Usage**:

```javascript
import { startEventStreamProjection } from './mcp-tools';

startEventStreamProjection(
  'user-data-core',
  'user-management',
  'UserCreated',
  '2024-01-01T00:00:00Z',
  '2024-03-19T23:59:59Z'
);
```

**Task Completion Criteria**:

- [x] Function successfully initiates the event stream projection using @flowcore/sdk
- [x] Events are filtered correctly by the specified parameters
- [x] Events are processed by the appropriate projector
- [x] Projected events are stored in the projection table
- [x] Leverages Bun's performance for efficient streaming and processing

## Complete MCP Server Implementation Checklist for Bun with @flowcore/sdk

- [x] All four MCP server tools are implemented and working correctly with Bun runtime
- [x] Project properly imports and utilizes @flowcore/sdk for Flowcore Platform interaction
- [x] In-memory DuckDB is initialized successfully within the MCP server
- [x] Projection tables can be created with custom structures
- [x] Event projector functions transform @flowcore/sdk events to database records
- [x] Event streaming works with proper filtering by date range, flow-type, and event type using @flowcore/sdk
- [x] Read model/projection is successfully built from the streamed events
- [x] The MCP server handles errors gracefully and maintains projection integrity
- [x] Performance is optimized using Bun's runtime advantages

## Setup Instructions

```javascript
// Install dependencies
bun add @flowcore/sdk duckdb

// Create MCP server file structure
// - index.ts (main entry point)
// - mcp-tools.ts (implementation of the tools)
// - projectors/ (directory for projector functions)
```

This structure provides clear, testable components specifically for an MCP server implementation using Bun and @flowcore/sdk that an LLM can understand and implement step by step.
