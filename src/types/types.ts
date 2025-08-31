// Sitecore OrderCloud API Types
export interface AuthRequest {
  username: string
  password: string
  client_id: string
  grant_type: "password"
  scope?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
}

export interface Catalog {
  ID?: string
  Name: string
  Description?: string
  Active?: boolean
  CategoryCount?: number
  xp?: Record<string, any>
}

export interface Product {
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
  DefaultSupplierID?: string
  AllSuppliersCanSell?: boolean
  Returnable?: boolean
  xp?: Record<string, any>
}

export interface ListResponse<T> {
  Meta: {
    Page: number
    PageSize: number
    TotalCount: number
    TotalPages: number
    ItemRange: [number, number]
  }
  Items: T[]
}
