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

// Catalog Assignment type
export interface CatalogAssignment {
  CatalogID: string
  BuyerID?: string
  UserGroupID?: string
  UserID?: string
}

// Catalog Bundle Assignment type
export interface CatalogBundleAssignment {
  CatalogID: string
  BundleID: string
}

// Catalog Product Assignment type
export interface CatalogProductAssignment {
  CatalogID: string
  ProductID: string
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

// Product Assignment type
export interface ProductAssignment {
  ProductID: string
  BuyerID?: string
  UserGroupID?: string
  UserID?: string
}

// Product Spec type
export interface ProductSpec {
  ID?: string
  Name: string
  OptionCount?: number
  Required?: boolean
  DefinesVariant?: boolean
  ListOrder?: number
  xp?: Record<string, any>
}

// Product Supplier type
export interface ProductSupplier {
  SupplierID: string
  Cost?: number
  UnitCost?: number
  AllBuyersCanPurchase?: boolean
  xp?: Record<string, any>
}

// Product Variant type
export interface ProductVariant {
  ID?: string
  Name?: string
  Description?: string
  Active?: boolean
  ShipWeight?: number
  ShipHeight?: number
  ShipWidth?: number
  ShipLength?: number
  Inventory?: {
    Enabled?: boolean
    NotificationPoint?: number
    VariantLevelTracking?: boolean
  }
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

// Category Assignment type
export interface CategoryAssignment {
  CategoryID: string
  BuyerID?: string
  UserGroupID?: string
  UserID?: string
}

// Category Bundle Assignment type
export interface CategoryBundleAssignment {
  CategoryID: string
  BundleID: string
}

// Category Product Assignment type
export interface CategoryProductAssignment {
  CategoryID: string
  ProductID: string
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

// Supplier type
export interface Supplier {
  ID?: string
  Name: string
  Active?: boolean
  xp?: Record<string, any>
}

// PriceBreak type
export interface PriceBreak {
  Quantity: number
  Price: number
  SalePrice?: number
}

// PriceSchedule type
export interface PriceSchedule {
  ID?: string
  Name: string
  Description?: string
  MinQuantity?: number
  MaxQuantity?: number
  UseCumulativeQuantity?: boolean
  RestrictedToQuantity?: boolean
  OrderType?: "Standard" | "RFQ"
  ApplyTax?: boolean
  ApplyShipping?: boolean
  Active?: boolean
  xp?: Record<string, any>
}

// Address type
export interface Address {
  ID?: string
  AddressName?: string
  CompanyName?: string
  FirstName?: string
  LastName?: string
  Street1?: string
  Street2?: string
  City?: string
  State?: string
  Zip?: string
  Country?: string
  Phone?: string
  AddressType?: "Billing" | "Shipping"
  xp?: Record<string, any>
}

// Address Assignment type
export interface AddressAssignment {
  AddressID: string
  BuyerID?: string
  UserGroupID?: string
  UserID?: string
  IsBilling?: boolean
  IsShipping?: boolean
}

