import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import OrderCloudClient from "../ordercloud-client.js"
import { DebugLogger } from "../utils/debug.js"

export function registerDebugTools(server: McpServer, orderCloudClient: OrderCloudClient) {
  
  // Tool: Get Debug Logs
  server.registerTool("get_debug_logs", {
    title: "Get Debug Logs",
    description: "Retrieve recent debug logs from the MCP server",
    inputSchema: {
      includeParams: z.boolean().optional().default(false),
      includeResults: z.boolean().optional().default(false),
      maxLogs: z.number().optional().default(10),
    },
  }, async ({ includeParams, includeResults, maxLogs }) => {
    try {
      const logs = DebugLogger.getLogs().slice(-maxLogs)
      const filteredLogs = logs.map(log => ({
        timestamp: log.timestamp,
        operation: log.operation,
        duration: log.duration,
        error: log.error ? {
          message: log.error.message,
          stack: log.error.stack
        } : undefined,
        ...(includeParams && { params: log.params }),
        ...(includeResults && { result: log.result })
      }))

      return {
        content: [
          {
            type: "text",
            text: `DEBUG LOGS (last ${maxLogs}):\n${JSON.stringify(filteredLogs, null, 2)}`
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting debug logs: ${error instanceof Error ? error.message : String(error)}`
          }
        ],
        isError: true
      }
    }
  })

  // Tool: Clear Debug Logs
  server.registerTool("clear_debug_logs", {
    title: "Clear Debug Logs",
    description: "Clear all debug logs from memory",
    inputSchema: {},
  }, async () => {
    try {
      DebugLogger.clearLogs()
      return {
        content: [
          {
            type: "text",
            text: "Debug logs cleared successfully"
          }
        ]
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error clearing debug logs: ${error instanceof Error ? error.message : String(error)}`
          }
        ],
        isError: true
      }
    }
  })

  // Tool: Test API Connection
  server.registerTool("test_api_connection", {
    title: "Test API Connection",
    description: "Test the connection to OrderCloud API and return debug information",
    inputSchema: {},
  }, async () => {
    try {
      const startTime = Date.now()
      
      // Test authentication - we need credentials for this
      // For now, just check if we have an access token
      const hasToken = orderCloudClient.auth.getAccessToken() !== null
      const authDuration = Date.now() - startTime
      
      // Test a simple API call
      const apiStartTime = Date.now()
      const productsResult = await orderCloudClient.products.getProducts(1, 1)
      const apiDuration = Date.now() - apiStartTime
      
      const debugInfo = {
        timestamp: new Date().toISOString(),
        authentication: {
          success: hasToken,
          duration: authDuration,
          accessToken: hasToken ? "Present" : "Missing"
        },
        apiTest: {
          success: true,
          duration: apiDuration,
          productsFound: productsResult.Items?.length || 0,
          totalProducts: productsResult.Meta?.TotalCount || 0
        }
      }

      DebugLogger.log("test_api_connection", {}, debugInfo, undefined, Date.now() - startTime)

      return {
        content: [
          {
            type: "text",
            text: `API CONNECTION TEST:\n${JSON.stringify(debugInfo, null, 2)}`
          }
        ]
      }
    } catch (error) {
      const debugInfo = {
        timestamp: new Date().toISOString(),
        error: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      }

      DebugLogger.log("test_api_connection", {}, undefined, error as Error, Date.now())

      return {
        content: [
          {
            type: "text",
            text: `API CONNECTION TEST FAILED:\n${JSON.stringify(debugInfo, null, 2)}`
          }
        ],
        isError: true
      }
    }
  })

  // Tool: Debug Product List
  server.registerTool("debug_product_list", {
    title: "Debug Product List",
    description: "Debug the listProducts method with detailed logging",
    inputSchema: {
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(5),
      catalogID: z.string().optional(),
      categoryID: z.string().optional(),
      supplierID: z.string().optional(),
      search: z.string().optional(),
      searchOn: z.array(z.enum(["ID", "ParentID", "Name", "Description"])).optional(),
      searchType: z.enum([
        "AnyTerm",
        "AllTermsAnyField", 
        "AllTermsSameField",
        "ExactPhrase",
        "ExactPhrasePrefix"
      ]).optional(),
      sortBy: z.array(z.enum([
        "OwnerID", "Name", "ID", "ParentID",
        "!OwnerID", "!Name", "!ID", "!ParentID"
      ])).optional(),
      filters: z.record(z.any()).optional(),
    },
  }, async (input) => {
    try {
      const startTime = Date.now()
      
      DebugLogger.log("debug_product_list_start", input)
      
      // Test authentication first
      if (!orderCloudClient.auth.getAccessToken()) {
        throw new Error("Not authenticated. Please authenticate first.")
      }
      
      // Build params step by step for debugging
      const params: any = {}
      
      if (input.catalogID) {
        params.catalogID = input.catalogID
        DebugLogger.log("debug_product_list_param", { catalogID: input.catalogID })
      }
      
      if (input.categoryID) {
        params.categoryID = input.categoryID
        DebugLogger.log("debug_product_list_param", { categoryID: input.categoryID })
      }
      
      if (input.supplierID) {
        params.supplierID = input.supplierID
        DebugLogger.log("debug_product_list_param", { supplierID: input.supplierID })
      }
      
      if (input.search) {
        params.search = input.search
        DebugLogger.log("debug_product_list_param", { search: input.search })
      }
      
      if (input.searchOn && input.searchOn.length > 0) {
        params.searchOn = input.searchOn.join(",")
        DebugLogger.log("debug_product_list_param", { searchOn: params.searchOn })
      }
      
      if (input.searchType) {
        params.searchType = input.searchType
        DebugLogger.log("debug_product_list_param", { searchType: input.searchType })
      }
      
      if (input.sortBy && input.sortBy.length > 0) {
        params.sortBy = input.sortBy.join(",")
        DebugLogger.log("debug_product_list_param", { sortBy: params.sortBy })
      }
      
      if (input.page) {
        params.page = input.page
        DebugLogger.log("debug_product_list_param", { page: input.page })
      }
      
      if (input.pageSize) {
        params.pageSize = input.pageSize
        DebugLogger.log("debug_product_list_param", { pageSize: input.pageSize })
      }
      
      if (input.filters) {
        Object.entries(input.filters).forEach(([key, value]) => {
          params[`filters[${key}]`] = value
        })
        DebugLogger.log("debug_product_list_param", { filters: input.filters })
      }
      
      DebugLogger.log("debug_product_list_final_params", params)
      
      // Make the API call
      const response = await orderCloudClient.products.getClient().get("v1/products", { params })
      const duration = Date.now() - startTime
      
      const result = {
        success: true,
        duration,
        params,
        response: {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers
        }
      }
      
      DebugLogger.log("debug_product_list_success", input, result, undefined, duration)
      
      return {
        content: [
          {
            type: "text",
            text: `DEBUG PRODUCT LIST RESULT:\n${JSON.stringify(result, null, 2)}`
          }
        ]
      }
    } catch (error) {
      const duration = Date.now() - Date.now()
      const errorResult = {
        success: false,
        duration,
        error: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          response: (error as any)?.response ? {
            status: (error as any).response.status,
            statusText: (error as any).response.statusText,
            data: (error as any).response.data,
            headers: (error as any).response.headers
          } : undefined
        }
      }
      
      DebugLogger.log("debug_product_list_error", input, undefined, error as Error, duration)
      
      return {
        content: [
          {
            type: "text",
            text: `DEBUG PRODUCT LIST ERROR:\n${JSON.stringify(errorResult, null, 2)}`
          }
        ],
        isError: true
      }
    }
  })

  // Tool: Debug Promotion Creation
  server.registerTool("debug_promotion_creation", {
    title: "Debug Promotion Creation",
    description: "Debug the createPromotion method with detailed logging and error information",
    inputSchema: {
      name: z.string(),
      code: z.string().optional(),
      description: z.string().optional(),
      finePrint: z.string().optional(),
      startDate: z.string().optional(),
      expirationDate: z.string().optional(),
      eligibleExpression: z.string().optional(),
      valueExpression: z.string().optional(),
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
  }, async (input) => {
    try {
      const startTime = Date.now()
      
      DebugLogger.log("debug_promotion_creation_start", input)
      
      // Test authentication first
      if (!orderCloudClient.auth.getAccessToken()) {
        throw new Error("Not authenticated. Please authenticate first.")
      }
      
      // Build promotion object step by step for debugging
      const promotion: any = {}
      
      if (input.name) {
        promotion.Name = input.name
        DebugLogger.log("debug_promotion_creation_field", { Name: input.name })
      }
      
      if (input.code) {
        promotion.Code = input.code
        DebugLogger.log("debug_promotion_creation_field", { Code: input.code })
      }
      
      if (input.description) {
        promotion.Description = input.description
        DebugLogger.log("debug_promotion_creation_field", { Description: input.description })
      }
      
      if (input.finePrint) {
        promotion.FinePrint = input.finePrint
        DebugLogger.log("debug_promotion_creation_field", { FinePrint: input.finePrint })
      }
      
      if (input.startDate) {
        promotion.StartDate = input.startDate
        DebugLogger.log("debug_promotion_creation_field", { StartDate: input.startDate })
      }
      
      if (input.expirationDate) {
        promotion.ExpirationDate = input.expirationDate
        DebugLogger.log("debug_promotion_creation_field", { ExpirationDate: input.expirationDate })
      }
      
      if (input.eligibleExpression) {
        promotion.EligibleExpression = input.eligibleExpression
        DebugLogger.log("debug_promotion_creation_field", { EligibleExpression: input.eligibleExpression })
      }
      
      if (input.valueExpression) {
        promotion.ValueExpression = input.valueExpression
        DebugLogger.log("debug_promotion_creation_field", { ValueExpression: input.valueExpression })
      }
      
      if (input.canCombine !== undefined) {
        promotion.CanCombine = input.canCombine
        DebugLogger.log("debug_promotion_creation_field", { CanCombine: input.canCombine })
      }
      
      if (input.allowAllBuyers !== undefined) {
        promotion.AllowAllBuyers = input.allowAllBuyers
        DebugLogger.log("debug_promotion_creation_field", { AllowAllBuyers: input.allowAllBuyers })
      }
      
      if (input.autoApply !== undefined) {
        promotion.AutoApply = input.autoApply
        DebugLogger.log("debug_promotion_creation_field", { AutoApply: input.autoApply })
      }
      
      if (input.active !== undefined) {
        promotion.Active = input.active
        DebugLogger.log("debug_promotion_creation_field", { Active: input.active })
      }
      
      if (input.priority !== undefined) {
        promotion.Priority = input.priority
        DebugLogger.log("debug_promotion_creation_field", { Priority: input.priority })
      }
      
      if (input.redemptionLimit !== undefined) {
        promotion.RedemptionLimit = input.redemptionLimit
        DebugLogger.log("debug_promotion_creation_field", { RedemptionLimit: input.redemptionLimit })
      }
      
      if (input.redemptionLimitPerUser !== undefined) {
        promotion.RedemptionLimitPerUser = input.redemptionLimitPerUser
        DebugLogger.log("debug_promotion_creation_field", { RedemptionLimitPerUser: input.redemptionLimitPerUser })
      }
      
      if (input.quantityLimitPerOrder !== undefined) {
        promotion.QuantityLimitPerOrder = input.quantityLimitPerOrder
        DebugLogger.log("debug_promotion_creation_field", { QuantityLimitPerOrder: input.quantityLimitPerOrder })
      }
      
      if (input.itemLimitPerOrder !== undefined) {
        promotion.ItemLimitPerOrder = input.itemLimitPerOrder
        DebugLogger.log("debug_promotion_creation_field", { ItemLimitPerOrder: input.itemLimitPerOrder })
      }
      
      if (input.itemSortBy) {
        promotion.ItemSortBy = input.itemSortBy
        DebugLogger.log("debug_promotion_creation_field", { ItemSortBy: input.itemSortBy })
      }
      
      if (input.lineItemLevel !== undefined) {
        promotion.LineItemLevel = input.lineItemLevel
        DebugLogger.log("debug_promotion_creation_field", { LineItemLevel: input.lineItemLevel })
      }
      
      if (input.useIntegration !== undefined) {
        promotion.UseIntegration = input.useIntegration
        DebugLogger.log("debug_promotion_creation_field", { UseIntegration: input.useIntegration })
      }
      
      if (input.ownerID) {
        promotion.OwnerID = input.ownerID
        DebugLogger.log("debug_promotion_creation_field", { OwnerID: input.ownerID })
      }
      
      if (input.xp) {
        promotion.xp = input.xp
        DebugLogger.log("debug_promotion_creation_field", { xp: input.xp })
      }
      
      DebugLogger.log("debug_promotion_creation_final_promotion", promotion)
      
      // Make the API call
      const response = await orderCloudClient.promotions.getClient().post("v1/promotions", promotion)
      const duration = Date.now() - startTime
      
      const result = {
        success: true,
        duration,
        promotion,
        response: {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers
        }
      }
      
      DebugLogger.log("debug_promotion_creation_success", input, result, undefined, duration)
      
      return {
        content: [
          {
            type: "text",
            text: `DEBUG PROMOTION CREATION RESULT:\n${JSON.stringify(result, null, 2)}`
          }
        ]
      }
    } catch (error) {
      const duration = Date.now() - Date.now()
      const errorResult = {
        success: false,
        duration,
        input,
        error: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          response: (error as any)?.response ? {
            status: (error as any).response.status,
            statusText: (error as any).response.statusText,
            data: (error as any).response.data,
            headers: (error as any).response.headers
          } : undefined
        }
      }
      
      DebugLogger.log("debug_promotion_creation_error", input, undefined, error as Error, duration)
      
      return {
        content: [
          {
            type: "text",
            text: `DEBUG PROMOTION CREATION ERROR:\n${JSON.stringify(errorResult, null, 2)}`
          }
        ],
        isError: true
      }
    }
  })

  // Tool: Test Simple Promotion Creation
  server.registerTool("test_simple_promotion", {
    title: "Test Simple Promotion Creation",
    description: "Test creating a promotion with minimal required fields to diagnose 400 errors",
    inputSchema: {
      name: z.string().default("Test Promotion"),
      code: z.string().optional(),
      includeCode: z.boolean().optional().default(true),
    },
  }, async (input) => {
    try {
      const startTime = Date.now()
      
      DebugLogger.log("test_simple_promotion_start", input)
      
      // Test authentication first
      if (!orderCloudClient.auth.getAccessToken()) {
        throw new Error("Not authenticated. Please authenticate first.")
      }
      
      // Clean and validate the code field
      let cleanCode = input.code
      if (input.includeCode && cleanCode) {
        // Remove spaces and invalid characters, keep only A-Z, a-z, 0-9, -, _
        cleanCode = cleanCode.replace(/[^A-Za-z0-9\-_]/g, '')
        if (cleanCode.length === 0) {
          cleanCode = undefined // Remove empty codes
        }
      } else if (!input.includeCode) {
        cleanCode = undefined // Don't include code field at all
      }

      // Create minimal promotion object with required fields
      const promotion: any = {
        Name: input.name,
        // Required fields based on the error
        EligibleExpression: "true", // Always eligible
        ValueExpression: "0", // No discount
        // Try with minimal required fields first
        Active: true,
        CanCombine: false,
        AllowAllBuyers: true,
        AutoApply: false,
        Priority: 0,
        LineItemLevel: false,
        UseIntegration: false
      }

      // Only add Code if we have a valid one
      if (cleanCode) {
        promotion.Code = cleanCode
      }
      
      DebugLogger.log("test_simple_promotion_object", promotion)
      
      // Make the API call
      const response = await orderCloudClient.promotions.getClient().post("v1/promotions", promotion)
      const duration = Date.now() - startTime
      
      const result = {
        success: true,
        duration,
        promotion,
        response: {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers
        }
      }
      
      DebugLogger.log("test_simple_promotion_success", input, result, undefined, duration)
      
      return {
        content: [
          {
            type: "text",
            text: `SIMPLE PROMOTION TEST SUCCESS:\n${JSON.stringify(result, null, 2)}`
          }
        ]
      }
    } catch (error) {
      const duration = Date.now() - Date.now()
      const errorResult = {
        success: false,
        duration,
        input,
        error: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          response: (error as any)?.response ? {
            status: (error as any).response.status,
            statusText: (error as any).response.statusText,
            data: (error as any).response.data,
            headers: (error as any).response.headers
          } : undefined
        }
      }
      
      DebugLogger.log("test_simple_promotion_error", input, undefined, error as Error, duration)
      
      return {
        content: [
          {
            type: "text",
            text: `SIMPLE PROMOTION TEST ERROR:\n${JSON.stringify(errorResult, null, 2)}`
          }
        ],
        isError: true
      }
    }
  })
}
