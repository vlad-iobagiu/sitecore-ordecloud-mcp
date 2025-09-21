import { BaseClient } from "./base-client.js"
import type { Product, ProductAssignment, ProductSpec, ProductSupplier, ProductVariant, ListResponse } from "../../types/types.js"
import { DebugLogger } from "../utils/debug.js"

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
      DebugLogger.log("updateProduct_error", { productId, product, errorDetails }, undefined, error as Error)
      throw error
    }
  }

  async patchProduct(productId: string, product: Partial<Product>): Promise<Product> {
    this.ensureAuthenticated()
    
    DebugLogger.log("patchProduct", { productId, product })

    try {
      const response = await this.client.patch<Product>(`v1/products/${productId}`, product)
      DebugLogger.log("patchProduct_success", { productId, product }, response.data)
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
      DebugLogger.log("patchProduct_error", { productId, product, errorDetails }, undefined, error as Error)
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

  // Product Assignment methods
  async listProductAssignments(options?: {
    search?: string
    searchOn?: ("ProductID" | "BuyerID" | "UserGroupID" | "UserID")[]
    sortBy?: ("ProductID" | "BuyerID" | "UserGroupID" | "UserID" | "!ProductID" | "!BuyerID" | "!UserGroupID" | "!UserID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<ProductAssignment>> {
    this.ensureAuthenticated()

    DebugLogger.log("listProductAssignments_start", options)

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
      const response = await this.client.get<ListResponse<ProductAssignment>>("v1/products/assignments", { params })
      DebugLogger.log("listProductAssignments_success", options, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listProductAssignments_error", options, undefined, error as Error)
      throw error
    }
  }

  async saveProductAssignment(assignment: ProductAssignment): Promise<ProductAssignment> {
    this.ensureAuthenticated()
    
    DebugLogger.log("saveProductAssignment", { assignment })

    try {
      const response = await this.client.post<ProductAssignment>("v1/products/assignments", assignment)
      DebugLogger.log("saveProductAssignment_success", { assignment }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("saveProductAssignment_error", { assignment }, undefined, error as Error)
      throw error
    }
  }

  async deleteProductAssignment(productId: string, buyerId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteProductAssignment", { productId, buyerId })

    try {
      await this.client.delete(`v1/products/${productId}/assignments/${buyerId}`)
      DebugLogger.log("deleteProductAssignment_success", { productId, buyerId })
    } catch (error) {
      DebugLogger.log("deleteProductAssignment_error", { productId, buyerId }, undefined, error as Error)
      throw error
    }
  }

  // Product Specs methods
  async listProductSpecs(productId: string, options?: {
    search?: string
    searchOn?: ("ID" | "Name")[]
    sortBy?: ("Name" | "ID" | "!Name" | "!ID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<ProductSpec>> {
    this.ensureAuthenticated()

    DebugLogger.log("listProductSpecs_start", { productId, options })

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
      const response = await this.client.get<ListResponse<ProductSpec>>(`v1/products/${productId}/specs`, { params })
      DebugLogger.log("listProductSpecs_success", { productId, options }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listProductSpecs_error", { productId, options }, undefined, error as Error)
      throw error
    }
  }

  // Product Suppliers methods
  async listProductSuppliers(productId: string, options?: {
    search?: string
    searchOn?: ("SupplierID")[]
    sortBy?: ("SupplierID" | "!SupplierID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<ProductSupplier>> {
    this.ensureAuthenticated()

    DebugLogger.log("listProductSuppliers_start", { productId, options })

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
      const response = await this.client.get<ListResponse<ProductSupplier>>(`v1/products/${productId}/suppliers`, { params })
      DebugLogger.log("listProductSuppliers_success", { productId, options }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listProductSuppliers_error", { productId, options }, undefined, error as Error)
      throw error
    }
  }

  async saveProductSupplier(productId: string, supplierId: string, supplier: ProductSupplier): Promise<ProductSupplier> {
    this.ensureAuthenticated()
    
    DebugLogger.log("saveProductSupplier", { productId, supplierId, supplier })

    try {
      const response = await this.client.put<ProductSupplier>(`v1/products/${productId}/suppliers/${supplierId}`, supplier)
      DebugLogger.log("saveProductSupplier_success", { productId, supplierId, supplier }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("saveProductSupplier_error", { productId, supplierId, supplier }, undefined, error as Error)
      throw error
    }
  }

  async removeProductSupplier(productId: string, supplierId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("removeProductSupplier", { productId, supplierId })

    try {
      await this.client.delete(`v1/products/${productId}/suppliers/${supplierId}`)
      DebugLogger.log("removeProductSupplier_success", { productId, supplierId })
    } catch (error) {
      DebugLogger.log("removeProductSupplier_error", { productId, supplierId }, undefined, error as Error)
      throw error
    }
  }

  // Product Variants methods
  async listProductVariants(productId: string, options?: {
    search?: string
    searchOn?: ("ID" | "Name")[]
    sortBy?: ("Name" | "ID" | "!Name" | "!ID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<ProductVariant>> {
    this.ensureAuthenticated()

    DebugLogger.log("listProductVariants_start", { productId, options })

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
      const response = await this.client.get<ListResponse<ProductVariant>>(`v1/products/${productId}/variants`, { params })
      DebugLogger.log("listProductVariants_success", { productId, options }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listProductVariants_error", { productId, options }, undefined, error as Error)
      throw error
    }
  }

  async getProductVariant(productId: string, variantId: string): Promise<ProductVariant> {
    this.ensureAuthenticated()
    
    DebugLogger.log("getProductVariant", { productId, variantId })

    try {
      const response = await this.client.get<ProductVariant>(`v1/products/${productId}/variants/${variantId}`)
      DebugLogger.log("getProductVariant_success", { productId, variantId }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("getProductVariant_error", { productId, variantId }, undefined, error as Error)
      throw error
    }
  }

  async saveProductVariant(productId: string, variantId: string, variant: ProductVariant): Promise<ProductVariant> {
    this.ensureAuthenticated()
    
    DebugLogger.log("saveProductVariant", { productId, variantId, variant })

    try {
      const response = await this.client.put<ProductVariant>(`v1/products/${productId}/variants/${variantId}`, variant)
      DebugLogger.log("saveProductVariant_success", { productId, variantId, variant }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("saveProductVariant_error", { productId, variantId, variant }, undefined, error as Error)
      throw error
    }
  }

  async patchProductVariant(productId: string, variantId: string, variant: Partial<ProductVariant>): Promise<ProductVariant> {
    this.ensureAuthenticated()
    
    DebugLogger.log("patchProductVariant", { productId, variantId, variant })

    try {
      const response = await this.client.patch<ProductVariant>(`v1/products/${productId}/variants/${variantId}`, variant)
      DebugLogger.log("patchProductVariant_success", { productId, variantId, variant }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("patchProductVariant_error", { productId, variantId, variant }, undefined, error as Error)
      throw error
    }
  }

  async generateProductVariants(productId: string, specs: string[]): Promise<ListResponse<ProductVariant>> {
    this.ensureAuthenticated()
    
    DebugLogger.log("generateProductVariants", { productId, specs })

    try {
      const response = await this.client.post<ListResponse<ProductVariant>>(`v1/products/${productId}/variants/generate`, { Specs: specs })
      DebugLogger.log("generateProductVariants_success", { productId, specs }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("generateProductVariants_error", { productId, specs }, undefined, error as Error)
      throw error
    }
  }
}