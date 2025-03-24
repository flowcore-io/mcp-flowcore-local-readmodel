import { FlowcoreDataPump } from "@flowcore/data-pump"
import { TimeUuid } from "@flowcore/time-uuid"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { projectEvent } from "./projector"

dayjs.extend(utc)

// Store active streams
const activeStreams: Record<string, StreamInfo> = {}

interface StreamInfo {
  id: string
  status: "INITIALIZING" | "RUNNING" | "COMPLETED" | "ERROR"
  eventCount: number
  tenant: string
  dataCore: string
  flowTypeName: string
  eventTypeName: string
  startDate: string
  endDate: string
  projectorName: string
  targetTable: string
  error?: string
  timeBuckets?: string[]
  currentTimeBucket?: string
  cursor?: string
  maxParallelism?: number
  processedTimeBuckets: number
  totalTimeBuckets: number
}

/**
 * Start streaming events from Flowcore and projecting them to the database
 * @param flowcoreClient Instance of FlowcoreClient
 * @param tenant Tenant name
 * @param dataCore name of the data core
 * @param flowTypeName Name of the flow type
 * @param eventTypeName Name of the event type
 * @param startDate Start date for event streaming
 * @param endDate End date for event streaming
 * @param projectorName Name of the projector to use
 * @param targetTable Name of the target table
 * @param maxParallelism Maximum number of time buckets to process in parallel
 * @returns Information about the started stream
 */
export async function startEventStreamProjection(
  getBearerToken: () => Promise<string>,
  tenant: string,
  dataCore: string,
  flowTypeName: string,
  eventTypeName: string,
  startDate: string,
  endDate: string,
  projectorName: string,
  targetTable: string,
  maxParallelism = 5, // Default to 5 parallel time bucket processes
) {
  const streamId = `stream-${Date.now()}`

  const streamInfo: StreamInfo = {
    id: streamId,
    status: "INITIALIZING",
    eventCount: 0,
    tenant,
    dataCore,
    flowTypeName,
    eventTypeName,
    startDate,
    endDate,
    projectorName,
    targetTable,
    maxParallelism,
    processedTimeBuckets: 0,
    totalTimeBuckets: 0,
  }

  activeStreams[streamId] = streamInfo

  // Start the actual streaming process in the background
  processEventStream(getBearerToken, streamId).catch((error) => {
    streamInfo.status = "ERROR"
    streamInfo.error = `${error}`
  })

  return {
    streamId,
    status: streamInfo.status,
    eventCount: streamInfo.eventCount,
  }
}

/**
 * Process events from Flowcore and project them to the database
 * @param flowcoreClient Instance of FlowcoreClient
 * @param streamId ID of the stream to process
 */
async function processEventStream(getBearerToken: () => Promise<string>, streamId: string) {
  const streamInfo = activeStreams[streamId]

  if (!streamInfo) {
    throw new Error(`Stream ${streamId} not found`)
  }

  try {
    streamInfo.status = "RUNNING"

    const startState = getState(streamInfo.startDate)
    const endState = getState(streamInfo.endDate)

    const dataPump = FlowcoreDataPump.create({
      auth: {
        getBearerToken: async () => await getBearerToken(),
      },
      stateManager: {
        getState: () => {
          return startState
        },
        setState: () => {},
      },
      dataSource: {
        tenant: streamInfo.tenant,
        dataCore: streamInfo.dataCore,
        flowType: streamInfo.flowTypeName,
        eventTypes: [streamInfo.eventTypeName],
      },
      processor: {
        concurrency: streamInfo.maxParallelism || 100,
        handler: async (events) => {
          const event = events[0]

          if (!event) {
            return
          }

          for (const event of events) {
            const projectionResult = await projectEvent(event, streamInfo.targetTable, streamInfo.projectorName)
            if (projectionResult.success) {
              streamInfo.eventCount++
            }
          }
        },
      },
      stopAt: endState?.date,
      bufferSize: 10_000,
      maxRedeliveryCount: 4,
      achknowledgeTimeoutMs: 10_000,
      logger: console,
    })

    await dataPump.start((error?: Error) => {
      if (error) {
        streamInfo.status = "ERROR"
        streamInfo.error = `${error}`
      } else {
        streamInfo.status = "COMPLETED"
      }
    })
  } catch (error) {
    streamInfo.status = "ERROR"
    streamInfo.error = `${error}`
    throw error
  }
}

function getState(dateString: string) {
  const date = dayjs(dateString)
  return {
    timeBucket: date.format("YYYYMMDDHH[0000]"),
    eventId: TimeUuid.fromDate(date.toDate()).toString(),
    date: date.toDate(),
  }
}

/**
 * Get information about a specific stream
 * @param streamId ID of the stream to get information for
 * @returns Stream information
 */
export function getStreamInfo(streamId: string) {
  const streamInfo = activeStreams[streamId]

  if (!streamInfo) {
    return { success: false, message: `Stream ${streamId} not found` }
  }

  return {
    success: true,
    stream: {
      id: streamInfo.id,
      status: streamInfo.status,
      eventCount: streamInfo.eventCount,
      dataCore: streamInfo.dataCore,
      flowTypeName: streamInfo.flowTypeName,
      eventTypeName: streamInfo.eventTypeName,
      startDate: streamInfo.startDate,
      endDate: streamInfo.endDate,
      projectorName: streamInfo.projectorName,
      targetTable: streamInfo.targetTable,
      error: streamInfo.error,
      currentTimeBucket: streamInfo.currentTimeBucket,
      processedTimeBuckets: streamInfo.processedTimeBuckets,
      totalTimeBuckets: streamInfo.totalTimeBuckets,
      maxParallelism: streamInfo.maxParallelism,
    },
  }
}

/**
 * Get information about all active streams
 * @returns Information about all active streams
 */
export function getAllStreams() {
  return Object.values(activeStreams).map((stream) => ({
    id: stream.id,
    status: stream.status,
    eventCount: stream.eventCount,
    dataCore: stream.dataCore,
    flowTypeName: stream.flowTypeName,
    eventTypeName: stream.eventTypeName,
    projectorName: stream.projectorName,
    targetTable: stream.targetTable,
    processedTimeBuckets: stream.processedTimeBuckets,
    totalTimeBuckets: stream.totalTimeBuckets,
  }))
}
