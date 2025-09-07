import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import OrderCloudClient from "./ordercloud-client.js"
import { registerAuthTools } from "./authenticate/auth-tools.js"
import { registerCatalogTools } from "./catalogs/catalog-tools.js"
import { registerProductTools } from "./products/products-tools.js"
import { registerCategoryTools } from "./categories/categories-tools.js"

export function registerAllTools(server: McpServer, orderCloudClient: OrderCloudClient) {
  registerAuthTools(server, orderCloudClient)
  registerCatalogTools(server, orderCloudClient)
  registerProductTools(server, orderCloudClient)
  registerCategoryTools(server, orderCloudClient)
}