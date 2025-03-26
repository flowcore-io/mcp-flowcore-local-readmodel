import { closeDuckDB, createTableWithSQL, initializeDuckDB, queryDatabase } from "../duckdb"
import { createEventProjector } from "../duckdb/projector"
import {
  getAllStreams,
  getStreamInfo,
  startEventStreamProjection,
  stopAllEventStreamProjections,
  stopEventStreamProjection,
} from "../duckdb/stream"

// Initialize DuckDB handler
export const initializeDuckDBHandler =
  () =>
  async ({ file }: { file?: string }) => {
    try {
      const result = await initializeDuckDB(file)

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

export const closeDuckDBHandler = () => async () => {
  try {
    stopAllEventStreamProjections()
    await closeDuckDB()

    return {
      content: [{ type: "text" as const, text: "DuckDB closed successfully" }],
    }
  } catch (error) {
    const content = [{ type: "text" as const, text: `Failed to close DuckDB with error: ${error}` }]

    return { isError: true, content }
  }
}
// Create Table With SQL handler
export const createProjectionTableHandler =
  () =>
  async ({
    createTableSQL,
  }: {
    createTableSQL: string
  }) => {
    try {
      const result = await createTableWithSQL(createTableSQL)

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
  async ({
    name,
    absoluteFilePath,
  }: {
    name: string
    absoluteFilePath: string
  }) => {
    try {
      const result = await createEventProjector(name, absoluteFilePath)

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
    dataCore,
    flowTypeName,
    eventTypeNames,
    startDate,
    endDate,
    projectorName,
    targetTable,
    maxParallelism,
  }: {
    tenant: string
    dataCore: string
    flowTypeName: string
    eventTypeNames: string[]
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
        dataCore,
        flowTypeName,
        eventTypeNames,
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

export const stopEventStreamProjectionHandler =
  () =>
  ({ streamId }: { streamId: string }) => {
    try {
      stopEventStreamProjection(streamId)

      return {
        content: [{ type: "text" as const, text: "Event stream projection stopped successfully" }],
      }
    } catch (error) {
      const content = [{ type: "text" as const, text: `Failed to stop event stream projection with error: ${error}` }]

      return { isError: true, content }
    }
  }

// Query Database handler
export const queryDatabaseHandler =
  () =>
  async ({ query }: { query: string }) => {
    try {
      const result = await queryDatabase(query)

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
  async ({ streamId }: { streamId: string }) => {
    try {
      const result = await getStreamInfo(streamId)

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
