
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from "zod";
import OrderCloudClient from "./tools/ordercloud-client.js";

// Create OrderCloud client instance
import dotenv from "dotenv";
dotenv.config();

// Environment variables for OrderCloud credentials
const ORDERCLOUD_USERNAME = process.env.ORDERCLOUD_USERNAME
const ORDERCLOUD_PASSWORD = process.env.ORDERCLOUD_PASSWORD
const ORDERCLOUD_CLIENT_ID = process.env.ORDERCLOUD_CLIENT_ID
const ORDERCLOUD_SCOPE = process.env.ORDERCLOUD_SCOPE || "FullAccess"

if (!ORDERCLOUD_USERNAME || !ORDERCLOUD_PASSWORD || !ORDERCLOUD_CLIENT_ID) {
  console.error(
    "Missing required environment variables: ORDERCLOUD_USERNAME, ORDERCLOUD_PASSWORD, ORDERCLOUD_CLIENT_ID",
  )
  process.exit(1)
}

// Initialize OrderCloud client
const orderCloudClient = new OrderCloudClient(
  ORDERCLOUD_USERNAME,
  ORDERCLOUD_PASSWORD,
  ORDERCLOUD_CLIENT_ID,
  ORDERCLOUD_SCOPE,
)


const server = new McpServer({
  name: "Weather Server",
  version: "1.0.0"
});

  // Authentication tool
server.registerTool(
  "authenticate",
  {
    title: "Authenticate with Sitecore OrderCloud",
    description: "Authenticate with OrderCloud using username, client ID, and password",
    inputSchema: {
      username: z.string().describe("OrderCloud username"),
      clientId: z.string().describe("OrderCloud client ID"),
      password: z.string().describe("OrderCloud password"),
    },
  },
  async ({ username, clientId, password }) => {
    try {
      console.log("Authenticating with OrderCloud...");
      await orderCloudClient.authenticate(username, clientId, password)
      return {
        content: [
          {
            type: "text",
            text: "Successfully authenticated with Sitecore OrderCloud",
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Authentication failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
      }
    }
  },
)


// Tool: Get Catalogs
server.registerTool(
  "get_catalogs",
  {
    title: "Get Catalogs",
    description: "Retrieve a list of catalogs from OrderCloud",
    inputSchema: {
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
    },
  },
  async ({ page, pageSize }) => {
    try {
      const result = await orderCloudClient.getCatalogs(page, pageSize)
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
            text: `Error getting catalogs: ${error instanceof Error ? error.message : String(error)}`,
          },
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
      const result = await orderCloudClient.getCatalog(catalogId)
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
            text: `Error getting catalog: ${error instanceof Error ? error.message : String(error)}`,
          },
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
      const catalog = {
        ID: id,
        Name: name,
        Description: description,
        Active: active,
      }
      const result = await orderCloudClient.createCatalog(catalog)
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
            text: `Error creating catalog: ${error instanceof Error ? error.message : String(error)}`,
          },
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
      await orderCloudClient.deleteCatalog(catalogId)
      return {
        content: [
          {
            type: "text",
            text: `Catalog ${catalogId} deleted successfully`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting catalog: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

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







  const transport = new StdioServerTransport();
server.connect(transport);