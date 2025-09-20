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
}
