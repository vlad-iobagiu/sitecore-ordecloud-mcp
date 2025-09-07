import { BaseClient } from "./base-client.js"
import type { Catalog, ListResponse } from "../../types/types.js"

export class CatalogClient extends BaseClient {
  async list(page = 1, pageSize = 20): Promise<ListResponse<Catalog>> {
    this.ensureAuthenticated()
    const response = await this.client.get("/v1/catalogs", { params: { page, pageSize } })
    return response.data
  }

  async get(id: string): Promise<Catalog> {
    this.ensureAuthenticated()
    const response = await this.client.get(`/v1/catalogs/${id}`)
    return response.data
  }

  async create(catalog: Catalog): Promise<Catalog> {
    this.ensureAuthenticated()
    const response = await this.client.post("/v1/catalogs", catalog)
    return response.data
  }

  async update(id: string, catalog: Partial<Catalog>): Promise<Catalog> {
    this.ensureAuthenticated()
    const response = await this.client.put(`/v1/catalogs/${id}`, catalog)
    return response.data
  }

  async delete(id: string): Promise<void> {
    this.ensureAuthenticated()
    await this.client.delete(`/v1/catalogs/${id}`)
  }
}
