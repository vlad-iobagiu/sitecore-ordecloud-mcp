import { BaseClient } from "./base-client.js"
import type { Catalog, CatalogAssignment, CatalogBundleAssignment, CatalogProductAssignment, ListResponse } from "../../types/types.js"
import { DebugLogger } from "../utils/debug.js"

export class CatalogClient extends BaseClient {
  
  // List catalogs with advanced filtering, searching, and sorting
  async listCatalogs(options?: {
    search?: string
    searchOn?: ("ID" | "Name")[]
    sortBy?: ("Name" | "ID" | "!Name" | "!ID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<Catalog>> {
    this.ensureAuthenticated()

    DebugLogger.log("listCatalogs_start", options)

    const params: any = {}

    if (options?.search) {
      params.search = options.search
      DebugLogger.log("listCatalogs_param", { search: options.search })
    }
    if (options?.searchOn && options.searchOn.length > 0) {
      params.searchOn = options.searchOn.join(",")
      DebugLogger.log("listCatalogs_param", { searchOn: params.searchOn })
    }
    if (options?.sortBy && options.sortBy.length > 0) {
      params.sortBy = options.sortBy.join(",")
      DebugLogger.log("listCatalogs_param", { sortBy: params.sortBy })
    }
    if (options?.page) {
      params.page = options.page
      DebugLogger.log("listCatalogs_param", { page: options.page })
    }
    if (options?.pageSize) {
      params.pageSize = options.pageSize
      DebugLogger.log("listCatalogs_param", { pageSize: options.pageSize })
    }

    // filters are just key/value pairs
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
      DebugLogger.log("listCatalogs_param", { filters: options.filters })
    }

    DebugLogger.log("listCatalogs_final_params", params)

    try {
      const response = await this.client.get<ListResponse<Catalog>>("v1/catalogs", { params })
      DebugLogger.log("listCatalogs_success", options, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listCatalogs_error", options, undefined, error as Error)
      throw error
    }
  }

  // Legacy method for backward compatibility
  async list(page = 1, pageSize = 20): Promise<ListResponse<Catalog>> {
    return this.listCatalogs({ page, pageSize })
  }

  async get(id: string): Promise<Catalog> {
    this.ensureAuthenticated()
    
    DebugLogger.log("getCatalog", { id })

    try {
      const response = await this.client.get<Catalog>(`v1/catalogs/${id}`)
      DebugLogger.log("getCatalog_success", { id }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("getCatalog_error", { id }, undefined, error as Error)
      throw error
    }
  }

  async create(catalog: Catalog): Promise<Catalog> {
    this.ensureAuthenticated()
    
    DebugLogger.log("createCatalog", { catalog })

    try {
      const response = await this.client.post<Catalog>("v1/catalogs", catalog)
      DebugLogger.log("createCatalog_success", { catalog }, response.data)
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
      DebugLogger.log("createCatalog_error", { catalog, errorDetails }, undefined, error as Error)
      throw error
    }
  }

  async update(id: string, catalog: Partial<Catalog>): Promise<Catalog> {
    this.ensureAuthenticated()
    
    DebugLogger.log("updateCatalog", { id, catalog })

    try {
      const response = await this.client.put<Catalog>(`v1/catalogs/${id}`, catalog)
      DebugLogger.log("updateCatalog_success", { id, catalog }, response.data)
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
      DebugLogger.log("updateCatalog_error", { id, catalog, errorDetails }, undefined, error as Error)
      throw error
    }
  }

  async patch(id: string, catalog: Partial<Catalog>): Promise<Catalog> {
    this.ensureAuthenticated()
    
    DebugLogger.log("patchCatalog", { id, catalog })

    try {
      const response = await this.client.patch<Catalog>(`v1/catalogs/${id}`, catalog)
      DebugLogger.log("patchCatalog_success", { id, catalog }, response.data)
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
      DebugLogger.log("patchCatalog_error", { id, catalog, errorDetails }, undefined, error as Error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteCatalog", { id })

    try {
      await this.client.delete(`v1/catalogs/${id}`)
      DebugLogger.log("deleteCatalog_success", { id })
    } catch (error) {
      DebugLogger.log("deleteCatalog_error", { id }, undefined, error as Error)
      throw error
    }
  }

  // Catalog Assignment methods
  async listCatalogAssignments(options?: {
    search?: string
    searchOn?: ("CatalogID" | "BuyerID" | "UserGroupID" | "UserID")[]
    sortBy?: ("CatalogID" | "BuyerID" | "UserGroupID" | "UserID" | "!CatalogID" | "!BuyerID" | "!UserGroupID" | "!UserID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<CatalogAssignment>> {
    this.ensureAuthenticated()

    DebugLogger.log("listCatalogAssignments_start", options)

    const params: any = {}

    if (options?.search) {
      params.search = options.search
    }
    if (options?.searchOn && options.searchOn.length > 0) {
      params.searchOn = options.searchOn.join(",")
    }
    if (options?.sortBy && options.sortBy.length > 0) {
      params.sortBy = options.sortBy.join(",")
    }
    if (options?.page) {
      params.page = options.page
    }
    if (options?.pageSize) {
      params.pageSize = options.pageSize
    }

    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
    }

    try {
      const response = await this.client.get<ListResponse<CatalogAssignment>>("v1/catalogs/assignments", { params })
      DebugLogger.log("listCatalogAssignments_success", options, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listCatalogAssignments_error", options, undefined, error as Error)
      throw error
    }
  }

  async saveCatalogAssignment(assignment: CatalogAssignment): Promise<CatalogAssignment> {
    this.ensureAuthenticated()
    
    DebugLogger.log("saveCatalogAssignment", { assignment })

    try {
      const response = await this.client.post<CatalogAssignment>("v1/catalogs/assignments", assignment)
      DebugLogger.log("saveCatalogAssignment_success", { assignment }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("saveCatalogAssignment_error", { assignment }, undefined, error as Error)
      throw error
    }
  }

  async deleteCatalogAssignment(catalogId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteCatalogAssignment", { catalogId })

    try {
      await this.client.delete(`v1/catalogs/${catalogId}/assignments`)
      DebugLogger.log("deleteCatalogAssignment_success", { catalogId })
    } catch (error) {
      DebugLogger.log("deleteCatalogAssignment_error", { catalogId }, undefined, error as Error)
      throw error
    }
  }

  // Catalog Bundle Assignment methods
  async listCatalogBundleAssignments(options?: {
    search?: string
    searchOn?: ("CatalogID" | "BundleID")[]
    sortBy?: ("CatalogID" | "BundleID" | "!CatalogID" | "!BundleID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<CatalogBundleAssignment>> {
    this.ensureAuthenticated()

    DebugLogger.log("listCatalogBundleAssignments_start", options)

    const params: any = {}

    if (options?.search) {
      params.search = options.search
    }
    if (options?.searchOn && options.searchOn.length > 0) {
      params.searchOn = options.searchOn.join(",")
    }
    if (options?.sortBy && options.sortBy.length > 0) {
      params.sortBy = options.sortBy.join(",")
    }
    if (options?.page) {
      params.page = options.page
    }
    if (options?.pageSize) {
      params.pageSize = options.pageSize
    }

    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
    }

    try {
      const response = await this.client.get<ListResponse<CatalogBundleAssignment>>("v1/catalogs/bundleassignments", { params })
      DebugLogger.log("listCatalogBundleAssignments_success", options, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listCatalogBundleAssignments_error", options, undefined, error as Error)
      throw error
    }
  }

  async saveCatalogBundleAssignment(assignment: CatalogBundleAssignment): Promise<CatalogBundleAssignment> {
    this.ensureAuthenticated()
    
    DebugLogger.log("saveCatalogBundleAssignment", { assignment })

    try {
      const response = await this.client.post<CatalogBundleAssignment>("v1/catalogs/bundleassignments", assignment)
      DebugLogger.log("saveCatalogBundleAssignment_success", { assignment }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("saveCatalogBundleAssignment_error", { assignment }, undefined, error as Error)
      throw error
    }
  }

  async deleteCatalogBundleAssignment(catalogId: string, bundleId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteCatalogBundleAssignment", { catalogId, bundleId })

    try {
      await this.client.delete(`v1/catalogs/${catalogId}/bundleassignments/${bundleId}`)
      DebugLogger.log("deleteCatalogBundleAssignment_success", { catalogId, bundleId })
    } catch (error) {
      DebugLogger.log("deleteCatalogBundleAssignment_error", { catalogId, bundleId }, undefined, error as Error)
      throw error
    }
  }

  // Catalog Product Assignment methods
  async listCatalogProductAssignments(options?: {
    search?: string
    searchOn?: ("CatalogID" | "ProductID")[]
    sortBy?: ("CatalogID" | "ProductID" | "!CatalogID" | "!ProductID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<CatalogProductAssignment>> {
    this.ensureAuthenticated()

    DebugLogger.log("listCatalogProductAssignments_start", options)

    const params: any = {}

    if (options?.search) {
      params.search = options.search
    }
    if (options?.searchOn && options.searchOn.length > 0) {
      params.searchOn = options.searchOn.join(",")
    }
    if (options?.sortBy && options.sortBy.length > 0) {
      params.sortBy = options.sortBy.join(",")
    }
    if (options?.page) {
      params.page = options.page
    }
    if (options?.pageSize) {
      params.pageSize = options.pageSize
    }

    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
    }

    try {
      const response = await this.client.get<ListResponse<CatalogProductAssignment>>("v1/catalogs/productassignments", { params })
      DebugLogger.log("listCatalogProductAssignments_success", options, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listCatalogProductAssignments_error", options, undefined, error as Error)
      throw error
    }
  }

  async saveCatalogProductAssignment(assignment: CatalogProductAssignment): Promise<CatalogProductAssignment> {
    this.ensureAuthenticated()
    
    DebugLogger.log("saveCatalogProductAssignment", { assignment })

    try {
      const response = await this.client.post<CatalogProductAssignment>("v1/catalogs/productassignments", assignment)
      DebugLogger.log("saveCatalogProductAssignment_success", { assignment }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("saveCatalogProductAssignment_error", { assignment }, undefined, error as Error)
      throw error
    }
  }

  async deleteCatalogProductAssignment(catalogId: string, productId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteCatalogProductAssignment", { catalogId, productId })

    try {
      await this.client.delete(`v1/catalogs/${catalogId}/productassignments/${productId}`)
      DebugLogger.log("deleteCatalogProductAssignment_success", { catalogId, productId })
    } catch (error) {
      DebugLogger.log("deleteCatalogProductAssignment_error", { catalogId, productId }, undefined, error as Error)
      throw error
    }
  }
}
