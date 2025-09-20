import { BaseClient } from "./base-client.js"
import type { PriceSchedule, PriceBreak, ListResponse } from "../../types/types.js"
import { DebugLogger } from "../utils/debug.js"

export class PriceScheduleClient extends BaseClient {
  
  // List price schedules with advanced filtering, searching, and sorting
  async listPriceSchedules(options?: {
    search?: string
    searchOn?: ("ID" | "Name")[]
    sortBy?: ("Name" | "ID" | "!Name" | "!ID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<PriceSchedule>> {
    this.ensureAuthenticated()

    DebugLogger.log("listPriceSchedules_start", options)

    const params: any = {}

    if (options?.search) {
      params.search = options.search
      DebugLogger.log("listPriceSchedules_param", { search: options.search })
    }
    if (options?.searchOn && options.searchOn.length > 0) {
      params.searchOn = options.searchOn.join(",")
      DebugLogger.log("listPriceSchedules_param", { searchOn: params.searchOn })
    }
    if (options?.sortBy && options.sortBy.length > 0) {
      params.sortBy = options.sortBy.join(",")
      DebugLogger.log("listPriceSchedules_param", { sortBy: params.sortBy })
    }
    if (options?.page) {
      params.page = options.page
      DebugLogger.log("listPriceSchedules_param", { page: options.page })
    }
    if (options?.pageSize) {
      params.pageSize = options.pageSize
      DebugLogger.log("listPriceSchedules_param", { pageSize: options.pageSize })
    }

    // filters are just key/value pairs
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
      DebugLogger.log("listPriceSchedules_param", { filters: options.filters })
    }

    DebugLogger.log("listPriceSchedules_final_params", params)

    try {
      const response = await this.client.get<ListResponse<PriceSchedule>>("v1/priceschedules", { params })
      DebugLogger.log("listPriceSchedules_success", options, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listPriceSchedules_error", options, undefined, error as Error)
      throw error
    }
  }

  // Get a specific price schedule by ID
  async getPriceSchedule(priceScheduleId: string): Promise<PriceSchedule> {
    this.ensureAuthenticated()
    
    DebugLogger.log("getPriceSchedule", { priceScheduleId })

    try {
      const response = await this.client.get<PriceSchedule>(`v1/priceschedules/${priceScheduleId}`)
      DebugLogger.log("getPriceSchedule_success", { priceScheduleId }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("getPriceSchedule_error", { priceScheduleId }, undefined, error as Error)
      throw error
    }
  }

  // Create a new price schedule
  async createPriceSchedule(priceSchedule: PriceSchedule): Promise<PriceSchedule> {
    this.ensureAuthenticated()
    
    DebugLogger.log("createPriceSchedule", { priceSchedule })

    try {
      const response = await this.client.post<PriceSchedule>("v1/priceschedules", priceSchedule)
      DebugLogger.log("createPriceSchedule_success", { priceSchedule }, response.data)
      return response.data
    } catch (error) {
      // Enhanced error logging with response details
      const errorDetails = {
        message: error instanceof Error ? error.message : String(error),
        response: (error as any)?.response ? {
          status: (error as any).response.status,
          statusText: (error as any).response.statusText,
          data: (error as any).response.data,
          headers: (error as any).response.headers
        } : undefined
      }
      DebugLogger.log("createPriceSchedule_error", { priceSchedule, errorDetails }, undefined, error as Error)
      throw error
    }
  }

  // Update an existing price schedule (PUT - full update)
  async updatePriceSchedule(priceScheduleId: string, priceSchedule: Partial<PriceSchedule>): Promise<PriceSchedule> {
    this.ensureAuthenticated()
    
    DebugLogger.log("updatePriceSchedule", { priceScheduleId, priceSchedule })

    try {
      const response = await this.client.put<PriceSchedule>(`v1/priceschedules/${priceScheduleId}`, priceSchedule)
      DebugLogger.log("updatePriceSchedule_success", { priceScheduleId, priceSchedule }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("updatePriceSchedule_error", { priceScheduleId, priceSchedule }, undefined, error as Error)
      throw error
    }
  }

  // Partially update a price schedule (PATCH - partial update)
  async patchPriceSchedule(priceScheduleId: string, priceSchedule: Partial<PriceSchedule>): Promise<PriceSchedule> {
    this.ensureAuthenticated()
    
    DebugLogger.log("patchPriceSchedule", { priceScheduleId, priceSchedule })

    try {
      const response = await this.client.patch<PriceSchedule>(`v1/priceschedules/${priceScheduleId}`, priceSchedule)
      DebugLogger.log("patchPriceSchedule_success", { priceScheduleId, priceSchedule }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("patchPriceSchedule_error", { priceScheduleId, priceSchedule }, undefined, error as Error)
      throw error
    }
  }

  // Delete a price schedule
  async deletePriceSchedule(priceScheduleId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deletePriceSchedule", { priceScheduleId })

    try {
      await this.client.delete(`v1/priceschedules/${priceScheduleId}`)
      DebugLogger.log("deletePriceSchedule_success", { priceScheduleId })
    } catch (error) {
      DebugLogger.log("deletePriceSchedule_error", { priceScheduleId }, undefined, error as Error)
      throw error
    }
  }

  // Create or update a price schedule price break
  async savePriceBreak(priceScheduleId: string, priceBreak: PriceBreak): Promise<PriceBreak> {
    this.ensureAuthenticated()
    
    DebugLogger.log("savePriceBreak", { priceScheduleId, priceBreak })

    try {
      const response = await this.client.post<PriceBreak>(`v1/priceschedules/${priceScheduleId}/PriceBreaks`, priceBreak)
      DebugLogger.log("savePriceBreak_success", { priceScheduleId, priceBreak }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("savePriceBreak_error", { priceScheduleId, priceBreak }, undefined, error as Error)
      throw error
    }
  }

  // Delete a price schedule price break
  async deletePriceBreak(priceScheduleId: string, quantity: number): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deletePriceBreak", { priceScheduleId, quantity })

    try {
      await this.client.delete(`v1/priceschedules/${priceScheduleId}/PriceBreaks`, {
        params: { quantity }
      })
      DebugLogger.log("deletePriceBreak_success", { priceScheduleId, quantity })
    } catch (error) {
      DebugLogger.log("deletePriceBreak_error", { priceScheduleId, quantity }, undefined, error as Error)
      throw error
    }
  }
}
