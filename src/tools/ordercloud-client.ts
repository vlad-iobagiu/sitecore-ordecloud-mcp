import { AuthClient } from "./clients/auth-client.js"
import { CatalogClient } from "./clients/catalog-client.js"
import { ProductClient } from "./clients/product-client.js"
import { CategoryClient } from "./clients/categories-client.js"
import { PromotionClient } from "./clients/promotion-client.js"
import { BuyerClient } from "./clients/buyer-client.js"
import { SupplierClient } from "./clients/supplier-client.js"
import { PriceScheduleClient } from "./clients/price-schedule-client.js"
import { AddressClient } from "./clients/address-client.js"

interface OrderCloudClientOptions {
  username: string
  password: string
  clientId: string
  scope?: string
  baseURL?: string
}

class OrderCloudClient {
  auth: AuthClient
  catalogs: CatalogClient
  products: ProductClient
  categories: CategoryClient
  promotions: PromotionClient
  buyers: BuyerClient
  suppliers: SupplierClient
  priceSchedules: PriceScheduleClient
  addresses: AddressClient

  private username: string
  private password: string
  private clientId: string
  private scope: string

  constructor(options: OrderCloudClientOptions) {
    const { username, password, clientId, scope = "FullAccess", baseURL } = options

    this.username = username
    this.password = password
    this.clientId = clientId
    this.scope = scope

    this.auth = new AuthClient(baseURL)
    this.catalogs = new CatalogClient(baseURL)
    this.products = new ProductClient(baseURL)
    this.categories = new CategoryClient(baseURL)
    this.promotions = new PromotionClient(baseURL)
    this.buyers = new BuyerClient(baseURL)
    this.suppliers = new SupplierClient(baseURL)
    this.priceSchedules = new PriceScheduleClient(baseURL)
    this.addresses = new AddressClient(baseURL)

    // keep them in sync with same access token
    const setToken = (token: string) => {
      this.catalogs.setAccessToken(token)
      this.products.setAccessToken(token)
      this.categories.setAccessToken(token)
      this.promotions.setAccessToken(token)
      this.buyers.setAccessToken(token)
      this.suppliers.setAccessToken(token)
      this.priceSchedules.setAccessToken(token)
      this.addresses.setAccessToken(token)
    }

    // patch auth client to propagate tokens
    const originalAuth = this.auth.authenticate.bind(this.auth)
    this.auth.authenticate = async (
      username: string = this.username,
      clientId: string = this.clientId,
      password: string = this.password,
      scope: string = this.scope
    ) => {
      const result = await originalAuth(username, clientId, password, scope)
      setToken(result.access_token)
      return result
    }

    // Auto-authenticate on construction
    this.auth.authenticate(this.username, this.clientId, this.password, this.scope).catch((err) => {
      console.error("Auto-authentication failed:", err.message)
    })
  }
}

export { OrderCloudClient }
export default OrderCloudClient
