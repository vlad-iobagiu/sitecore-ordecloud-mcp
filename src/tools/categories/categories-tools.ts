// tools/registerCategoryTools.ts
import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import OrderCloudClient from "../ordercloud-client.js"

export function registerCategoryTools(server: McpServer, orderCloudClient: OrderCloudClient) {

  // Tool: List Categories
  server.registerTool(
    "get_categories",
    {
      title: "Get Categories",
      description: "Retrieve a list of categories for a given catalog",
      inputSchema: {
        catalogId: z.string(),
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(20),
      },
    },
    async ({ catalogId, page, pageSize }) => {
      try {
        const result = await orderCloudClient.categories.getCategories(catalogId, page, pageSize)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error getting categories: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Get Category by ID
  server.registerTool(
    "get_category",
    {
      title: "Get Category",
      description: "Retrieve a specific category from a catalog",
      inputSchema: {
        catalogId: z.string(),
        categoryId: z.string(),
      },
    },
    async ({ catalogId, categoryId }) => {
      try {
        const result = await orderCloudClient.categories.getCategory(catalogId, categoryId)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error getting category: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Create Category
  server.registerTool(
    "create_category",
    {
      title: "Create Category",
      description: "Create a new category inside a catalog",
      inputSchema: {
        catalogId: z.string(),
        id: z.string().optional(),
        name: z.string(),
        description: z.string().optional(),
        active: z.boolean().optional().default(true),
      },
    },
    async ({ catalogId, id, name, description, active }) => {
      try {
        const category = { ID: id, Name: name, Description: description, Active: active }
        const result = await orderCloudClient.categories.createCategory(catalogId, category)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error creating category: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Delete Category
  server.registerTool(
    "delete_category",
    {
      title: "Delete Category",
      description: "Delete a category from a catalog",
      inputSchema: {
        catalogId: z.string(),
        categoryId: z.string(),
      },
    },
    async ({ catalogId, categoryId }) => {
      try {
        await orderCloudClient.categories.deleteCategory(catalogId, categoryId)
        return {
          content: [{ type: "text", text: `Category ${categoryId} deleted successfully from catalog ${catalogId}` }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error deleting category: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )
}
