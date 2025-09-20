import { BaseClient } from "./base-client.js"
import type { Promotion, ListResponse } from "../../types/types.js"
import { DebugLogger } from "../utils/debug.js"

export class PromotionClient extends BaseClient {
  
  // List promotions with advanced filtering, searching, and sorting
  async listPromotions(options?: {
    search?: string
    searchOn?: ("ID" | "Name" | "Code" | "Description" | "FinePrint" | "EligibleExpression" | "ValueExpression")[]
    sortBy?: ("Name" | "ID" | "Code" | "StartDate" | "ExpirationDate" | "EligibleExpression" | "ValueExpression" | "CanCombine" | "AutoApply" | "Active" | "Priority" | "!Name" | "!ID" | "!Code" | "!StartDate" | "!ExpirationDate" | "!EligibleExpression" | "!ValueExpression" | "!CanCombine" | "!AutoApply" | "!Active" | "!Priority")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<Promotion>> {
    this.ensureAuthenticated()

    DebugLogger.log("listPromotions_start", options)

    const params: any = {}

    if (options?.search) {
      params.search = options.search
      DebugLogger.log("listPromotions_param", { search: options.search })
    }
    if (options?.searchOn && options.searchOn.length > 0) {
      params.searchOn = options.searchOn.join(",")
      DebugLogger.log("listPromotions_param", { searchOn: params.searchOn })
    }
    if (options?.sortBy && options.sortBy.length > 0) {
      params.sortBy = options.sortBy.join(",")
      DebugLogger.log("listPromotions_param", { sortBy: params.sortBy })
    }
    if (options?.page) {
      params.page = options.page
      DebugLogger.log("listPromotions_param", { page: options.page })
    }
    if (options?.pageSize) {
      params.pageSize = options.pageSize
      DebugLogger.log("listPromotions_param", { pageSize: options.pageSize })
    }

    // filters are just key/value pairs
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
      DebugLogger.log("listPromotions_param", { filters: options.filters })
    }

    DebugLogger.log("listPromotions_final_params", params)

    try {
      const response = await this.client.get<ListResponse<Promotion>>("v1/promotions", { params })
      DebugLogger.log("listPromotions_success", options, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listPromotions_error", options, undefined, error as Error)
      throw error
    }
  }

  // Get a specific promotion by ID
  async getPromotion(promotionId: string): Promise<Promotion> {
    this.ensureAuthenticated()
    
    DebugLogger.log("getPromotion", { promotionId })

    try {
      const response = await this.client.get<Promotion>(`v1/promotions/${promotionId}`)
      DebugLogger.log("getPromotion_success", { promotionId }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("getPromotion_error", { promotionId }, undefined, error as Error)
      throw error
    }
  }

  // Create a new promotion
  async createPromotion(promotion: Promotion): Promise<Promotion> {
    this.ensureAuthenticated()
    
    DebugLogger.log("createPromotion", { promotion })

    try {
      const response = await this.client.post<Promotion>("v1/promotions", promotion)
      DebugLogger.log("createPromotion_success", { promotion }, response.data)
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
      DebugLogger.log("createPromotion_error", { promotion, errorDetails }, undefined, error as Error)
      throw error
    }
  }

  // Update an existing promotion
  async updatePromotion(promotionId: string, promotion: Partial<Promotion>): Promise<Promotion> {
    this.ensureAuthenticated()
    
    DebugLogger.log("updatePromotion", { promotionId, promotion })

    try {
      const response = await this.client.put<Promotion>(`v1/promotions/${promotionId}`, promotion)
      DebugLogger.log("updatePromotion_success", { promotionId, promotion }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("updatePromotion_error", { promotionId, promotion }, undefined, error as Error)
      throw error
    }
  }

  // Delete a promotion
  async deletePromotion(promotionId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deletePromotion", { promotionId })

    try {
      await this.client.delete(`v1/promotions/${promotionId}`)
      DebugLogger.log("deletePromotion_success", { promotionId })
    } catch (error) {
      DebugLogger.log("deletePromotion_error", { promotionId }, undefined, error as Error)
      throw error
    }
  }
}
