import { BaseClient } from "./base-client.js"
import type { Product, ListResponse } from "../../types/types.js"

export class ProductClient extends BaseClient {
  
    
  // Product operations
  async getProducts(page = 1, pageSize = 20, catalogID?: string): Promise<ListResponse<Product>> {
    this.ensureAuthenticated()
    const params: any = { page, pageSize }
    if (catalogID) params.catalogID = catalogID

    const response = await this.client.get<ListResponse<Product>>("v1/products", { params })
    return response.data
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

    const params: any = {}

    if (options?.catalogID) params.catalogID = options.catalogID
    if (options?.categoryID) params.categoryID = options.categoryID
    if (options?.supplierID) params.supplierID = options.supplierID
    if (options?.search) params.search = options.search
    if (options?.searchOn) params.searchOn = options.searchOn.join(",")
    if (options?.searchType) params.searchType = options.searchType
    if (options?.sortBy) params.sortBy = options.sortBy.join(",")
    if (options?.page) params.page = options.page
    if (options?.pageSize) params.pageSize = options.pageSize

    // filters are just key/value pairs
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
    }

    const response = await this.client.get<ListResponse<Product>>("/v1/products", { params })
    return response.data
  }



  async getProduct(productId: string): Promise<Product> {
    this.ensureAuthenticated()
    const response = await this.client.get<Product>(`/v1/products/${productId}`)
    return response.data
  }

  async createProduct(product: Product): Promise<Product> {
    this.ensureAuthenticated()
    const response = await this.client.post<Product>("/v1/products", product)
    return response.data
  }

  async updateProduct(productId: string, product: Partial<Product>): Promise<Product> {
    this.ensureAuthenticated()
    const response = await this.client.put<Product>(`/v1/products/${productId}`, product)
    return response.data
  }

  async deleteProduct(productId: string): Promise<void> {
    this.ensureAuthenticated()
    await this.client.delete(`/v1/products/${productId}`)
  }
}