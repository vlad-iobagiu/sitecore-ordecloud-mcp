import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import OrderCloudClient from "./ordercloud-client.js"
import { registerAuthTools } from "./authenticate/auth-tools.js"
import { registerCatalogTools } from "./catalogs/catalog-tools.js"
import { registerProductTools } from "./products/products-tools.js"
import { registerCategoryTools } from "./categories/categories-tools.js"
import { registerPromotionTools } from "./promotions/promotions-tools.js"
import { registerBuyerTools } from "./buyers/buyers-tools.js"
import { registerSupplierTools } from "./suppliers/suppliers-tools.js"
import { registerPriceScheduleTools } from "./price-schedules/price-schedules-tools.js"
import { registerAddressTools } from "./addresses/addresses-tools.js"
import { registerDebugTools } from "./debug/debug-tools.js"

export function registerAllTools(server: McpServer, orderCloudClient: OrderCloudClient) {
  registerAuthTools(server, orderCloudClient)
  registerCatalogTools(server, orderCloudClient)
  registerProductTools(server, orderCloudClient)
  registerCategoryTools(server, orderCloudClient)
  registerPromotionTools(server, orderCloudClient)
  registerBuyerTools(server, orderCloudClient)
  registerSupplierTools(server, orderCloudClient)
  registerPriceScheduleTools(server, orderCloudClient)
  registerAddressTools(server, orderCloudClient)
  registerDebugTools(server, orderCloudClient)
}