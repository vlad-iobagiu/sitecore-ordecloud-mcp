import axios, { type AxiosInstance } from "axios"
import type { AuthRequest, AuthResponse, Catalog, Product, ListResponse } from "../types/types.js"
class OrderCloudClient {
  client;
  accessToken: string | null = null;
  baseURL = "https://sandboxapi.ordercloud.io";

  constructor(
    username?: string,
    password?: string,
    clientId?: string,
    scope: string = "FullAccess"
  ) {
    this.client = axios.create({
      baseURL: this.baseURL,
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // If credentials were passed, authenticate immediately
    if (username && password && clientId) {
      this.authenticate(username, clientId, password, scope).catch((err) => {
        console.error("Auto-authentication failed:", err.message);
      });
    }
  }

  async authenticate(
    username: string,
    clientId: string,
    password: string,
    scope: string = "FullAccess"
  ) {
    const authData = new URLSearchParams({
      client_id: clientId,
      grant_type: "password",
      username,
      password,
      scope,
    });

    try {
      const response = await this.client.post(
        "/oauth/token",
        authData.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      this.accessToken = response.data.access_token;
    } catch (error: any) {
      throw new Error(
        `Authentication failed: ${error.response?.data?.error_description || error.message
        }`
      );
    }
  }

  ensureAuthenticated() {
    if (!this.accessToken) {
      throw new Error("Not authenticated. Please call authenticate() first.");
    }
  }

  // Catalog operations
  async getCatalogs(page = 1, pageSize = 20): Promise<ListResponse<Catalog>> {
    this.ensureAuthenticated()
    const response = await this.client.get<ListResponse<Catalog>>("/v1/catalogs", {
      params: { page, pageSize },
    })
    return response.data
  }

  async getCatalog(catalogId: string): Promise<Catalog> {
    this.ensureAuthenticated()
    const response = await this.client.get<Catalog>(`/v1/catalogs/${catalogId}`)
    return response.data
  }

  async createCatalog(catalog: Catalog): Promise<Catalog> {
    this.ensureAuthenticated()
    const response = await this.client.post<Catalog>("/v1/catalogs", catalog)
    return response.data
  }

  async updateCatalog(catalogId: string, catalog: Partial<Catalog>): Promise<Catalog> {
    this.ensureAuthenticated()
    const response = await this.client.put<Catalog>(`/v1/catalogs/${catalogId}`, catalog)
    return response.data
  }

  async deleteCatalog(catalogId: string): Promise<void> {
    this.ensureAuthenticated()
    await this.client.delete(`/v1/catalogs/${catalogId}`)
  }

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

export { OrderCloudClient }
export default OrderCloudClient
