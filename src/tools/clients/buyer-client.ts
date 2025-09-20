import { BaseClient } from "./base-client.js"
import type { Buyer, ListResponse } from "../../types/types.js"
import { DebugLogger } from "../utils/debug.js"

export class BuyerClient extends BaseClient {
  
  // List buyers with advanced filtering, searching, and sorting
  async listBuyers(options?: {
    search?: string
    searchOn?: ("ID" | "Name")[]
    sortBy?: ("Name" | "ID" | "!Name" | "!ID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<Buyer>> {
    this.ensureAuthenticated()

    DebugLogger.log("listBuyers_start", options)

    const params: any = {}

    if (options?.search) {
      params.search = options.search
      DebugLogger.log("listBuyers_param", { search: options.search })
    }
    if (options?.searchOn && options.searchOn.length > 0) {
      params.searchOn = options.searchOn.join(",")
      DebugLogger.log("listBuyers_param", { searchOn: params.searchOn })
    }
    if (options?.sortBy && options.sortBy.length > 0) {
      params.sortBy = options.sortBy.join(",")
      DebugLogger.log("listBuyers_param", { sortBy: params.sortBy })
    }
    if (options?.page) {
      params.page = options.page
      DebugLogger.log("listBuyers_param", { page: options.page })
    }
    if (options?.pageSize) {
      params.pageSize = options.pageSize
      DebugLogger.log("listBuyers_param", { pageSize: options.pageSize })
    }

    // filters are just key/value pairs
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
      DebugLogger.log("listBuyers_param", { filters: options.filters })
    }

    DebugLogger.log("listBuyers_final_params", params)

    try {
      const response = await this.client.get<ListResponse<Buyer>>("v1/buyers", { params })
      DebugLogger.log("listBuyers_success", options, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listBuyers_error", options, undefined, error as Error)
      throw error
    }
  }

  // Get a specific buyer by ID
  async getBuyer(buyerId: string): Promise<Buyer> {
    this.ensureAuthenticated()
    
    DebugLogger.log("getBuyer", { buyerId })

    try {
      const response = await this.client.get<Buyer>(`v1/buyers/${buyerId}`)
      DebugLogger.log("getBuyer_success", { buyerId }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("getBuyer_error", { buyerId }, undefined, error as Error)
      throw error
    }
  }

  // Create a new buyer
  async createBuyer(buyer: Buyer): Promise<Buyer> {
    this.ensureAuthenticated()
    
    DebugLogger.log("createBuyer", { buyer })

    try {
      const response = await this.client.post<Buyer>("v1/buyers", buyer)
      DebugLogger.log("createBuyer_success", { buyer }, response.data)
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
      DebugLogger.log("createBuyer_error", { buyer, errorDetails }, undefined, error as Error)
      throw error
    }
  }

  // Update an existing buyer (PUT - full update)
  async updateBuyer(buyerId: string, buyer: Partial<Buyer>): Promise<Buyer> {
    this.ensureAuthenticated()
    
    DebugLogger.log("updateBuyer", { buyerId, buyer })

    try {
      const response = await this.client.put<Buyer>(`v1/buyers/${buyerId}`, buyer)
      DebugLogger.log("updateBuyer_success", { buyerId, buyer }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("updateBuyer_error", { buyerId, buyer }, undefined, error as Error)
      throw error
    }
  }

  // Partially update a buyer (PATCH - partial update)
  async patchBuyer(buyerId: string, buyer: Partial<Buyer>): Promise<Buyer> {
    this.ensureAuthenticated()
    
    DebugLogger.log("patchBuyer", { buyerId, buyer })

    try {
      const response = await this.client.patch<Buyer>(`v1/buyers/${buyerId}`, buyer)
      DebugLogger.log("patchBuyer_success", { buyerId, buyer }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("patchBuyer_error", { buyerId, buyer }, undefined, error as Error)
      throw error
    }
  }

  // Delete a buyer
  async deleteBuyer(buyerId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteBuyer", { buyerId })

    try {
      await this.client.delete(`v1/buyers/${buyerId}`)
      DebugLogger.log("deleteBuyer_success", { buyerId })
    } catch (error) {
      DebugLogger.log("deleteBuyer_error", { buyerId }, undefined, error as Error)
      throw error
    }
  }

  // List sellers this buyer can purchase from
  async listBuyerSellers(buyerId: string, options?: {
    search?: string
    searchOn?: ("ID" | "Name")[]
    sortBy?: ("Name" | "ID" | "!Name" | "!ID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<any>> {
    this.ensureAuthenticated()

    DebugLogger.log("listBuyerSellers_start", { buyerId, options })

    const params: any = {}

    if (options?.search) {
      params.search = options.search
      DebugLogger.log("listBuyerSellers_param", { search: options.search })
    }
    if (options?.searchOn && options.searchOn.length > 0) {
      params.searchOn = options.searchOn.join(",")
      DebugLogger.log("listBuyerSellers_param", { searchOn: params.searchOn })
    }
    if (options?.sortBy && options.sortBy.length > 0) {
      params.sortBy = options.sortBy.join(",")
      DebugLogger.log("listBuyerSellers_param", { sortBy: params.sortBy })
    }
    if (options?.page) {
      params.page = options.page
      DebugLogger.log("listBuyerSellers_param", { page: options.page })
    }
    if (options?.pageSize) {
      params.pageSize = options.pageSize
      DebugLogger.log("listBuyerSellers_param", { pageSize: options.pageSize })
    }

    // filters are just key/value pairs
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
      DebugLogger.log("listBuyerSellers_param", { filters: options.filters })
    }

    DebugLogger.log("listBuyerSellers_final_params", params)

    try {
      const response = await this.client.get<ListResponse<any>>(`v1/buyers/${buyerId}/sellers`, { params })
      DebugLogger.log("listBuyerSellers_success", { buyerId, options }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listBuyerSellers_error", { buyerId, options }, undefined, error as Error)
      throw error
    }
  }
}
