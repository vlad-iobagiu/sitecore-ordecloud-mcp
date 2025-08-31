import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import OrderCloudClient from "../ordercloud-client.js"

export function registerProductTools(server: McpServer, orderCloudClient: OrderCloudClient) {


// Tool: Get Products
server.registerTool(
  "get_products",
  {
    title: "Get Products",
    description: "Retrieve a list of products from OrderCloud",
    inputSchema: {
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
      catalogId: z.string().optional(),
    },
  },
  async ({ page, pageSize, catalogId }) => {
    try {
      const result = await orderCloudClient.getProducts(page, pageSize, catalogId)
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting products: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: List Products
server.registerTool(
  "list_products",
  {
    title: "List Products",
    description: "Retrieve a list of products from OrderCloud with advanced filtering, searching, and sorting",
    inputSchema: {
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
      catalogID: z.string().optional(),
      categoryID: z.string().optional(),
      supplierID: z.string().optional(),
      search: z.string().optional(),
      searchOn: z
        .array(z.enum(["ID", "ParentID", "Name", "Description"]))
        .optional(),
      searchType: z
        .enum([
          "AnyTerm",
          "AllTermsAnyField",
          "AllTermsSameField",
          "ExactPhrase",
          "ExactPhrasePrefix",
        ])
        .optional(),
      sortBy: z
        .array(
          z.enum([
            "OwnerID",
            "Name",
            "ID",
            "ParentID",
            "!OwnerID",
            "!Name",
            "!ID",
            "!ParentID",
          ])
        )
        .optional(),
      filters: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const result = await orderCloudClient.listProducts(input)
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error listing products: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      }
    }
  }
)



// Tool: Get Product by ID
server.registerTool(
  "get_product",
  {
    title: "Get Product",
    description: "Retrieve a specific product by ID from OrderCloud",
    inputSchema: {
      productId: z.string(),
    },
  },
  async ({ productId }) => {
    try {
      const result = await orderCloudClient.getProduct(productId)
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting product: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Create Product
server.registerTool(
  "create_product",
  {
    title: "Create Product",
    description: "Create a new product in OrderCloud",
    inputSchema: {
      name: z.string(),
      description: z.string().optional(),
      active: z.boolean().optional().default(true),
      id: z.string().optional(),
      quantityMultiplier: z.number().optional(),
      shipWeight: z.number().optional(),
      shipHeight: z.number().optional(),
      shipWidth: z.number().optional(),
      shipLength: z.number().optional(),
    },
  },
  async ({ name, description, active, id, quantityMultiplier, shipWeight, shipHeight, shipWidth, shipLength }) => {
    try {
      const product = {
        ID: id,
        Name: name,
        Description: description,
        Active: active,
        QuantityMultiplier: quantityMultiplier,
        ShipWeight: shipWeight,
        ShipHeight: shipHeight,
        ShipWidth: shipWidth,
        ShipLength: shipLength,
      }
      const result = await orderCloudClient.createProduct(product)
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating product: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Delete Product
server.registerTool(
  "delete_product",
  {
    title: "Delete Product",
    description: "Delete a product from OrderCloud",
    inputSchema: {
      productId: z.string(),
    },
  },
  async ({ productId }) => {
    try {
      await orderCloudClient.deleteProduct(productId)
      return {
        content: [
          {
            type: "text",
            text: `Product ${productId} deleted successfully`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting product: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)


  // add more product tools here...
}
