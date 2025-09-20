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

// Generic List Response
export interface ListResponse<T> {
  Items: T[]
  Meta: {
    Page: number
    PageSize: number
    TotalCount: number
    TotalPages: number
  }
}

// Category type
export interface Category {
  ID?: string
  Name: string
  Description?: string
  Active?: boolean
  ParentID?: string | null
  ChildCount?: number
  ListOrder?: number
  xp?: Record<string, any> // extended properties
}

// Promotion type
export interface Promotion {
  ID?: string
  LineItemLevel?: boolean
  Code?: string
  Name: string
  RedemptionLimit?: number
  RedemptionLimitPerUser?: number
  RedemptionCount?: number
  QuantityLimitPerOrder?: number
  ItemLimitPerOrder?: number
  ItemSortBy?: string
  Description?: string
  FinePrint?: string
  StartDate?: string
  ExpirationDate?: string
  EligibleExpression?: string
  ValueExpression?: string
  CanCombine?: boolean
  AllowAllBuyers?: boolean
  OwnerID?: string
  AutoApply?: boolean
  Active?: boolean
  UseIntegration?: boolean
  Priority?: number
  xp?: Record<string, any>
}

// Buyer type
export interface Buyer {
  ID?: string
  Name: string
  Active?: boolean
  DefaultCatalogID?: string
  xp?: Record<string, any>
}

