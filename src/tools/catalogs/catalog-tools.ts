import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import OrderCloudClient from "../ordercloud-client.js"

export function registerCatalogTools(server: McpServer, orderCloudClient: OrderCloudClient) {
  // Tool: List Catalogs
  server.registerTool(
    "list_catalogs",
    {
      title: "List Catalogs",
      description: "Retrieve a list of catalogs from OrderCloud",
      inputSchema: {
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(20),
      },
    },
    async ({ page, pageSize }) => {
      try {
        const result = await orderCloudClient.catalogs.list(page, pageSize) // ✅ use list()
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) },
          ],
        }
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error listing catalogs: ${error instanceof Error ? error.message : String(error)}` },
          ],
          isError: true,
        }
      }
    },
  )

  // Tool: Get Catalog by ID
  server.registerTool(
    "get_catalog",
    {
      title: "Get Catalog",
      description: "Retrieve a specific catalog by ID from OrderCloud",
      inputSchema: {
        catalogId: z.string(),
      },
    },
    async ({ catalogId }) => {
      try {
        const result = await orderCloudClient.catalogs.get(catalogId) // ✅ use catalogs.get()
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) },
          ],
        }
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error getting catalog: ${error instanceof Error ? error.message : String(error)}` },
          ],
          isError: true,
        }
      }
    },
  )

  // Tool: Create Catalog
  server.registerTool(
    "create_catalog",
    {
      title: "Create Catalog",
      description: "Create a new catalog in OrderCloud",
      inputSchema: {
        name: z.string(),
        description: z.string().optional(),
        active: z.boolean().optional().default(true),
        id: z.string().optional(),
      },
    },
    async ({ name, description, active, id }) => {
      try {
        const catalog = { ID: id, Name: name, Description: description, Active: active }
        const result = await orderCloudClient.catalogs.create(catalog) // ✅ use catalogs.create()
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) },
          ],
        }
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error creating catalog: ${error instanceof Error ? error.message : String(error)}` },
          ],
          isError: true,
        }
      }
    },
  )

  // Tool: Delete Catalog
  server.registerTool(
    "delete_catalog",
    {
      title: "Delete Catalog",
      description: "Delete a catalog from OrderCloud",
      inputSchema: {
        catalogId: z.string(),
      },
    },
    async ({ catalogId }) => {
      try {
        await orderCloudClient.catalogs.delete(catalogId) // ✅ use catalogs.delete()
        return {
          content: [
            { type: "text", text: `Catalog ${catalogId} deleted successfully` },
          ],
        }
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error deleting catalog: ${error instanceof Error ? error.message : String(error)}` },
          ],
          isError: true,
        }
      }
    },
  )
}
