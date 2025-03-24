# Flowcore Local Read Model MCP Server

An MCP server for creating a locally hosted read model and feeding it with events from the Flowcore Platform. This implementation uses Bun runtime and @flowcore/sdk to stream events and project them to an in-memory DuckDB database.

## Features

- Initialize an in-memory DuckDB database
- Create tables using raw SQL
- Register event projector functions with custom names
- Stream events from Flowcore Platform, filtering by flow-type and event type
- Query the local read model with SQL

## Installation

```bash
# Install dependencies
bun install
```

## Usage

Run the MCP server:

```bash
bun run src/index.ts --username <your-username> --pat <your-personal-access-token>
```

The server communicates via stdin/stdout following the MCP protocol.

## Environment Variables

| Variable | Type | Description | Default | Required |
|----------|------|-------------|----------|----------|
| - | - | No environment variables required | - | |

## API

The MCP server exposes the following tools:

### Flowcore Platform Tools

- `get_tenant`: Get a tenant
- `list_tenants`: List all tenants you have access to
- `get_data_core`: Get a data core
- `get_flow_type`: Get a flow type
- `get_event_type`: Get an event type
- `get_event_type_info`: Get event information with examples
- `get_events`: Get events for an event type

### DuckDB Read Model Tools

- `initialize_duckdb`: Initialize the in-memory DuckDB database
- `create_projection_table`: Create a table in the database using raw DuckDB SQL syntax
- `create_event_projector`: Register a named projector function that transforms events to records
- `start_event_stream_projection`: Stream events from Flowcore and project them to the database
- `query_database`: Execute SQL queries on the local database
- `get_stream_info`: Get information about a specific event stream
- `get_all_streams`: Get information about all active event streams

## Building

Build the project for distribution:

```bash
bun run build
```

## Example Flow

```javascript
// 1. Initialize DuckDB
initialize_duckdb()

// 2. Create a table using DuckDB SQL
create_projection_table({
  createTableSQL: `
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      name VARCHAR NOT NULL,
      email VARCHAR,
      created_at TIMESTAMP
    )
  `
})

// 3. Register an event projector with a name
create_event_projector({
  name: "user-creator",
  projectionFunction: `(event) => {
    return {
      id: event.payload.userId,
      name: event.payload.userName,
      email: event.payload.userEmail,
      created_at: event.metadata.timestamp
    }
  }`
})

// 4. Start streaming events
start_event_stream_projection({
  dataCore: "my-data-core",
  flowType: "user-management",
  eventType: "UserCreated",
  startDate: "2024-01-01T00:00:00Z", 
  endDate: "2024-03-19T23:59:59Z",
  projectorName: "user-creator"
})

// 5. Query the local database
query_database({
  query: "SELECT * FROM users LIMIT 10"
})
```

## License

MIT
