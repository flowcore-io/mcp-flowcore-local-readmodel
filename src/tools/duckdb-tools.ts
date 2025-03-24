import { createTableWithSQL, initializeDuckDB, queryDatabase } from "../duckdb"
import { createEventProjector } from "../duckdb/projector"
import { getAllStreams, getStreamInfo, startEventStreamProjection } from "../duckdb/stream"

// Initialize DuckDB handler
export const initializeDuckDBHandler = () =>
  ({ databaseFile }: { databaseFile?: string }) => {
    try {
      const result = initializeDuckDB(databaseFile)

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result),
        },
      ],
    }
  } catch (error) {
    const content = [
      {
        type: "text" as const,
        text: JSON.stringify(`Failed to initialize DuckDB with error: ${error}`),
      },
    ]

    return { isError: true, content }
  }
}

// Create Table With SQL handler
export const createProjectionTableHandler =
  () =>
  ({
    createTableSQL,
  }: {
    createTableSQL: string
  }) => {
    try {
      const result = createTableWithSQL(createTableSQL)

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
      }
    } catch (error) {
      const content = [
        {
          type: "text" as const,
          text: JSON.stringify(`Failed to create table with error: ${error}`),
        },
      ]

      return { isError: true, content }
    }
  }

// Create Event Projector handler
export const createEventProjectorHandler =
  () =>
  ({
    name,
    absoluteFilePath,
  }: {
    name: string
    absoluteFilePath: string
  }) => {
    try {
      const result = createEventProjector(name, absoluteFilePath)

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
      }
    } catch (error) {
      const content = [
        {
          type: "text" as const,
          text: JSON.stringify(`Failed to create event projector with error: ${error}`),
        },
      ]

      return { isError: true, content }
    }
  }

// Start Event Stream Projection handler
export const startEventStreamProjectionHandler =
  (getBearerToken: () => Promise<string>) =>
  async ({
    tenant,
    dataCoreId,
    flowTypeName,
    eventTypeName,
    startDate,
    endDate,
    projectorName,
    targetTable,
    maxParallelism,
  }: {
    tenant: string
    dataCoreId: string
    flowTypeName: string
    eventTypeName: string
    startDate: string
    endDate: string
    projectorName: string
    targetTable: string
    maxParallelism?: number
  }) => {
    try {
      const result = await startEventStreamProjection(
        getBearerToken,
        tenant,
        dataCoreId,
        flowTypeName,
        eventTypeName,
        startDate,
        endDate,
        projectorName,
        targetTable,
        maxParallelism,
      )

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
      }
    } catch (error) {
      const content = [
        {
          type: "text" as const,
          text: JSON.stringify(`Failed to start event stream projection with error: ${error}`),
        },
      ]

      return { isError: true, content }
    }
  }

// Query Database handler
export const queryDatabaseHandler =
  () =>
  ({ query }: { query: string }) => {
    try {
      const result = queryDatabase(query)

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
      }
    } catch (error) {
      const content = [
        {
          type: "text" as const,
          text: JSON.stringify(`Failed to query database with error: ${error}`),
        },
      ]

      return { isError: true, content }
    }
  }

// Get Stream Info handler
export const getStreamInfoHandler =
  () =>
  ({ streamId }: { streamId: string }) => {
    try {
      const result = getStreamInfo(streamId)

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
      }
    } catch (error) {
      const content = [
        {
          type: "text" as const,
          text: JSON.stringify(`Failed to get stream info with error: ${error}`),
        },
      ]

      return { isError: true, content }
    }
  }

// Get All Streams handler
export const getAllStreamsHandler = () => () => {
  try {
    const result = getAllStreams()

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(result),
        },
      ],
    }
  } catch (error) {
    const content = [
      {
        type: "text" as const,
        text: JSON.stringify(`Failed to get all streams with error: ${error}`),
      },
    ]

    return { isError: true, content }
  }
}
