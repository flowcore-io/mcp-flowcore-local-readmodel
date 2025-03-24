import { type Connection, Database } from "duckdb-async"

let db: Database | null = null
let connection: Connection | null = null

/**
 * Initializes an in-memory DuckDB database
 * @returns A reference to the initialized database
 */
export async function initializeDuckDB(
  file?: string,
): Promise<{ success: boolean; databaseInstance?: Database; error?: string }> {
  try {
    // Create a new DuckDB instance with a persistent database file or in-memory
    db = await Database.create(file || ":memory:")
    connection = await db.connect()

    // Verify connection is working
    await connection.exec("SELECT 1")

    return { success: true, databaseInstance: db }
  } catch (error) {
    return { success: false, error: `Failed to initialize DuckDB: ${error}` }
  }
}

export async function closeDuckDB() {
  if (db) {
    await db.close()
  }
}

/**
 * Creates a table in the DuckDB database using raw SQL
 * @param createTableSQL The SQL CREATE TABLE statement
 * @returns Object indicating success or failure
 */
export async function createTableWithSQL(createTableSQL: string): Promise<{ success: boolean; message: string }> {
  if (!db || !connection) {
    return {
      success: false,
      message: "Database not initialized. Call initializeDuckDB first.",
    }
  }

  try {
    await connection.exec(createTableSQL)
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
): Promise<{ success: boolean; message: string }> {
  if (!db || !connection) {
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

    await connection.exec(createTableSQL)

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
export async function insertRecordIntoTable(
  tableName: string,
  record: Record<string, unknown>,
): Promise<{ success: boolean; message: string }> {
  if (!db || !connection) {
    return {
      success: false,
      message: "Database not initialized. Call initializeDuckDB first.",
    }
  }

  try {
    const columnNames = Object.keys(record).join(", ")

    // Format values according to their type
    const formattedValues = Object.values(record)
      .map((value) => {
        if (value === null) {
          return "NULL"
        }

        if (typeof value === "string") {
          // Escape single quotes in strings
          return `'${String(value).replace(/'/g, "''")}'`
        }

        if (typeof value === "boolean") {
          return value ? "TRUE" : "FALSE"
        }

        if (value instanceof Date) {
          return `'${value.toISOString()}'`
        }

        return String(value)
      })
      .join(", ")

    const insertSQL = `INSERT INTO ${tableName} (${columnNames}) VALUES (${formattedValues})`

    await connection.exec(insertSQL)

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
export async function queryDatabase(
  query: string,
): Promise<{ success: boolean; message: string; results: unknown[] | null }> {
  if (!db || !connection) {
    return {
      success: false,
      message: "Database not initialized. Call initializeDuckDB first.",
      results: null,
    }
  }

  try {
    const rows = await connection.all(query)

    return {
      success: true,
      message: "Query executed successfully",
      results: rows,
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
  return db
}

/**
 * Returns the DuckDB connection
 * @returns The database connection or null if not initialized
 */
export function getDatabaseConnection() {
  return connection
}
