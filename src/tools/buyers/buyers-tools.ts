import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import OrderCloudClient from "../ordercloud-client.js"

export function registerBuyerTools(server: McpServer, orderCloudClient: OrderCloudClient) {

// Tool: List Buyers
server.registerTool(
  "list_buyers",
  {
    title: "List Buyers",
    description: "Retrieve a list of buyers from OrderCloud with advanced filtering, searching, and sorting",
    inputSchema: {
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
      search: z.string().optional(),
      searchOn: z
        .array(z.enum(["ID", "Name"]))
        .optional(),
      sortBy: z
        .array(
          z.enum([
            "Name",
            "ID",
            "!Name",
            "!ID"
          ])
        )
        .optional(),
      filters: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const result = await orderCloudClient.buyers.listBuyers(input)
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
            text: `Error listing buyers: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Tool: Get Buyer by ID
server.registerTool(
  "get_buyer",
  {
    title: "Get Buyer",
    description: "Retrieve a specific buyer by ID from OrderCloud",
    inputSchema: {
      buyerId: z.string(),
    },
  },
  async ({ buyerId }) => {
    try {
      const result = await orderCloudClient.buyers.getBuyer(buyerId)
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
            text: `Error getting buyer: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Create Buyer
server.registerTool(
  "create_buyer",
  {
    title: "Create Buyer",
    description: "Create a new buyer organization in OrderCloud",
    inputSchema: {
      id: z.string().optional(),
      name: z.string(),
      active: z.boolean().optional().default(true),
      defaultCatalogId: z.string().optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const buyer = {
        ...(input.id && { ID: input.id }),
        Name: input.name,
        Active: input.active,
        ...(input.defaultCatalogId && { DefaultCatalogID: input.defaultCatalogId }),
        ...(input.xp && { xp: input.xp }),
      }
      const result = await orderCloudClient.buyers.createBuyer(buyer)
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
            text: `Error creating buyer: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Update Buyer (Full Update)
server.registerTool(
  "update_buyer",
  {
    title: "Update Buyer",
    description: "Update an existing buyer in OrderCloud (full update - PUT)",
    inputSchema: {
      buyerId: z.string(),
      id: z.string().optional(),
      name: z.string().optional(),
      active: z.boolean().optional(),
      defaultCatalogId: z.string().optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { buyerId, ...updateData } = input
      const buyer: any = {}
      
      if (updateData.id) buyer.ID = updateData.id
      if (updateData.name !== undefined) buyer.Name = updateData.name
      if (updateData.active !== undefined) buyer.Active = updateData.active
      if (updateData.defaultCatalogId) buyer.DefaultCatalogID = updateData.defaultCatalogId
      if (updateData.xp) buyer.xp = updateData.xp
      
      const result = await orderCloudClient.buyers.updateBuyer(buyerId, buyer)
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
            text: `Error updating buyer: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Patch Buyer (Partial Update)
server.registerTool(
  "patch_buyer",
  {
    title: "Patch Buyer",
    description: "Partially update an existing buyer in OrderCloud (PATCH)",
    inputSchema: {
      buyerId: z.string(),
      id: z.string().optional(),
      name: z.string().optional(),
      active: z.boolean().optional(),
      defaultCatalogId: z.string().optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { buyerId, ...updateData } = input
      const buyer = {
        ...(updateData.id && { ID: updateData.id }),
        ...(updateData.name && { Name: updateData.name }),
        ...(updateData.active !== undefined && { Active: updateData.active }),
        ...(updateData.defaultCatalogId && { DefaultCatalogID: updateData.defaultCatalogId }),
        ...(updateData.xp && { xp: updateData.xp }),
      }
      const result = await orderCloudClient.buyers.patchBuyer(buyerId, buyer)
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
            text: `Error patching buyer: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Delete Buyer
server.registerTool(
  "delete_buyer",
  {
    title: "Delete Buyer",
    description: "Delete a buyer organization from OrderCloud",
    inputSchema: {
      buyerId: z.string(),
    },
  },
  async ({ buyerId }) => {
    try {
      await orderCloudClient.buyers.deleteBuyer(buyerId)
      return {
        content: [
          {
            type: "text",
            text: `Buyer ${buyerId} deleted successfully`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting buyer: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: List Buyer Sellers
server.registerTool(
  "list_buyer_sellers",
  {
    title: "List Buyer Sellers",
    description: "List sellers that a specific buyer can purchase from",
    inputSchema: {
      buyerId: z.string(),
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
      search: z.string().optional(),
      searchOn: z
        .array(z.enum(["ID", "Name"]))
        .optional(),
      sortBy: z
        .array(
          z.enum([
            "Name",
            "ID",
            "!Name",
            "!ID"
          ])
        )
        .optional(),
      filters: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { buyerId, ...options } = input
      const result = await orderCloudClient.buyers.listBuyerSellers(buyerId, options)
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
            text: `Error listing buyer sellers: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      }
    }
  }
)

}
