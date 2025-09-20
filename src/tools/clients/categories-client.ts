import { BaseClient } from "./base-client.js"
import type { Category, CategoryAssignment, CategoryBundleAssignment, CategoryProductAssignment, ListResponse } from "../../types/types.js"
import { DebugLogger } from "../utils/debug.js"

export class CategoryClient extends BaseClient {
  
  // List categories with advanced filtering, searching, and sorting
  async listCategories(catalogId: string, options?: {
    search?: string
    searchOn?: ("ID" | "Name")[]
    sortBy?: ("Name" | "ID" | "!Name" | "!ID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<Category>> {
    this.ensureAuthenticated()

    DebugLogger.log("listCategories_start", { catalogId, options })

    const params: any = {}

    if (options?.search) {
      params.search = options.search
      DebugLogger.log("listCategories_param", { search: options.search })
    }
    if (options?.searchOn && options.searchOn.length > 0) {
      params.searchOn = options.searchOn.join(",")
      DebugLogger.log("listCategories_param", { searchOn: params.searchOn })
    }
    if (options?.sortBy && options.sortBy.length > 0) {
      params.sortBy = options.sortBy.join(",")
      DebugLogger.log("listCategories_param", { sortBy: params.sortBy })
    }
    if (options?.page) {
      params.page = options.page
      DebugLogger.log("listCategories_param", { page: options.page })
    }
    if (options?.pageSize) {
      params.pageSize = options.pageSize
      DebugLogger.log("listCategories_param", { pageSize: options.pageSize })
    }

    // filters are just key/value pairs
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
      DebugLogger.log("listCategories_param", { filters: options.filters })
    }

    DebugLogger.log("listCategories_final_params", params)

    try {
      const response = await this.client.get<ListResponse<Category>>(`v1/catalogs/${catalogId}/categories`, { params })
      DebugLogger.log("listCategories_success", { catalogId, options }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listCategories_error", { catalogId, options }, undefined, error as Error)
      throw error
    }
  }

  // Legacy method for backward compatibility
  async getCategories(catalogId: string, page = 1, pageSize = 20): Promise<ListResponse<Category>> {
    return this.listCategories(catalogId, { page, pageSize })
  }
    
  async getCategory(catalogId: string, categoryId: string): Promise<Category> {
    this.ensureAuthenticated()
    
    DebugLogger.log("getCategory", { catalogId, categoryId })

    try {
      const response = await this.client.get<Category>(`v1/catalogs/${catalogId}/categories/${categoryId}`)
      DebugLogger.log("getCategory_success", { catalogId, categoryId }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("getCategory_error", { catalogId, categoryId }, undefined, error as Error)
      throw error
    }
  }
    
  async createCategory(catalogId: string, category: Category, adjustListOrders?: boolean): Promise<Category> {
    this.ensureAuthenticated()
    
    DebugLogger.log("createCategory", { catalogId, category, adjustListOrders })

    const params = adjustListOrders ? { adjustListOrders: true } : {}

    try {
      const response = await this.client.post<Category>(`v1/catalogs/${catalogId}/categories`, category, { params })
      DebugLogger.log("createCategory_success", { catalogId, category, adjustListOrders }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("createCategory_error", { catalogId, category, adjustListOrders }, undefined, error as Error)
      throw error
    }
  }
    
  async updateCategory(catalogId: string, categoryId: string, category: Partial<Category>, adjustListOrders?: boolean): Promise<Category> {
    this.ensureAuthenticated()
    
    DebugLogger.log("updateCategory", { catalogId, categoryId, category, adjustListOrders })

    const params = adjustListOrders ? { adjustListOrders: true } : {}

    try {
      const response = await this.client.put<Category>(`v1/catalogs/${catalogId}/categories/${categoryId}`, category, { params })
      DebugLogger.log("updateCategory_success", { catalogId, categoryId, category, adjustListOrders }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("updateCategory_error", { catalogId, categoryId, category, adjustListOrders }, undefined, error as Error)
      throw error
    }
  }

  async patchCategory(catalogId: string, categoryId: string, category: Partial<Category>, adjustListOrders?: boolean): Promise<Category> {
    this.ensureAuthenticated()
    
    DebugLogger.log("patchCategory", { catalogId, categoryId, category, adjustListOrders })

    const params = adjustListOrders ? { adjustListOrders: true } : {}

    try {
      const response = await this.client.patch<Category>(`v1/catalogs/${catalogId}/categories/${categoryId}`, category, { params })
      DebugLogger.log("patchCategory_success", { catalogId, categoryId, category, adjustListOrders }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("patchCategory_error", { catalogId, categoryId, category, adjustListOrders }, undefined, error as Error)
      throw error
    }
  }
    
  async deleteCategory(catalogId: string, categoryId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteCategory", { catalogId, categoryId })

    try {
      await this.client.delete(`v1/catalogs/${catalogId}/categories/${categoryId}`)
      DebugLogger.log("deleteCategory_success", { catalogId, categoryId })
    } catch (error) {
      DebugLogger.log("deleteCategory_error", { catalogId, categoryId }, undefined, error as Error)
      throw error
    }
  }

  // Category Assignment methods
  async listCategoryAssignments(catalogId: string, options?: {
    search?: string
    searchOn?: ("CategoryID" | "BuyerID" | "UserGroupID" | "UserID")[]
    sortBy?: ("CategoryID" | "BuyerID" | "UserGroupID" | "UserID" | "!CategoryID" | "!BuyerID" | "!UserGroupID" | "!UserID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<CategoryAssignment>> {
    this.ensureAuthenticated()

    DebugLogger.log("listCategoryAssignments_start", { catalogId, options })

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
      const response = await this.client.get<ListResponse<CategoryAssignment>>(`v1/catalogs/${catalogId}/categories/assignments`, { params })
      DebugLogger.log("listCategoryAssignments_success", { catalogId, options }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listCategoryAssignments_error", { catalogId, options }, undefined, error as Error)
      throw error
    }
  }

  async saveCategoryAssignment(catalogId: string, assignment: CategoryAssignment): Promise<CategoryAssignment> {
    this.ensureAuthenticated()
    
    DebugLogger.log("saveCategoryAssignment", { catalogId, assignment })

    try {
      const response = await this.client.post<CategoryAssignment>(`v1/catalogs/${catalogId}/categories/assignments`, assignment)
      DebugLogger.log("saveCategoryAssignment_success", { catalogId, assignment }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("saveCategoryAssignment_error", { catalogId, assignment }, undefined, error as Error)
      throw error
    }
  }

  async deleteCategoryAssignment(catalogId: string, categoryId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteCategoryAssignment", { catalogId, categoryId })

    try {
      await this.client.delete(`v1/catalogs/${catalogId}/categories/${categoryId}/assignments`)
      DebugLogger.log("deleteCategoryAssignment_success", { catalogId, categoryId })
    } catch (error) {
      DebugLogger.log("deleteCategoryAssignment_error", { catalogId, categoryId }, undefined, error as Error)
      throw error
    }
  }

  // Category Bundle Assignment methods
  async listCategoryBundleAssignments(catalogId: string, options?: {
    search?: string
    searchOn?: ("CategoryID" | "BundleID")[]
    sortBy?: ("CategoryID" | "BundleID" | "!CategoryID" | "!BundleID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<CategoryBundleAssignment>> {
    this.ensureAuthenticated()

    DebugLogger.log("listCategoryBundleAssignments_start", { catalogId, options })

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
      const response = await this.client.get<ListResponse<CategoryBundleAssignment>>(`v1/catalogs/${catalogId}/categories/bundleassignments`, { params })
      DebugLogger.log("listCategoryBundleAssignments_success", { catalogId, options }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listCategoryBundleAssignments_error", { catalogId, options }, undefined, error as Error)
      throw error
    }
  }

  async saveCategoryBundleAssignment(catalogId: string, assignment: CategoryBundleAssignment): Promise<CategoryBundleAssignment> {
    this.ensureAuthenticated()
    
    DebugLogger.log("saveCategoryBundleAssignment", { catalogId, assignment })

    try {
      const response = await this.client.post<CategoryBundleAssignment>(`v1/catalogs/${catalogId}/categories/bundleassignments`, assignment)
      DebugLogger.log("saveCategoryBundleAssignment_success", { catalogId, assignment }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("saveCategoryBundleAssignment_error", { catalogId, assignment }, undefined, error as Error)
      throw error
    }
  }

  async deleteCategoryBundleAssignment(catalogId: string, categoryId: string, bundleId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteCategoryBundleAssignment", { catalogId, categoryId, bundleId })

    try {
      await this.client.delete(`v1/catalogs/${catalogId}/categories/${categoryId}/bundleassignments/${bundleId}`)
      DebugLogger.log("deleteCategoryBundleAssignment_success", { catalogId, categoryId, bundleId })
    } catch (error) {
      DebugLogger.log("deleteCategoryBundleAssignment_error", { catalogId, categoryId, bundleId }, undefined, error as Error)
      throw error
    }
  }

  // Category Product Assignment methods
  async listCategoryProductAssignments(catalogId: string, options?: {
    search?: string
    searchOn?: ("CategoryID" | "ProductID")[]
    sortBy?: ("CategoryID" | "ProductID" | "!CategoryID" | "!ProductID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<CategoryProductAssignment>> {
    this.ensureAuthenticated()

    DebugLogger.log("listCategoryProductAssignments_start", { catalogId, options })

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
      const response = await this.client.get<ListResponse<CategoryProductAssignment>>(`v1/catalogs/${catalogId}/categories/productassignments`, { params })
      DebugLogger.log("listCategoryProductAssignments_success", { catalogId, options }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listCategoryProductAssignments_error", { catalogId, options }, undefined, error as Error)
      throw error
    }
  }

  async saveCategoryProductAssignment(catalogId: string, assignment: CategoryProductAssignment): Promise<CategoryProductAssignment> {
    this.ensureAuthenticated()
    
    DebugLogger.log("saveCategoryProductAssignment", { catalogId, assignment })

    try {
      const response = await this.client.post<CategoryProductAssignment>(`v1/catalogs/${catalogId}/categories/productassignments`, assignment)
      DebugLogger.log("saveCategoryProductAssignment_success", { catalogId, assignment }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("saveCategoryProductAssignment_error", { catalogId, assignment }, undefined, error as Error)
      throw error
    }
  }

  async deleteCategoryProductAssignment(catalogId: string, categoryId: string, productId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteCategoryProductAssignment", { catalogId, categoryId, productId })

    try {
      await this.client.delete(`v1/catalogs/${catalogId}/categories/${categoryId}/productassignments/${productId}`)
      DebugLogger.log("deleteCategoryProductAssignment_success", { catalogId, categoryId, productId })
    } catch (error) {
      DebugLogger.log("deleteCategoryProductAssignment_error", { catalogId, categoryId, productId }, undefined, error as Error)
      throw error
    }
  }
}