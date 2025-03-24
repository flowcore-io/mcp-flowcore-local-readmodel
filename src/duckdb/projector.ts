import type { FlowcoreEvent } from "@flowcore/sdk"
import { insertRecordIntoTable } from "./index"

// Store projector functions by name
const projectors: Record<string, ProjectorInfo> = {}

// Type definition for a projection function
export type ProjectionFunction = (event: FlowcoreEvent) => Record<string, unknown>

// Type definition for any function that could work as a projector
export type GenericProjectionFunction = (event: Record<string, unknown>) => Record<string, unknown>

// Type to store projector information
interface ProjectorInfo {
  name: string
  function: ProjectionFunction
}

/**
 * Creates and registers an event projector function
 * @param name The unique name of the projector
 * @param projectionFunction Function that converts an event to a database record
 * @returns Information about the registered projector
 */
export async function createEventProjector(name: string, absoluteFilePath: string) {
  // Create a unique ID for the projector
  const projectorId = `${name}-${Date.now()}`

  const projectorFunction = await import(absoluteFilePath)

  // Store the projector info
  projectors[name] = {
    name,
    function: projectorFunction.default as ProjectionFunction,
  }

  return {
    success: true,
    projectorId,
    name,
  }
}

/**
 * Gets a projector by name
 * @param name The name of the projector
 * @returns The projector or undefined if not found
 */
export function getProjectorByName(name: string): ProjectorInfo | undefined {
  return projectors[name]
}

/**
 * Processes a Flowcore event through the specified projector
 * @param event The Flowcore event to process
 * @param targetTable Optional table to insert the projected record into
 * @param projectorName Name of the projector to use
 * @returns Result of the projection operation
 */
export async function projectEvent(event: FlowcoreEvent, targetTable?: string, projectorName?: string) {
  if (!projectorName) {
    return {
      success: false,
      message: "Projector name is required",
      targetTable,
    }
  }

  // Find the appropriate projector
  const projector = getProjectorByName(projectorName)

  if (!projector) {
    return {
      success: false,
      message: `No projector found with name ${projectorName}`,
      targetTable,
    }
  }

  try {
    // Transform the event to a database record
    const record = projector.function(event)

    // Only insert if a target table is provided
    if (targetTable) {
      // Insert the record into the database
      const result = await insertRecordIntoTable(targetTable, record)

      return {
        success: result.success,
        message: result.message,
        projectorName: projector.name,
        targetTable,
        record,
      }
    }

    // Otherwise just return the projected record
    return {
      success: true,
      message: "Event projected successfully (no table insertion)",
      projectorName: projector.name,
      record,
    }
  } catch (error) {
    return {
      success: false,
      message: `Error projecting event with projector ${projectorName}: ${error}`,
      projectorName: projector.name,
    }
  }
}

/**
 * Returns all registered projectors
 * @returns Object containing all registered projectors
 */
export function getAllProjectors() {
  return projectors
}
