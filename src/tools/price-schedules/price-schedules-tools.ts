import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import OrderCloudClient from "../ordercloud-client.js"

export function registerPriceScheduleTools(server: McpServer, orderCloudClient: OrderCloudClient) {

// Tool: List Price Schedules
server.registerTool(
  "list_price_schedules",
  {
    title: "List Price Schedules",
    description: "Retrieve a list of price schedules from OrderCloud with advanced filtering, searching, and sorting",
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
      const result = await orderCloudClient.priceSchedules.listPriceSchedules(input)
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
            text: `Error listing price schedules: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Tool: Get Price Schedule by ID
server.registerTool(
  "get_price_schedule",
  {
    title: "Get Price Schedule",
    description: "Retrieve a specific price schedule by ID from OrderCloud",
    inputSchema: {
      priceScheduleId: z.string(),
    },
  },
  async ({ priceScheduleId }) => {
    try {
      const result = await orderCloudClient.priceSchedules.getPriceSchedule(priceScheduleId)
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
            text: `Error getting price schedule: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Create Price Schedule
server.registerTool(
  "create_price_schedule",
  {
    title: "Create Price Schedule",
    description: "Create a new price schedule in OrderCloud",
    inputSchema: {
      id: z.string().optional(),
      name: z.string(),
      description: z.string().optional(),
      minQuantity: z.number().optional(),
      maxQuantity: z.number().optional(),
      useCumulativeQuantity: z.boolean().optional().default(false),
      restrictedToQuantity: z.boolean().optional().default(false),
      orderType: z.enum(["Standard", "RFQ"]).optional().default("Standard"),
      applyTax: z.boolean().optional().default(true),
      applyShipping: z.boolean().optional().default(true),
      active: z.boolean().optional().default(true),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const priceSchedule = {
        ...(input.id && { ID: input.id }),
        Name: input.name,
        ...(input.description && { Description: input.description }),
        ...(input.minQuantity !== undefined && { MinQuantity: input.minQuantity }),
        ...(input.maxQuantity !== undefined && { MaxQuantity: input.maxQuantity }),
        UseCumulativeQuantity: input.useCumulativeQuantity,
        RestrictedToQuantity: input.restrictedToQuantity,
        OrderType: input.orderType,
        ApplyTax: input.applyTax,
        ApplyShipping: input.applyShipping,
        Active: input.active,
        ...(input.xp && { xp: input.xp }),
      }
      const result = await orderCloudClient.priceSchedules.createPriceSchedule(priceSchedule)
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
            text: `Error creating price schedule: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Update Price Schedule (Full Update)
server.registerTool(
  "update_price_schedule",
  {
    title: "Update Price Schedule",
    description: "Update an existing price schedule in OrderCloud (full update - PUT)",
    inputSchema: {
      priceScheduleId: z.string(),
      id: z.string().optional(),
      name: z.string().optional(),
      description: z.string().optional(),
      minQuantity: z.number().optional(),
      maxQuantity: z.number().optional(),
      useCumulativeQuantity: z.boolean().optional(),
      restrictedToQuantity: z.boolean().optional(),
      orderType: z.enum(["Standard", "RFQ"]).optional(),
      applyTax: z.boolean().optional(),
      applyShipping: z.boolean().optional(),
      active: z.boolean().optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { priceScheduleId, ...updateData } = input
      const priceSchedule: any = {}
      
      if (updateData.id) priceSchedule.ID = updateData.id
      if (updateData.name) priceSchedule.Name = updateData.name
      if (updateData.description) priceSchedule.Description = updateData.description
      if (updateData.minQuantity !== undefined) priceSchedule.MinQuantity = updateData.minQuantity
      if (updateData.maxQuantity !== undefined) priceSchedule.MaxQuantity = updateData.maxQuantity
      if (updateData.useCumulativeQuantity !== undefined) priceSchedule.UseCumulativeQuantity = updateData.useCumulativeQuantity
      if (updateData.restrictedToQuantity !== undefined) priceSchedule.RestrictedToQuantity = updateData.restrictedToQuantity
      if (updateData.orderType) priceSchedule.OrderType = updateData.orderType
      if (updateData.applyTax !== undefined) priceSchedule.ApplyTax = updateData.applyTax
      if (updateData.applyShipping !== undefined) priceSchedule.ApplyShipping = updateData.applyShipping
      if (updateData.active !== undefined) priceSchedule.Active = updateData.active
      if (updateData.xp) priceSchedule.xp = updateData.xp
      
      const result = await orderCloudClient.priceSchedules.updatePriceSchedule(priceScheduleId, priceSchedule)
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
            text: `Error updating price schedule: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Patch Price Schedule (Partial Update)
server.registerTool(
  "patch_price_schedule",
  {
    title: "Patch Price Schedule",
    description: "Partially update an existing price schedule in OrderCloud (PATCH)",
    inputSchema: {
      priceScheduleId: z.string(),
      id: z.string().optional(),
      name: z.string().optional(),
      description: z.string().optional(),
      minQuantity: z.number().optional(),
      maxQuantity: z.number().optional(),
      useCumulativeQuantity: z.boolean().optional(),
      restrictedToQuantity: z.boolean().optional(),
      orderType: z.enum(["Standard", "RFQ"]).optional(),
      applyTax: z.boolean().optional(),
      applyShipping: z.boolean().optional(),
      active: z.boolean().optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { priceScheduleId, ...updateData } = input
      const priceSchedule: any = {}
      
      if (updateData.id) priceSchedule.ID = updateData.id
      if (updateData.name) priceSchedule.Name = updateData.name
      if (updateData.description) priceSchedule.Description = updateData.description
      if (updateData.minQuantity !== undefined) priceSchedule.MinQuantity = updateData.minQuantity
      if (updateData.maxQuantity !== undefined) priceSchedule.MaxQuantity = updateData.maxQuantity
      if (updateData.useCumulativeQuantity !== undefined) priceSchedule.UseCumulativeQuantity = updateData.useCumulativeQuantity
      if (updateData.restrictedToQuantity !== undefined) priceSchedule.RestrictedToQuantity = updateData.restrictedToQuantity
      if (updateData.orderType) priceSchedule.OrderType = updateData.orderType
      if (updateData.applyTax !== undefined) priceSchedule.ApplyTax = updateData.applyTax
      if (updateData.applyShipping !== undefined) priceSchedule.ApplyShipping = updateData.applyShipping
      if (updateData.active !== undefined) priceSchedule.Active = updateData.active
      if (updateData.xp) priceSchedule.xp = updateData.xp
      
      const result = await orderCloudClient.priceSchedules.patchPriceSchedule(priceScheduleId, priceSchedule)
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
            text: `Error patching price schedule: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Delete Price Schedule
server.registerTool(
  "delete_price_schedule",
  {
    title: "Delete Price Schedule",
    description: "Delete a price schedule from OrderCloud",
    inputSchema: {
      priceScheduleId: z.string(),
    },
  },
  async ({ priceScheduleId }) => {
    try {
      await orderCloudClient.priceSchedules.deletePriceSchedule(priceScheduleId)
      return {
        content: [
          {
            type: "text",
            text: `Price schedule ${priceScheduleId} deleted successfully`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting price schedule: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Save Price Break
server.registerTool(
  "save_price_break",
  {
    title: "Save Price Break",
    description: "Create or update a price break for a price schedule",
    inputSchema: {
      priceScheduleId: z.string(),
      quantity: z.number(),
      price: z.number(),
      salePrice: z.number().optional(),
    },
  },
  async (input) => {
    try {
      const { priceScheduleId, ...priceBreakData } = input
      const priceBreak = {
        Quantity: priceBreakData.quantity,
        Price: priceBreakData.price,
        ...(priceBreakData.salePrice && { SalePrice: priceBreakData.salePrice }),
      }
      const result = await orderCloudClient.priceSchedules.savePriceBreak(priceScheduleId, priceBreak)
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
            text: `Error saving price break: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Delete Price Break
server.registerTool(
  "delete_price_break",
  {
    title: "Delete Price Break",
    description: "Delete a price break from a price schedule",
    inputSchema: {
      priceScheduleId: z.string(),
      quantity: z.number(),
    },
  },
  async (input) => {
    try {
      const { priceScheduleId, quantity } = input
      await orderCloudClient.priceSchedules.deletePriceBreak(priceScheduleId, quantity)
      return {
        content: [
          {
            type: "text",
            text: `Price break with quantity ${quantity} deleted successfully from price schedule ${priceScheduleId}`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting price break: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

}
