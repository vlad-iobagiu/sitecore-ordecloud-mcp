import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import OrderCloudClient from "../ordercloud-client.js"

export function registerPromotionTools(server: McpServer, orderCloudClient: OrderCloudClient) {

// Tool: List Promotions
server.registerTool(
  "list_promotions",
  {
    title: "List Promotions",
    description: "Retrieve a list of promotions from OrderCloud with advanced filtering, searching, and sorting",
    inputSchema: {
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
      search: z.string().optional(),
      searchOn: z
        .array(z.enum(["ID", "Name", "Code", "Description", "FinePrint", "EligibleExpression", "ValueExpression"]))
        .optional(),
      sortBy: z
        .array(
          z.enum([
            "Name",
            "ID", 
            "Code",
            "StartDate",
            "ExpirationDate",
            "EligibleExpression",
            "ValueExpression",
            "CanCombine",
            "AutoApply",
            "Active",
            "Priority",
            "!Name",
            "!ID",
            "!Code", 
            "!StartDate",
            "!ExpirationDate",
            "!EligibleExpression",
            "!ValueExpression",
            "!CanCombine",
            "!AutoApply",
            "!Active",
            "!Priority"
          ])
        )
        .optional(),
      filters: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const result = await orderCloudClient.promotions.listPromotions(input)
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
            text: `Error listing promotions: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Tool: Get Promotion by ID
server.registerTool(
  "get_promotion",
  {
    title: "Get Promotion",
    description: "Retrieve a specific promotion by ID from OrderCloud",
    inputSchema: {
      promotionId: z.string(),
    },
  },
  async ({ promotionId }) => {
    try {
      const result = await orderCloudClient.promotions.getPromotion(promotionId)
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
            text: `Error getting promotion: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Create Promotion
server.registerTool(
  "create_promotion",
  {
    title: "Create Promotion",
    description: "Create a new promotion in OrderCloud",
    inputSchema: {
      name: z.string(),
      code: z.string().min(1, "Code is required and must be at least 1 character"),
      description: z.string().optional(),
      finePrint: z.string().optional(),
      startDate: z.string().optional(),
      expirationDate: z.string().optional(),
      eligibleExpression: z.string().optional().default("true"), // Default to always eligible
      valueExpression: z.string().optional().default("0"), // Default to no discount
      canCombine: z.boolean().optional().default(false),
      allowAllBuyers: z.boolean().optional().default(false),
      autoApply: z.boolean().optional().default(false),
      active: z.boolean().optional().default(true),
      priority: z.number().optional().default(0),
      redemptionLimit: z.number().optional(),
      redemptionLimitPerUser: z.number().optional(),
      quantityLimitPerOrder: z.number().optional(),
      itemLimitPerOrder: z.number().optional(),
      itemSortBy: z.string().optional(),
      lineItemLevel: z.boolean().optional().default(false),
      useIntegration: z.boolean().optional().default(false),
      ownerID: z.string().optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      // Clean and validate the code field
      let cleanCode = input.code
      if (cleanCode) {
        // Remove spaces and invalid characters, keep only A-Z, a-z, 0-9, -, _
        cleanCode = cleanCode.replace(/[^A-Za-z0-9\-_]/g, '')
        if (cleanCode.length === 0) {
          throw new Error("Code must contain at least one valid character (A-Z, a-z, 0-9, -, _)")
        }
      }

      const promotion = {
        Name: input.name,
        Code: cleanCode, // Code is now required
        ...(input.description && { Description: input.description }),
        ...(input.finePrint && { FinePrint: input.finePrint }),
        ...(input.startDate && { StartDate: input.startDate }),
        ...(input.expirationDate && { ExpirationDate: input.expirationDate }),
        EligibleExpression: input.eligibleExpression,
        ValueExpression: input.valueExpression,
        CanCombine: input.canCombine,
        AllowAllBuyers: input.allowAllBuyers,
        AutoApply: input.autoApply,
        Active: input.active,
        Priority: input.priority,
        ...(input.redemptionLimit !== undefined && { RedemptionLimit: input.redemptionLimit }),
        ...(input.redemptionLimitPerUser !== undefined && { RedemptionLimitPerUser: input.redemptionLimitPerUser }),
        ...(input.quantityLimitPerOrder !== undefined && { QuantityLimitPerOrder: input.quantityLimitPerOrder }),
        ...(input.itemLimitPerOrder !== undefined && { ItemLimitPerOrder: input.itemLimitPerOrder }),
        ...(input.itemSortBy && { ItemSortBy: input.itemSortBy }),
        LineItemLevel: input.lineItemLevel,
        UseIntegration: input.useIntegration,
        ...(input.ownerID && { OwnerID: input.ownerID }),
        ...(input.xp && { xp: input.xp }),
      }
      const result = await orderCloudClient.promotions.createPromotion(promotion)
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
            text: `Error creating promotion: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Create Promotion Without Code
server.registerTool(
  "create_promotion_no_code",
  {
    title: "Create Promotion Without Code",
    description: "Create a new promotion in OrderCloud without a code (for auto-apply promotions)",
    inputSchema: {
      name: z.string(),
      description: z.string().optional(),
      finePrint: z.string().optional(),
      startDate: z.string().optional(),
      expirationDate: z.string().optional(),
      eligibleExpression: z.string().optional().default("true"), // Default to always eligible
      valueExpression: z.string().optional().default("0"), // Default to no discount
      canCombine: z.boolean().optional().default(false),
      allowAllBuyers: z.boolean().optional().default(false),
      autoApply: z.boolean().optional().default(true), // Default to auto-apply for no-code promotions
      active: z.boolean().optional().default(true),
      priority: z.number().optional().default(0),
      redemptionLimit: z.number().optional(),
      redemptionLimitPerUser: z.number().optional(),
      quantityLimitPerOrder: z.number().optional(),
      itemLimitPerOrder: z.number().optional(),
      itemSortBy: z.string().optional(),
      lineItemLevel: z.boolean().optional().default(false),
      useIntegration: z.boolean().optional().default(false),
      ownerID: z.string().optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const promotion = {
        Name: input.name,
        // No Code field - this is for auto-apply promotions
        ...(input.description && { Description: input.description }),
        ...(input.finePrint && { FinePrint: input.finePrint }),
        ...(input.startDate && { StartDate: input.startDate }),
        ...(input.expirationDate && { ExpirationDate: input.expirationDate }),
        EligibleExpression: input.eligibleExpression,
        ValueExpression: input.valueExpression,
        CanCombine: input.canCombine,
        AllowAllBuyers: input.allowAllBuyers,
        AutoApply: input.autoApply,
        Active: input.active,
        Priority: input.priority,
        ...(input.redemptionLimit !== undefined && { RedemptionLimit: input.redemptionLimit }),
        ...(input.redemptionLimitPerUser !== undefined && { RedemptionLimitPerUser: input.redemptionLimitPerUser }),
        ...(input.quantityLimitPerOrder !== undefined && { QuantityLimitPerOrder: input.quantityLimitPerOrder }),
        ...(input.itemLimitPerOrder !== undefined && { ItemLimitPerOrder: input.itemLimitPerOrder }),
        ...(input.itemSortBy && { ItemSortBy: input.itemSortBy }),
        LineItemLevel: input.lineItemLevel,
        UseIntegration: input.useIntegration,
        ...(input.ownerID && { OwnerID: input.ownerID }),
        ...(input.xp && { xp: input.xp }),
      }
      const result = await orderCloudClient.promotions.createPromotion(promotion)
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
            text: `Error creating promotion: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Update Promotion
server.registerTool(
  "update_promotion",
  {
    title: "Update Promotion",
    description: "Update an existing promotion in OrderCloud",
    inputSchema: {
      promotionId: z.string(),
      name: z.string().optional(),
      code: z.string().optional(),
      description: z.string().optional(),
      finePrint: z.string().optional(),
      startDate: z.string().optional(),
      expirationDate: z.string().optional(),
      eligibleExpression: z.string().optional(),
      valueExpression: z.string().optional(),
      canCombine: z.boolean().optional(),
      allowAllBuyers: z.boolean().optional(),
      autoApply: z.boolean().optional(),
      active: z.boolean().optional(),
      priority: z.number().optional(),
      redemptionLimit: z.number().optional(),
      redemptionLimitPerUser: z.number().optional(),
      quantityLimitPerOrder: z.number().optional(),
      itemLimitPerOrder: z.number().optional(),
      itemSortBy: z.string().optional(),
      lineItemLevel: z.boolean().optional(),
      useIntegration: z.boolean().optional(),
      ownerID: z.string().optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { promotionId, ...updateData } = input
      const promotion = {
        ...(updateData.name && { Name: updateData.name }),
        ...(updateData.code && { Code: updateData.code }),
        ...(updateData.description && { Description: updateData.description }),
        ...(updateData.finePrint && { FinePrint: updateData.finePrint }),
        ...(updateData.startDate && { StartDate: updateData.startDate }),
        ...(updateData.expirationDate && { ExpirationDate: updateData.expirationDate }),
        ...(updateData.eligibleExpression && { EligibleExpression: updateData.eligibleExpression }),
        ...(updateData.valueExpression && { ValueExpression: updateData.valueExpression }),
        ...(updateData.canCombine !== undefined && { CanCombine: updateData.canCombine }),
        ...(updateData.allowAllBuyers !== undefined && { AllowAllBuyers: updateData.allowAllBuyers }),
        ...(updateData.autoApply !== undefined && { AutoApply: updateData.autoApply }),
        ...(updateData.active !== undefined && { Active: updateData.active }),
        ...(updateData.priority !== undefined && { Priority: updateData.priority }),
        ...(updateData.redemptionLimit !== undefined && { RedemptionLimit: updateData.redemptionLimit }),
        ...(updateData.redemptionLimitPerUser !== undefined && { RedemptionLimitPerUser: updateData.redemptionLimitPerUser }),
        ...(updateData.quantityLimitPerOrder !== undefined && { QuantityLimitPerOrder: updateData.quantityLimitPerOrder }),
        ...(updateData.itemLimitPerOrder !== undefined && { ItemLimitPerOrder: updateData.itemLimitPerOrder }),
        ...(updateData.itemSortBy && { ItemSortBy: updateData.itemSortBy }),
        ...(updateData.lineItemLevel !== undefined && { LineItemLevel: updateData.lineItemLevel }),
        ...(updateData.useIntegration !== undefined && { UseIntegration: updateData.useIntegration }),
        ...(updateData.ownerID && { OwnerID: updateData.ownerID }),
        ...(updateData.xp && { xp: updateData.xp }),
      }
      const result = await orderCloudClient.promotions.updatePromotion(promotionId, promotion)
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
            text: `Error updating promotion: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Delete Promotion
server.registerTool(
  "delete_promotion",
  {
    title: "Delete Promotion",
    description: "Delete a promotion from OrderCloud",
    inputSchema: {
      promotionId: z.string(),
    },
  },
  async ({ promotionId }) => {
    try {
      await orderCloudClient.promotions.deletePromotion(promotionId)
      return {
        content: [
          {
            type: "text",
            text: `Promotion ${promotionId} deleted successfully`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting promotion: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

}
