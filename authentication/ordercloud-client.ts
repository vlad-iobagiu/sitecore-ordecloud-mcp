import { orderCloudAuth } from "./ordercloud-auth"

export interface OrderCloudProduct {
  ID?: string
  Name: string
  Description?: string
  QuantityMultiplier?: number
  ShipWeight?: number
  ShipHeight?: number
  ShipWidth?: number
  ShipLength?: number
  Active?: boolean
  SpecCount?: number
  VariantCount?: number
  ShipFromAddressID?: string
  Inventory?: {
    Enabled?: boolean
    NotificationPoint?: number
    VariantLevelTracking?: boolean
  }
  DefaultPriceScheduleID?: string
  AutoForward?: boolean
  xp?: Record<string, any>
}

export interface OrderCloudCatalog {
  ID?: string
  Name: string
  Description?: string
  Active?: boolean
  CategoryCount?: number
  xp?: Record<string, any>
}

export interface OrderCloudOrder {
  ID?: string
  Type?: string
  FromUserID?: string
  BillingAddressID?: string
  ShippingAddressID?: string
  Comments?: string
  LineItemCount?: number
  Status?: string
  DateCreated?: string
  DateSubmitted?: string
  Subtotal?: number
  ShippingCost?: number
  TaxCost?: number
  PromotionDiscount?: number
  Total?: number
  IsSubmitted?: boolean
  xp?: Record<string, any>
}

export interface OrderCloudListResponse<T> {
  Meta: {
    Page: number
    PageSize: number
    TotalCount: number
    TotalPages: number
    ItemRange: [number, number]
  }
  Items: T[]
}

export interface OrderCloudCategory {
  ID?: string
  Name: string
  Description?: string
  ListOrder?: number
  Active?: boolean
  ParentID?: string
  ChildCount?: number
  xp?: Record<string, any>
}

export interface OrderCloudUser {
  ID?: string
  Username?: string
  FirstName?: string
  LastName?: string
  Email?: string
  Phone?: string
  TermsAccepted?: string
  Active?: boolean
  xp?: Record<string, any>
}

export interface OrderCloudApiError {
  ErrorCode: string
  Message: string
  Data?: any
}

export interface OrderCloudLineItem {
  ID?: string
  ProductID: string
  Quantity: number
  UnitPrice?: number
  LineTotal?: number
  LineSubtotal?: number
  DateAdded?: string
  Product?: OrderCloudProduct
  Variant?: any
  Specs?: any[]
  xp?: Record<string, any>
}

export interface OrderCloudPayment {
  ID?: string
  Type?: string
  DateCreated?: string
  CreditCardID?: string
  SpendingAccountID?: string
  Description?: string
  Amount?: number
  Accepted?: boolean
  xp?: Record<string, any>
}

export interface OrderCloudShipment {
  ID?: string
  BuyerID?: string
  Shipper?: string
  DateShipped?: string
  DateDelivered?: string
  TrackingNumber?: string
  Cost?: number
  xp?: Record<string, any>
}

export interface OrderCloudAddress {
  ID?: string
  CompanyName?: string
  FirstName?: string
  LastName?: string
  Street1: string
  Street2?: string
  City: string
  State: string
  Zip: string
  Country: string
  Phone?: string
  AddressName?: string
  xp?: Record<string, any>
}

class OrderCloudClient {
  private baseUrl: string
  private retryAttempts: number
  private retryDelay: number

  constructor(baseUrl = "https://sandboxapi.ordercloud.io", retryAttempts = 3, retryDelay = 1000) {
    this.baseUrl = baseUrl
    this.retryAttempts = retryAttempts
    this.retryDelay = retryDelay
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let lastError: Error

    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const headers = await orderCloudAuth.getAuthHeaders()

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: {
            ...headers,
            ...options.headers,
          },
        })

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`

          try {
            const errorBody = await response.json()
            if (errorBody.Errors && Array.isArray(errorBody.Errors)) {
              errorMessage = errorBody.Errors.map((err: OrderCloudApiError) => `${err.ErrorCode}: ${err.Message}`).join(
                ", ",
              )
            } else if (errorBody.Message) {
              errorMessage = errorBody.Message
            }
          } catch {
            // If we can't parse the error body, use the status text
          }

          throw new Error(`OrderCloud API error: ${errorMessage}`)
        }

        return response.json()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Don't retry on authentication errors or client errors (4xx)
        if (
          lastError.message.includes("401") ||
          lastError.message.includes("403") ||
          lastError.message.includes("400") ||
          lastError.message.includes("404")
        ) {
          throw lastError
        }

        // Wait before retrying (exponential backoff)
        if (attempt < this.retryAttempts) {
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay * Math.pow(2, attempt)))
        }
      }
    }

    throw lastError!
  }

  // Product Management
  async getProducts(page = 1, pageSize = 20, search?: string): Promise<OrderCloudListResponse<OrderCloudProduct>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    return this.makeRequest<OrderCloudListResponse<OrderCloudProduct>>(`/v1/products?${params.toString()}`)
  }

  async getProduct(productId: string): Promise<OrderCloudProduct> {
    return this.makeRequest<OrderCloudProduct>(`/v1/products/${productId}`)
  }

  async createProduct(product: OrderCloudProduct): Promise<OrderCloudProduct> {
    return this.makeRequest<OrderCloudProduct>("/v1/products", {
      method: "POST",
      body: JSON.stringify(product),
    })
  }

  async updateProduct(productId: string, product: Partial<OrderCloudProduct>): Promise<OrderCloudProduct> {
    return this.makeRequest<OrderCloudProduct>(`/v1/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(product),
    })
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.makeRequest(`/v1/products/${productId}`, {
      method: "DELETE",
    })
  }

  // Catalog Management
  async getCatalogs(page = 1, pageSize = 20): Promise<OrderCloudListResponse<OrderCloudCatalog>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    return this.makeRequest<OrderCloudListResponse<OrderCloudCatalog>>(`/v1/catalogs?${params.toString()}`)
  }

  async getCatalog(catalogId: string): Promise<OrderCloudCatalog> {
    return this.makeRequest<OrderCloudCatalog>(`/v1/catalogs/${catalogId}`)
  }

  // Category Management
  async getCategories(catalogId: string, page = 1, pageSize = 20): Promise<OrderCloudListResponse<OrderCloudCategory>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    return this.makeRequest<OrderCloudListResponse<OrderCloudCategory>>(
      `/v1/catalogs/${catalogId}/categories?${params.toString()}`,
    )
  }

  async getCategory(catalogId: string, categoryId: string): Promise<OrderCloudCategory> {
    return this.makeRequest<OrderCloudCategory>(`/v1/catalogs/${catalogId}/categories/${categoryId}`)
  }

  async createCategory(catalogId: string, category: OrderCloudCategory): Promise<OrderCloudCategory> {
    return this.makeRequest<OrderCloudCategory>(`/v1/catalogs/${catalogId}/categories`, {
      method: "POST",
      body: JSON.stringify(category),
    })
  }

  // User Management
  async getUsers(page = 1, pageSize = 20, search?: string): Promise<OrderCloudListResponse<OrderCloudUser>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    return this.makeRequest<OrderCloudListResponse<OrderCloudUser>>(`/v1/adminusers?${params.toString()}`)
  }

  async getUser(userId: string): Promise<OrderCloudUser> {
    return this.makeRequest<OrderCloudUser>(`/v1/adminusers/${userId}`)
  }

  // Product Assignment Management
  async assignProductToCatalog(productId: string, catalogId: string): Promise<void> {
    await this.makeRequest(`/v1/catalogs/${catalogId}/productassignments`, {
      method: "POST",
      body: JSON.stringify({
        ProductID: productId,
      }),
    })
  }

  async removeProductFromCatalog(productId: string, catalogId: string): Promise<void> {
    await this.makeRequest(`/v1/catalogs/${catalogId}/productassignments/${productId}`, {
      method: "DELETE",
    })
  }

  // Batch Operations
  async batchCreateProducts(products: OrderCloudProduct[]): Promise<OrderCloudProduct[]> {
    const results: OrderCloudProduct[] = []

    // Process in batches of 10 to avoid overwhelming the API
    const batchSize = 10
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      const batchPromises = batch.map((product) => this.createProduct(product))

      try {
        const batchResults = await Promise.all(batchPromises)
        results.push(...batchResults)
      } catch (error) {
        console.error(`Batch ${Math.floor(i / batchSize) + 1} failed:`, error)
        throw error
      }
    }

    return results
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string; authenticated: boolean }> {
    try {
      // Try to make a simple API call to check connectivity
      await this.makeRequest("/v1/me")
      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        authenticated: orderCloudAuth.isAuthenticated(),
      }
    } catch (error) {
      return {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        authenticated: false,
      }
    }
  }

  // Order Management
  async getOrders(
    page = 1,
    pageSize = 20,
    from?: string,
    to?: string,
  ): Promise<OrderCloudListResponse<OrderCloudOrder>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (from) params.append("from", from)
    if (to) params.append("to", to)

    return this.makeRequest<OrderCloudListResponse<OrderCloudOrder>>(`/v1/orders/incoming?${params.toString()}`)
  }

  async getOrder(orderId: string): Promise<OrderCloudOrder> {
    return this.makeRequest<OrderCloudOrder>(`/v1/orders/incoming/${orderId}`)
  }

  // Comprehensive order line item management
  async getOrderLineItems(
    orderId: string,
    page = 1,
    pageSize = 20,
  ): Promise<OrderCloudListResponse<OrderCloudLineItem>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    return this.makeRequest<OrderCloudListResponse<OrderCloudLineItem>>(
      `/v1/orders/incoming/${orderId}/lineitems?${params.toString()}`,
    )
  }

  async getOrderLineItem(orderId: string, lineItemId: string): Promise<OrderCloudLineItem> {
    return this.makeRequest<OrderCloudLineItem>(`/v1/orders/incoming/${orderId}/lineitems/${lineItemId}`)
  }

  async addLineItemToOrder(orderId: string, lineItem: Partial<OrderCloudLineItem>): Promise<OrderCloudLineItem> {
    return this.makeRequest<OrderCloudLineItem>(`/v1/orders/incoming/${orderId}/lineitems`, {
      method: "POST",
      body: JSON.stringify(lineItem),
    })
  }

  async updateOrderLineItem(
    orderId: string,
    lineItemId: string,
    lineItem: Partial<OrderCloudLineItem>,
  ): Promise<OrderCloudLineItem> {
    return this.makeRequest<OrderCloudLineItem>(`/v1/orders/incoming/${orderId}/lineitems/${lineItemId}`, {
      method: "PUT",
      body: JSON.stringify(lineItem),
    })
  }

  async deleteOrderLineItem(orderId: string, lineItemId: string): Promise<void> {
    await this.makeRequest(`/v1/orders/incoming/${orderId}/lineitems/${lineItemId}`, {
      method: "DELETE",
    })
  }

  // Payment management for orders
  async getOrderPayments(orderId: string, page = 1, pageSize = 20): Promise<OrderCloudListResponse<OrderCloudPayment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    return this.makeRequest<OrderCloudListResponse<OrderCloudPayment>>(
      `/v1/orders/incoming/${orderId}/payments?${params.toString()}`,
    )
  }

  async createOrderPayment(orderId: string, payment: Partial<OrderCloudPayment>): Promise<OrderCloudPayment> {
    return this.makeRequest<OrderCloudPayment>(`/v1/orders/incoming/${orderId}/payments`, {
      method: "POST",
      body: JSON.stringify(payment),
    })
  }

  // Shipment management for orders
  async getOrderShipments(
    orderId: string,
    page = 1,
    pageSize = 20,
  ): Promise<OrderCloudListResponse<OrderCloudShipment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    return this.makeRequest<OrderCloudListResponse<OrderCloudShipment>>(
      `/v1/orders/incoming/${orderId}/shipments?${params.toString()}`,
    )
  }

  async createOrderShipment(orderId: string, shipment: Partial<OrderCloudShipment>): Promise<OrderCloudShipment> {
    return this.makeRequest<OrderCloudShipment>(`/v1/orders/incoming/${orderId}/shipments`, {
      method: "POST",
      body: JSON.stringify(shipment),
    })
  }

  async updateOrderShipment(
    orderId: string,
    shipmentId: string,
    shipment: Partial<OrderCloudShipment>,
  ): Promise<OrderCloudShipment> {
    return this.makeRequest<OrderCloudShipment>(`/v1/orders/incoming/${orderId}/shipments/${shipmentId}`, {
      method: "PUT",
      body: JSON.stringify(shipment),
    })
  }

  // Order status management
  async submitOrder(orderId: string): Promise<OrderCloudOrder> {
    return this.makeRequest<OrderCloudOrder>(`/v1/orders/incoming/${orderId}/submit`, {
      method: "POST",
    })
  }

  async approveOrder(orderId: string, comments?: string): Promise<OrderCloudOrder> {
    const body = comments ? JSON.stringify({ Comments: comments }) : undefined
    return this.makeRequest<OrderCloudOrder>(`/v1/orders/incoming/${orderId}/approve`, {
      method: "POST",
      body,
    })
  }

  async declineOrder(orderId: string, comments?: string): Promise<OrderCloudOrder> {
    const body = comments ? JSON.stringify({ Comments: comments }) : undefined
    return this.makeRequest<OrderCloudOrder>(`/v1/orders/incoming/${orderId}/decline`, {
      method: "POST",
      body,
    })
  }

  async cancelOrder(orderId: string): Promise<OrderCloudOrder> {
    return this.makeRequest<OrderCloudOrder>(`/v1/orders/incoming/${orderId}/cancel`, {
      method: "POST",
    })
  }

  // Address management
  async getAddresses(page = 1, pageSize = 20, search?: string): Promise<OrderCloudListResponse<OrderCloudAddress>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    return this.makeRequest<OrderCloudListResponse<OrderCloudAddress>>(`/v1/addresses?${params.toString()}`)
  }

  async getAddress(addressId: string): Promise<OrderCloudAddress> {
    return this.makeRequest<OrderCloudAddress>(`/v1/addresses/${addressId}`)
  }

  async createAddress(address: OrderCloudAddress): Promise<OrderCloudAddress> {
    return this.makeRequest<OrderCloudAddress>("/v1/addresses", {
      method: "POST",
      body: JSON.stringify(address),
    })
  }

  async updateAddress(addressId: string, address: Partial<OrderCloudAddress>): Promise<OrderCloudAddress> {
    return this.makeRequest<OrderCloudAddress>(`/v1/addresses/${addressId}`, {
      method: "PUT",
      body: JSON.stringify(address),
    })
  }

  async deleteAddress(addressId: string): Promise<void> {
    await this.makeRequest(`/v1/addresses/${addressId}`, {
      method: "DELETE",
    })
  }

  // Order analytics and reporting
  async getOrdersByStatus(status: string, page = 1, pageSize = 20): Promise<OrderCloudListResponse<OrderCloudOrder>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      filters: `Status=${status}`,
    })

    return this.makeRequest<OrderCloudListResponse<OrderCloudOrder>>(`/v1/orders/incoming?${params.toString()}`)
  }

  async getOrdersByDateRange(
    startDate: string,
    endDate: string,
    page = 1,
    pageSize = 20,
  ): Promise<OrderCloudListResponse<OrderCloudOrder>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      from: startDate,
      to: endDate,
    })

    return this.makeRequest<OrderCloudListResponse<OrderCloudOrder>>(`/v1/orders/incoming?${params.toString()}`)
  }

  async getOrdersByUser(userId: string, page = 1, pageSize = 20): Promise<OrderCloudListResponse<OrderCloudOrder>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      filters: `FromUserID=${userId}`,
    })

    return this.makeRequest<OrderCloudListResponse<OrderCloudOrder>>(`/v1/orders/incoming?${params.toString()}`)
  }
}

export const orderCloudClient = new OrderCloudClient()
