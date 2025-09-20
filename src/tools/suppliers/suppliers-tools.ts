import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import OrderCloudClient from "../ordercloud-client.js"

export function registerSupplierTools(server: McpServer, orderCloudClient: OrderCloudClient) {

// Tool: List Suppliers
server.registerTool(
  "list_suppliers",
  {
    title: "List Suppliers",
    description: "Retrieve a list of suppliers from OrderCloud with advanced filtering, searching, and sorting",
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
      const result = await orderCloudClient.suppliers.listSuppliers(input)
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
            text: `Error listing suppliers: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Tool: Get Supplier by ID
server.registerTool(
  "get_supplier",
  {
    title: "Get Supplier",
    description: "Retrieve a specific supplier by ID from OrderCloud",
    inputSchema: {
      supplierId: z.string(),
    },
  },
  async ({ supplierId }) => {
    try {
      const result = await orderCloudClient.suppliers.getSupplier(supplierId)
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
            text: `Error getting supplier: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Create Supplier
server.registerTool(
  "create_supplier",
  {
    title: "Create Supplier",
    description: "Create a new supplier organization in OrderCloud",
    inputSchema: {
      id: z.string().optional(),
      name: z.string(),
      active: z.boolean().optional().default(true),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const supplier = {
        ...(input.id && { ID: input.id }),
        Name: input.name,
        Active: input.active,
        ...(input.xp && { xp: input.xp }),
      }
      const result = await orderCloudClient.suppliers.createSupplier(supplier)
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
            text: `Error creating supplier: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Update Supplier (Full Update)
server.registerTool(
  "update_supplier",
  {
    title: "Update Supplier",
    description: "Update an existing supplier in OrderCloud (full update - PUT)",
    inputSchema: {
      supplierId: z.string(),
      id: z.string().optional(),
      name: z.string().optional(),
      active: z.boolean().optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { supplierId, ...updateData } = input
      const supplier: any = {}
      
      if (updateData.id) supplier.ID = updateData.id
      if (updateData.name) supplier.Name = updateData.name
      if (updateData.active !== undefined) supplier.Active = updateData.active
      if (updateData.xp) supplier.xp = updateData.xp
      
      const result = await orderCloudClient.suppliers.updateSupplier(supplierId, supplier)
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
            text: `Error updating supplier: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Patch Supplier (Partial Update)
server.registerTool(
  "patch_supplier",
  {
    title: "Patch Supplier",
    description: "Partially update an existing supplier in OrderCloud (PATCH)",
    inputSchema: {
      supplierId: z.string(),
      id: z.string().optional(),
      name: z.string().optional(),
      active: z.boolean().optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { supplierId, ...updateData } = input
      const supplier: any = {}
      
      if (updateData.id) supplier.ID = updateData.id
      if (updateData.name) supplier.Name = updateData.name
      if (updateData.active !== undefined) supplier.Active = updateData.active
      if (updateData.xp) supplier.xp = updateData.xp
      
      const result = await orderCloudClient.suppliers.patchSupplier(supplierId, supplier)
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
            text: `Error patching supplier: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Delete Supplier
server.registerTool(
  "delete_supplier",
  {
    title: "Delete Supplier",
    description: "Delete a supplier organization from OrderCloud",
    inputSchema: {
      supplierId: z.string(),
    },
  },
  async ({ supplierId }) => {
    try {
      await orderCloudClient.suppliers.deleteSupplier(supplierId)
      return {
        content: [
          {
            type: "text",
            text: `Supplier ${supplierId} deleted successfully`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting supplier: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: List Supplier Buyers
server.registerTool(
  "list_supplier_buyers",
  {
    title: "List Supplier Buyers",
    description: "List buyers that a specific supplier can sell to",
    inputSchema: {
      supplierId: z.string(),
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
      const { supplierId, ...options } = input
      const result = await orderCloudClient.suppliers.listSupplierBuyers(supplierId, options)
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
            text: `Error listing supplier buyers: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Tool: Save Supplier Buyer
server.registerTool(
  "save_supplier_buyer",
  {
    title: "Save Supplier Buyer",
    description: "Create or update a buyer relationship for a supplier",
    inputSchema: {
      supplierId: z.string(),
      buyerId: z.string(),
      buyerData: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { supplierId, buyerId, buyerData = {} } = input
      const result = await orderCloudClient.suppliers.saveSupplierBuyer(supplierId, buyerId, buyerData)
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
            text: `Error saving supplier buyer: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Delete Supplier Buyer
server.registerTool(
  "delete_supplier_buyer",
  {
    title: "Delete Supplier Buyer",
    description: "Delete a buyer relationship from a supplier",
    inputSchema: {
      supplierId: z.string(),
      buyerId: z.string(),
    },
  },
  async (input) => {
    try {
      const { supplierId, buyerId } = input
      await orderCloudClient.suppliers.deleteSupplierBuyer(supplierId, buyerId)
      return {
        content: [
          {
            type: "text",
            text: `Supplier buyer relationship ${supplierId}/${buyerId} deleted successfully`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting supplier buyer: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

}

