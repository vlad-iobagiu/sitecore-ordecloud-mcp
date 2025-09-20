import { BaseClient } from "./base-client.js"
import type { Product, ListResponse } from "../../types/types.js"
import { DebugLogger, withDebugLogging } from "../utils/debug.js"

export class ProductClient extends BaseClient {
  
    
  // Product operations
  async getProducts(page = 1, pageSize = 20, catalogID?: string): Promise<ListResponse<Product>> {
    this.ensureAuthenticated()
    
    const params: any = { page, pageSize }
    if (catalogID) params.catalogID = catalogID

    DebugLogger.log("getProducts", { page, pageSize, catalogID, params })

    try {
      const response = await this.client.get<ListResponse<Product>>("v1/products", { params })
      DebugLogger.log("getProducts_success", { page, pageSize, catalogID }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("getProducts_error", { page, pageSize, catalogID }, undefined, error as Error)
      throw error
    }
  }


  // Product operations
  async listProducts(options?: {
    catalogID?: string
    categoryID?: string
    supplierID?: string
    search?: string
    searchOn?: ("ID" | "ParentID" | "Name" | "Description")[]
    searchType?: "AnyTerm" | "AllTermsAnyField" | "AllTermsSameField" | "ExactPhrase" | "ExactPhrasePrefix"
    sortBy?: ("OwnerID" | "Name" | "ID" | "ParentID" | "!OwnerID" | "!Name" | "!ID" | "!ParentID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<Product>> {
    this.ensureAuthenticated()

    DebugLogger.log("listProducts_start", options)

    const params: any = {}

    if (options?.catalogID) {
      params.catalogID = options.catalogID
      DebugLogger.log("listProducts_param", { catalogID: options.catalogID })
    }
    if (options?.categoryID) {
      params.categoryID = options.categoryID
      DebugLogger.log("listProducts_param", { categoryID: options.categoryID })
    }
    if (options?.supplierID) {
      params.supplierID = options.supplierID
      DebugLogger.log("listProducts_param", { supplierID: options.supplierID })
    }
    if (options?.search) {
      params.search = options.search
      DebugLogger.log("listProducts_param", { search: options.search })
    }
    if (options?.searchOn && options.searchOn.length > 0) {
      params.searchOn = options.searchOn.join(",")
      DebugLogger.log("listProducts_param", { searchOn: params.searchOn })
    }
    if (options?.searchType) {
      params.searchType = options.searchType
      DebugLogger.log("listProducts_param", { searchType: options.searchType })
    }
    if (options?.sortBy && options.sortBy.length > 0) {
      params.sortBy = options.sortBy.join(",")
      DebugLogger.log("listProducts_param", { sortBy: params.sortBy })
    }
    if (options?.page) {
      params.page = options.page
      DebugLogger.log("listProducts_param", { page: options.page })
    }
    if (options?.pageSize) {
      params.pageSize = options.pageSize
      DebugLogger.log("listProducts_param", { pageSize: options.pageSize })
    }

    // filters are just key/value pairs
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
      DebugLogger.log("listProducts_param", { filters: options.filters })
    }

    DebugLogger.log("listProducts_final_params", params)

    try {
      const response = await this.client.get<ListResponse<Product>>("v1/products", { params })
      DebugLogger.log("listProducts_success", options, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listProducts_error", options, undefined, error as Error)
      throw error
    }
  }



  async getProduct(productId: string): Promise<Product> {
    this.ensureAuthenticated()
    
    DebugLogger.log("getProduct", { productId })

    try {
      const response = await this.client.get<Product>(`v1/products/${productId}`)
      DebugLogger.log("getProduct_success", { productId }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("getProduct_error", { productId }, undefined, error as Error)
      throw error
    }
  }

  async createProduct(product: Product): Promise<Product> {
    this.ensureAuthenticated()
    
    DebugLogger.log("createProduct", { product })

    try {
      const response = await this.client.post<Product>("v1/products", product)
      DebugLogger.log("createProduct_success", { product }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("createProduct_error", { product }, undefined, error as Error)
      throw error
    }
  }

  async updateProduct(productId: string, product: Partial<Product>): Promise<Product> {
    this.ensureAuthenticated()
    
    DebugLogger.log("updateProduct", { productId, product })

    try {
      const response = await this.client.put<Product>(`v1/products/${productId}`, product)
      DebugLogger.log("updateProduct_success", { productId, product }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("updateProduct_error", { productId, product }, undefined, error as Error)
      throw error
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteProduct", { productId })

    try {
      await this.client.delete(`v1/products/${productId}`)
      DebugLogger.log("deleteProduct_success", { productId })
    } catch (error) {
      DebugLogger.log("deleteProduct_error", { productId }, undefined, error as Error)
      throw error
    }
  }
}