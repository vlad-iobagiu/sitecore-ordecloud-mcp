import { BaseClient } from "./base-client.js"
import type { Category, ListResponse } from "../../types/types.js"

export class CategoryClient extends BaseClient {
  
    
      async getCategories(catalogId: string, page = 1, pageSize = 20): Promise<ListResponse<Category>> {
      this.ensureAuthenticated()
      const response = await this.client.get<ListResponse<Category>>(
        `/v1/catalogs/${catalogId}/categories`,
        { params: { page, pageSize } }
      )
      return response.data
    }
    
    async getCategory(catalogId: string, categoryId: string): Promise<Category> {
      this.ensureAuthenticated()
      const response = await this.client.get<Category>(
        `/v1/catalogs/${catalogId}/categories/${categoryId}`
      )
      return response.data
    }
    
    async createCategory(catalogId: string, category: Category): Promise<Category> {
      this.ensureAuthenticated()
      const response = await this.client.post<Category>(
        `/v1/catalogs/${catalogId}/categories`,
        category
      )
      return response.data
    }
    
    async updateCategory(catalogId: string, categoryId: string, category: Partial<Category>): Promise<Category> {
      this.ensureAuthenticated()
      const response = await this.client.put<Category>(
        `/v1/catalogs/${catalogId}/categories/${categoryId}`,
        category
      )
      return response.data
    }
    
    async deleteCategory(catalogId: string, categoryId: string): Promise<void> {
      this.ensureAuthenticated()
      await this.client.delete(`/v1/catalogs/${catalogId}/categories/${categoryId}`)
    }
}