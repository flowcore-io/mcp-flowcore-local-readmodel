# Flowcore Local Read Model MCP

This MCP (Model Context Protocol) server allows you to create and manage local read models using DuckDB, fed with events from the Flowcore Platform. It provides a set of tools to initialize a database, create tables, project events, and query the resulting data.

## Installation

```bash
npm install @flowcore/local-read-model-mcp
```

## Usage

To use this MCP, you need to provide either a username or a Personal Access Token (PAT) for authentication with the Flowcore Platform.

```bash
npx @flowcore/local-read-model-mcp --username <your-username>
# or
npx @flowcore/local-read-model-mcp --pat <your-pat>
```

## Environment Variables

| Variable | Type | Description | Default | Required |
|----------|------|-------------|----------|----------|
| USERNAME | string | Your Flowcore username | - | ✓ |
| PAT | string | Your Flowcore Personal Access Token | - | ✓ |

## Available Tools

### 1. Database Management

#### Initialize DuckDB

Initializes a DuckDB database for the read model. You can choose between in-memory or file-based storage.

```typescript
initialize_duckdb({
    file: "/path/to/database.db" // Optional, uses in-memory if not provided
})
```

#### Close DuckDB

Closes the database connection and stops any active event stream projections.

```typescript
close_duckdb()
```

### 2. Table Management

#### Create Projection Table

Creates a new table in the DuckDB database using SQL.

```typescript
create_projection_table({
    createTableSQL: `
        CREATE TABLE my_table (
            id INTEGER PRIMARY KEY,
            created_at TIMESTAMP NOT NULL,
            amount DECIMAL(10,2),
            status VARCHAR(50) DEFAULT 'pending'
        );
    `
})
```

### 3. Event Projection

#### Create Event Projector

Creates and registers a JavaScript function that transforms Flowcore events into database records.

```typescript
create_event_projector({
    name: "my_projector",
    absoluteFilePath: "/path/to/projector.cjs"
})
```

Example projector function (projector.cjs):

```javascript
function projectEvent(event) {
    return {
        id: event.id,
        timestamp: new Date(event.timestamp).toISOString(),
        amount: Number.parseFloat(event.amount).toFixed(2),
        status: String(event.status).toLowerCase()
    };
}

module.exports = projectEvent;
```

#### Start Event Stream Projection

Starts streaming events from Flowcore and projecting them to the database.

```typescript
start_event_stream_projection({
    tenant: "your-tenant",
    dataCore: "your-datacore",
    flowTypeName: "your-flow-type",
    eventTypeName: "your-event-type",
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-01-31T23:59:59Z",
    projectorName: "my_projector",
    targetTable: "my_table",
    maxParallelism: 100 // Optional, default is 100
})
```

#### Stop Event Stream Projection

Stops a specific event stream projection.

```typescript
stop_event_stream_projection({
    streamId: "stream-123"
})
```

### 4. Querying and Monitoring

#### Query Database

Execute SQL queries on the DuckDB database.

```typescript
query_database({
    query: "SELECT * FROM my_table WHERE status = 'pending' LIMIT 10;"
})
```

#### Get Stream Information

Get information about a specific event stream projection.

```typescript
get_stream_info({
    streamId: "stream-123"
})
```

#### Get All Streams

Get information about all active event stream projections.

```typescript
get_all_streams()
```

## Best Practices

### Table Creation

1. Use appropriate data types and formats:
   - TIMESTAMP: ISO 8601 format (YYYY-MM-DD HH:MM:SS.SSS)
   - DATE: ISO format (YYYY-MM-DD)
   - TIME: 24-hour format (HH:MM:SS.SSS)
   - DECIMAL/NUMERIC: Specify precision and scale
   - VARCHAR: Always specify length limit

2. Follow naming conventions:
   - Use lowercase for table and column names
   - Use snake_case naming convention
   - Include appropriate indexes
   - Consider partitioning for large tables

### Event Projectors

1. Handle data type conversions properly
2. Implement error handling for malformed input
3. Return null for unmappable fields
4. Use pure functions without side effects
5. Handle null/undefined values gracefully

## Example Workflow

Here's a complete example of setting up a local read model:

```typescript
// 1. Initialize the database
initialize_duckdb({ file: "my_read_model.db" })

// 2. Create a table
create_projection_table({
    createTableSQL: `
        CREATE TABLE events (
            event_id VARCHAR(100) PRIMARY KEY,
            timestamp TIMESTAMP NOT NULL,
            type VARCHAR(50),
            data JSON
        );
    `
})

// 3. Create and register a projector
create_event_projector({
    name: "event_projector",
    absoluteFilePath: "./projector.cjs"
})

// 4. Start streaming events
start_event_stream_projection({
    tenant: "my-tenant",
    dataCore: "my-datacore",
    flowTypeName: "my-flow",
    eventTypeName: "my-events",
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-01-31T23:59:59Z",
    projectorName: "event_projector",
    targetTable: "events"
})

// 5. Query the results
query_database({
    query: "SELECT * FROM events ORDER BY timestamp DESC LIMIT 10;"
})

// 6. Close the database when done
close_duckdb()
```

## License

[Add your license information here]
