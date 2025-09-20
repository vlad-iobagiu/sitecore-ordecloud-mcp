import { BaseClient } from "./base-client.js"
import type { Supplier, ListResponse } from "../../types/types.js"
import { DebugLogger } from "../utils/debug.js"

export class SupplierClient extends BaseClient {
  
  // List suppliers with advanced filtering, searching, and sorting
  async listSuppliers(options?: {
    search?: string
    searchOn?: ("ID" | "Name")[]
    sortBy?: ("Name" | "ID" | "!Name" | "!ID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<Supplier>> {
    this.ensureAuthenticated()

    DebugLogger.log("listSuppliers_start", options)

    const params: any = {}

    if (options?.search) {
      params.search = options.search
      DebugLogger.log("listSuppliers_param", { search: options.search })
    }
    if (options?.searchOn && options.searchOn.length > 0) {
      params.searchOn = options.searchOn.join(",")
      DebugLogger.log("listSuppliers_param", { searchOn: params.searchOn })
    }
    if (options?.sortBy && options.sortBy.length > 0) {
      params.sortBy = options.sortBy.join(",")
      DebugLogger.log("listSuppliers_param", { sortBy: params.sortBy })
    }
    if (options?.page) {
      params.page = options.page
      DebugLogger.log("listSuppliers_param", { page: options.page })
    }
    if (options?.pageSize) {
      params.pageSize = options.pageSize
      DebugLogger.log("listSuppliers_param", { pageSize: options.pageSize })
    }

    // filters are just key/value pairs
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
      DebugLogger.log("listSuppliers_param", { filters: options.filters })
    }

    DebugLogger.log("listSuppliers_final_params", params)

    try {
      const response = await this.client.get<ListResponse<Supplier>>("v1/suppliers", { params })
      DebugLogger.log("listSuppliers_success", options, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listSuppliers_error", options, undefined, error as Error)
      throw error
    }
  }

  // Get a specific supplier by ID
  async getSupplier(supplierId: string): Promise<Supplier> {
    this.ensureAuthenticated()
    
    DebugLogger.log("getSupplier", { supplierId })

    try {
      const response = await this.client.get<Supplier>(`v1/suppliers/${supplierId}`)
      DebugLogger.log("getSupplier_success", { supplierId }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("getSupplier_error", { supplierId }, undefined, error as Error)
      throw error
    }
  }

  // Create a new supplier
  async createSupplier(supplier: Supplier): Promise<Supplier> {
    this.ensureAuthenticated()
    
    DebugLogger.log("createSupplier", { supplier })

    try {
      const response = await this.client.post<Supplier>("v1/suppliers", supplier)
      DebugLogger.log("createSupplier_success", { supplier }, response.data)
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
      DebugLogger.log("createSupplier_error", { supplier, errorDetails }, undefined, error as Error)
      throw error
    }
  }

  // Update an existing supplier (PUT - full update)
  async updateSupplier(supplierId: string, supplier: Partial<Supplier>): Promise<Supplier> {
    this.ensureAuthenticated()
    
    DebugLogger.log("updateSupplier", { supplierId, supplier })

    try {
      const response = await this.client.put<Supplier>(`v1/suppliers/${supplierId}`, supplier)
      DebugLogger.log("updateSupplier_success", { supplierId, supplier }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("updateSupplier_error", { supplierId, supplier }, undefined, error as Error)
      throw error
    }
  }

  // Partially update a supplier (PATCH - partial update)
  async patchSupplier(supplierId: string, supplier: Partial<Supplier>): Promise<Supplier> {
    this.ensureAuthenticated()
    
    DebugLogger.log("patchSupplier", { supplierId, supplier })

    try {
      const response = await this.client.patch<Supplier>(`v1/suppliers/${supplierId}`, supplier)
      DebugLogger.log("patchSupplier_success", { supplierId, supplier }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("patchSupplier_error", { supplierId, supplier }, undefined, error as Error)
      throw error
    }
  }

  // Delete a supplier
  async deleteSupplier(supplierId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteSupplier", { supplierId })

    try {
      await this.client.delete(`v1/suppliers/${supplierId}`)
      DebugLogger.log("deleteSupplier_success", { supplierId })
    } catch (error) {
      DebugLogger.log("deleteSupplier_error", { supplierId }, undefined, error as Error)
      throw error
    }
  }

  // List supplier buyers
  async listSupplierBuyers(supplierId: string, options?: {
    search?: string
    searchOn?: ("ID" | "Name")[]
    sortBy?: ("Name" | "ID" | "!Name" | "!ID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<any>> {
    this.ensureAuthenticated()

    DebugLogger.log("listSupplierBuyers_start", { supplierId, options })

    const params: any = {}

    if (options?.search) {
      params.search = options.search
      DebugLogger.log("listSupplierBuyers_param", { search: options.search })
    }
    if (options?.searchOn && options.searchOn.length > 0) {
      params.searchOn = options.searchOn.join(",")
      DebugLogger.log("listSupplierBuyers_param", { searchOn: params.searchOn })
    }
    if (options?.sortBy && options.sortBy.length > 0) {
      params.sortBy = options.sortBy.join(",")
      DebugLogger.log("listSupplierBuyers_param", { sortBy: params.sortBy })
    }
    if (options?.page) {
      params.page = options.page
      DebugLogger.log("listSupplierBuyers_param", { page: options.page })
    }
    if (options?.pageSize) {
      params.pageSize = options.pageSize
      DebugLogger.log("listSupplierBuyers_param", { pageSize: options.pageSize })
    }

    // filters are just key/value pairs
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
      DebugLogger.log("listSupplierBuyers_param", { filters: options.filters })
    }

    DebugLogger.log("listSupplierBuyers_final_params", params)

    try {
      const response = await this.client.get<ListResponse<any>>(`v1/suppliers/${supplierId}/buyers`, { params })
      DebugLogger.log("listSupplierBuyers_success", { supplierId, options }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listSupplierBuyers_error", { supplierId, options }, undefined, error as Error)
      throw error
    }
  }

  // Create or update a supplier buyer
  async saveSupplierBuyer(supplierId: string, buyerId: string, buyerData: any): Promise<any> {
    this.ensureAuthenticated()
    
    DebugLogger.log("saveSupplierBuyer", { supplierId, buyerId, buyerData })

    try {
      const response = await this.client.put<any>(`v1/suppliers/${supplierId}/buyers/${buyerId}`, buyerData)
      DebugLogger.log("saveSupplierBuyer_success", { supplierId, buyerId, buyerData }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("saveSupplierBuyer_error", { supplierId, buyerId, buyerData }, undefined, error as Error)
      throw error
    }
  }

  // Delete a supplier buyer
  async deleteSupplierBuyer(supplierId: string, buyerId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteSupplierBuyer", { supplierId, buyerId })

    try {
      await this.client.delete(`v1/suppliers/${supplierId}/buyers/${buyerId}`)
      DebugLogger.log("deleteSupplierBuyer_success", { supplierId, buyerId })
    } catch (error) {
      DebugLogger.log("deleteSupplierBuyer_error", { supplierId, buyerId }, undefined, error as Error)
      throw error
    }
  }
}

