import { type DuckDBConnection, DuckDBInstance } from "@duckdb/node-api"

let instance: DuckDBInstance | null = null
let connection: DuckDBConnection | null = null

/**
 * Initializes an in-memory DuckDB database
 * @returns A reference to the initialized database
 */
export async function initializeDuckDB(databaseFile?: string) {
  if (instance !== null) {
    return { success: true, databaseInstance: instance }
  }

  try {
    // Create a new DuckDB instance with a persistent database file
    instance = await DuckDBInstance.create(databaseFile || ":memory:")
    connection = await instance.connect()

    return { success: true, databaseInstance: instance }
  } catch (error) {
    return { success: false, error: `Failed to initialize DuckDB: ${error}` }
  }
}

/**
 * Creates a table in the DuckDB database using raw SQL
 * @param createTableSQL The SQL CREATE TABLE statement
 * @returns Object indicating success or failure
 */
export async function createTableWithSQL(createTableSQL: string) {
  if (!instance || !connection) {
    return {
      success: false,
      message: "Database not initialized. Call initializeDuckDB first.",
    }
  }

  try {
    await connection.run(createTableSQL)

    return {
      success: true,
      message: "Table created successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to create table: ${error}`,
    }
  }
}

/**
 * Creates a projection table in the DuckDB database
 * @param tableName Name of the projection table to create
 * @param columns Array of column definitions
 * @returns Object indicating success or failure
 * @deprecated Use createTableWithSQL instead with direct SQL statements
 */
export async function createProjectionTable(
  tableName: string,
  columns: Array<{ name: string; type: string; constraints?: string }>,
) {
  if (!instance || !connection) {
    return {
      success: false,
      message: "Database not initialized. Call initializeDuckDB first.",
    }
  }

  try {
    // Construct SQL create table statement
    const columnsSQL = columns
      .map((col) => `${col.name} ${col.type}${col.constraints ? ` ${col.constraints}` : ""}`)
      .join(", ")

    const createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsSQL})`

    await connection.run(createTableSQL)

    return {
      success: true,
      message: `Projection table ${tableName} created successfully`,
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to create projection table ${tableName}: ${error}`,
    }
  }
}

/**
 * Inserts a record into a projection table
 * @param tableName Name of the projection table
 * @param record Record to insert
 * @returns Object indicating success or failure
 */
export async function insertRecordIntoTable(tableName: string, record: Record<string, unknown>) {
  if (!instance || !connection) {
    return {
      success: false,
      message: "Database not initialized. Call initializeDuckDB first.",
    }
  }

  try {
    const columnNames = Object.keys(record).join(", ")
    const placeholders = Object.keys(record)
      .map((_, index) => `$${index + 1}`)
      .join(", ")
    const values = Object.values(record)

    const insertSQL = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`

    try {
      const prepared = await connection.prepare(insertSQL)

      // Bind values based on their types
      values.forEach((value, index) => {
        const paramIndex = index + 1
        if (typeof value === "string") {
          prepared.bindVarchar(paramIndex, value)
        } else if (typeof value === "number") {
          if (Number.isInteger(value)) {
            prepared.bindInteger(paramIndex, value)
          } else {
            prepared.bindDouble(paramIndex, value)
          }
        } else if (typeof value === "boolean") {
          prepared.bindBoolean(paramIndex, value)
        } else if (value === null) {
          prepared.bindNull(paramIndex)
        } else if (typeof value === "bigint") {
          prepared.bindBigInt(paramIndex, value)
        } else {
          // For other types, convert to string
          prepared.bindVarchar(paramIndex, String(value))
        }
      })

      await prepared.run()
    } catch (error) {
      return {
        success: false,
        message: `Failed to insert record into ${tableName}: ${error}`,
      }
    }
    return {
      success: true,
      message: `Record inserted into ${tableName} successfully`,
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to insert record into ${tableName}: ${error}`,
    }
  }
}

/**
 * Performs a query on the database
 * @param query SQL query to execute
 * @returns Object with query results or error
 */
export async function queryDatabase(query: string) {
  if (!instance || !connection) {
    return {
      success: false,
      message: "Database not initialized. Call initializeDuckDB first.",
      results: null,
    }
  }

  try {
    const result = await connection.run(query)
    return {
      success: true,
      message: "Query executed successfully",
      results: result,
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to execute query: ${error}`,
      results: null,
    }
  }
}

/**
 * Returns the DuckDB instance
 * @returns The database instance or null if not initialized
 */
export function getDatabaseInstance() {
  return instance
}

/**
 * Returns the DuckDB connection
 * @returns The database connection or null if not initialized
 */
export function getDatabaseConnection() {
  return connection
}
