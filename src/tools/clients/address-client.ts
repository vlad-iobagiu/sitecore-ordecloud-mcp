import { BaseClient } from "./base-client.js"
import type { Address, AddressAssignment, ListResponse } from "../../types/types.js"
import { DebugLogger } from "../utils/debug.js"

export class AddressClient extends BaseClient {
  
  // List addresses with advanced filtering, searching, and sorting
  async listAddresses(buyerId: string, options?: {
    search?: string
    searchOn?: ("ID" | "AddressName" | "CompanyName" | "FirstName" | "LastName" | "City" | "State" | "Zip" | "Country")[]
    sortBy?: ("AddressName" | "CompanyName" | "FirstName" | "LastName" | "City" | "State" | "Zip" | "Country" | "!AddressName" | "!CompanyName" | "!FirstName" | "!LastName" | "!City" | "!State" | "!Zip" | "!Country")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<Address>> {
    this.ensureAuthenticated()

    DebugLogger.log("listAddresses_start", { buyerId, options })

    const params: any = {}

    if (options?.search) {
      params.search = options.search
      DebugLogger.log("listAddresses_param", { search: options.search })
    }
    if (options?.searchOn && options.searchOn.length > 0) {
      params.searchOn = options.searchOn.join(",")
      DebugLogger.log("listAddresses_param", { searchOn: params.searchOn })
    }
    if (options?.sortBy && options.sortBy.length > 0) {
      params.sortBy = options.sortBy.join(",")
      DebugLogger.log("listAddresses_param", { sortBy: params.sortBy })
    }
    if (options?.page) {
      params.page = options.page
      DebugLogger.log("listAddresses_param", { page: options.page })
    }
    if (options?.pageSize) {
      params.pageSize = options.pageSize
      DebugLogger.log("listAddresses_param", { pageSize: options.pageSize })
    }

    // filters are just key/value pairs
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
      DebugLogger.log("listAddresses_param", { filters: options.filters })
    }

    DebugLogger.log("listAddresses_final_params", params)

    try {
      const response = await this.client.get<ListResponse<Address>>(`v1/buyers/${buyerId}/addresses`, { params })
      DebugLogger.log("listAddresses_success", { buyerId, options }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listAddresses_error", { buyerId, options }, undefined, error as Error)
      throw error
    }
  }

  // Get a specific address by ID
  async getAddress(buyerId: string, addressId: string): Promise<Address> {
    this.ensureAuthenticated()
    
    DebugLogger.log("getAddress", { buyerId, addressId })

    try {
      const response = await this.client.get<Address>(`v1/buyers/${buyerId}/addresses/${addressId}`)
      DebugLogger.log("getAddress_success", { buyerId, addressId }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("getAddress_error", { buyerId, addressId }, undefined, error as Error)
      throw error
    }
  }

  // Create a new address
  async createAddress(buyerId: string, address: Address): Promise<Address> {
    this.ensureAuthenticated()
    
    DebugLogger.log("createAddress", { buyerId, address })

    try {
      const response = await this.client.post<Address>(`v1/buyers/${buyerId}/addresses`, address)
      DebugLogger.log("createAddress_success", { buyerId, address }, response.data)
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
      DebugLogger.log("createAddress_error", { buyerId, address, errorDetails }, undefined, error as Error)
      throw error
    }
  }

  // Update an existing address (PUT - full update)
  async updateAddress(buyerId: string, addressId: string, address: Partial<Address>): Promise<Address> {
    this.ensureAuthenticated()
    
    DebugLogger.log("updateAddress", { buyerId, addressId, address })

    try {
      const response = await this.client.put<Address>(`v1/buyers/${buyerId}/addresses/${addressId}`, address)
      DebugLogger.log("updateAddress_success", { buyerId, addressId, address }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("updateAddress_error", { buyerId, addressId, address }, undefined, error as Error)
      throw error
    }
  }

  // Partially update an address (PATCH - partial update)
  async patchAddress(buyerId: string, addressId: string, address: Partial<Address>): Promise<Address> {
    this.ensureAuthenticated()
    
    DebugLogger.log("patchAddress", { buyerId, addressId, address })

    try {
      const response = await this.client.patch<Address>(`v1/buyers/${buyerId}/addresses/${addressId}`, address)
      DebugLogger.log("patchAddress_success", { buyerId, addressId, address }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("patchAddress_error", { buyerId, addressId, address }, undefined, error as Error)
      throw error
    }
  }

  // Delete an address
  async deleteAddress(buyerId: string, addressId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteAddress", { buyerId, addressId })

    try {
      await this.client.delete(`v1/buyers/${buyerId}/addresses/${addressId}`)
      DebugLogger.log("deleteAddress_success", { buyerId, addressId })
    } catch (error) {
      DebugLogger.log("deleteAddress_error", { buyerId, addressId }, undefined, error as Error)
      throw error
    }
  }

  // List address assignments
  async listAddressAssignments(buyerId: string, options?: {
    search?: string
    searchOn?: ("AddressID" | "UserGroupID" | "UserID")[]
    sortBy?: ("AddressID" | "UserGroupID" | "UserID" | "!AddressID" | "!UserGroupID" | "!UserID")[]
    page?: number
    pageSize?: number
    filters?: Record<string, any>
  }): Promise<ListResponse<AddressAssignment>> {
    this.ensureAuthenticated()

    DebugLogger.log("listAddressAssignments_start", { buyerId, options })

    const params: any = {}

    if (options?.search) {
      params.search = options.search
      DebugLogger.log("listAddressAssignments_param", { search: options.search })
    }
    if (options?.searchOn && options.searchOn.length > 0) {
      params.searchOn = options.searchOn.join(",")
      DebugLogger.log("listAddressAssignments_param", { searchOn: params.searchOn })
    }
    if (options?.sortBy && options.sortBy.length > 0) {
      params.sortBy = options.sortBy.join(",")
      DebugLogger.log("listAddressAssignments_param", { sortBy: params.sortBy })
    }
    if (options?.page) {
      params.page = options.page
      DebugLogger.log("listAddressAssignments_param", { page: options.page })
    }
    if (options?.pageSize) {
      params.pageSize = options.pageSize
      DebugLogger.log("listAddressAssignments_param", { pageSize: options.pageSize })
    }

    // filters are just key/value pairs
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        params[`filters[${key}]`] = value
      })
      DebugLogger.log("listAddressAssignments_param", { filters: options.filters })
    }

    DebugLogger.log("listAddressAssignments_final_params", params)

    try {
      const response = await this.client.get<ListResponse<AddressAssignment>>(`v1/buyers/${buyerId}/addresses/assignments`, { params })
      DebugLogger.log("listAddressAssignments_success", { buyerId, options }, response.data)
      return response.data
    } catch (error) {
      DebugLogger.log("listAddressAssignments_error", { buyerId, options }, undefined, error as Error)
      throw error
    }
  }

  // Create or update an address assignment
  async saveAddressAssignment(buyerId: string, assignment: AddressAssignment): Promise<AddressAssignment> {
    this.ensureAuthenticated()
    
    DebugLogger.log("saveAddressAssignment", { buyerId, assignment })

    try {
      const response = await this.client.post<AddressAssignment>(`v1/buyers/${buyerId}/addresses/assignments`, assignment)
      DebugLogger.log("saveAddressAssignment_success", { buyerId, assignment }, response.data)
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
      DebugLogger.log("saveAddressAssignment_error", { buyerId, assignment, errorDetails }, undefined, error as Error)
      throw error
    }
  }

  // Delete an address assignment
  async deleteAddressAssignment(buyerId: string, addressId: string): Promise<void> {
    this.ensureAuthenticated()
    
    DebugLogger.log("deleteAddressAssignment", { buyerId, addressId })

    try {
      await this.client.delete(`v1/buyers/${buyerId}/addresses/${addressId}/assignments`)
      DebugLogger.log("deleteAddressAssignment_success", { buyerId, addressId })
    } catch (error) {
      DebugLogger.log("deleteAddressAssignment_error", { buyerId, addressId }, undefined, error as Error)
      throw error
    }
  }
}
