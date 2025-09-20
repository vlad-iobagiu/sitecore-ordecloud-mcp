import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import OrderCloudClient from "../ordercloud-client.js"

export function registerCatalogTools(server: McpServer, orderCloudClient: OrderCloudClient) {

  // Tool: List Catalogs (Enhanced)
  server.registerTool(
    "list_catalogs",
    {
      title: "List Catalogs",
      description: "Retrieve a list of catalogs from OrderCloud with advanced filtering, searching, and sorting",
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
        const result = await orderCloudClient.catalogs.listCatalogs(input)
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
              text: `Error listing catalogs: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        }
      }
    }
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
        const result = await orderCloudClient.catalogs.get(catalogId)
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
        id: z.string().optional(),
        name: z.string(),
        description: z.string().optional(),
        active: z.boolean().optional().default(true),
        xp: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const catalog = {
          ...(input.id && { ID: input.id }),
          Name: input.name,
          ...(input.description && { Description: input.description }),
          Active: input.active,
          ...(input.xp && { xp: input.xp }),
        }
        const result = await orderCloudClient.catalogs.create(catalog)
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

  // Tool: Update Catalog (Full Update)
  server.registerTool(
    "update_catalog",
    {
      title: "Update Catalog",
      description: "Update an existing catalog in OrderCloud (full update - PUT)",
      inputSchema: {
        catalogId: z.string(),
        id: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        active: z.boolean().optional(),
        xp: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const { catalogId, ...updateData } = input
        const catalog: any = {}
        
        if (updateData.id) catalog.ID = updateData.id
        if (updateData.name !== undefined) catalog.Name = updateData.name
        if (updateData.description !== undefined) catalog.Description = updateData.description
        if (updateData.active !== undefined) catalog.Active = updateData.active
        if (updateData.xp) catalog.xp = updateData.xp
        
        const result = await orderCloudClient.catalogs.update(catalogId, catalog)
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) },
          ],
        }
      } catch (error) {
        // Enhanced error message with API response details
        let errorMessage = `Error updating catalog: ${error instanceof Error ? error.message : String(error)}`
        
        if ((error as any)?.response?.data) {
          const responseData = (error as any).response.data
          if (typeof responseData === 'object') {
            errorMessage += `\n\nAPI Response Details:\n${JSON.stringify(responseData, null, 2)}`
          } else {
            errorMessage += `\n\nAPI Response: ${responseData}`
          }
        }
        
        return {
          content: [
            { type: "text", text: errorMessage },
          ],
          isError: true,
        }
      }
    },
  )

  // Tool: Patch Catalog (Partial Update)
  server.registerTool(
    "patch_catalog",
    {
      title: "Patch Catalog",
      description: "Partially update an existing catalog in OrderCloud (PATCH)",
      inputSchema: {
        catalogId: z.string(),
        id: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        active: z.boolean().optional(),
        xp: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const { catalogId, ...updateData } = input
        const catalog: any = {}
        
        if (updateData.id) catalog.ID = updateData.id
        if (updateData.name !== undefined) catalog.Name = updateData.name
        if (updateData.description !== undefined) catalog.Description = updateData.description
        if (updateData.active !== undefined) catalog.Active = updateData.active
        if (updateData.xp) catalog.xp = updateData.xp
        
        const result = await orderCloudClient.catalogs.patch(catalogId, catalog)
        return {
          content: [
            { type: "text", text: JSON.stringify(result, null, 2) },
          ],
        }
      } catch (error) {
        // Enhanced error message with API response details
        let errorMessage = `Error patching catalog: ${error instanceof Error ? error.message : String(error)}`
        
        if ((error as any)?.response?.data) {
          const responseData = (error as any).response.data
          if (typeof responseData === 'object') {
            errorMessage += `\n\nAPI Response Details:\n${JSON.stringify(responseData, null, 2)}`
          } else {
            errorMessage += `\n\nAPI Response: ${responseData}`
          }
        }
        
        return {
          content: [
            { type: "text", text: errorMessage },
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
        await orderCloudClient.catalogs.delete(catalogId)
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

  // Tool: List Catalog Assignments
  server.registerTool(
    "list_catalog_assignments",
    {
      title: "List Catalog Assignments",
      description: "List catalog assignments from OrderCloud",
      inputSchema: {
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(20),
        search: z.string().optional(),
        searchOn: z
          .array(z.enum(["CatalogID", "BuyerID", "UserGroupID", "UserID"]))
          .optional(),
        sortBy: z
          .array(
            z.enum([
              "CatalogID",
              "BuyerID", 
              "UserGroupID",
              "UserID",
              "!CatalogID",
              "!BuyerID",
              "!UserGroupID",
              "!UserID"
            ])
          )
          .optional(),
        filters: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const result = await orderCloudClient.catalogs.listCatalogAssignments(input)
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
              text: `Error listing catalog assignments: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        }
      }
    }
  )

  // Tool: Save Catalog Assignment
  server.registerTool(
    "save_catalog_assignment",
    {
      title: "Save Catalog Assignment",
      description: "Create or update a catalog assignment",
      inputSchema: {
        catalogId: z.string(),
        buyerId: z.string().optional(),
        userGroupId: z.string().optional(),
        userId: z.string().optional(),
      },
    },
    async (input) => {
      try {
        const assignment = {
          CatalogID: input.catalogId,
          ...(input.buyerId && { BuyerID: input.buyerId }),
          ...(input.userGroupId && { UserGroupID: input.userGroupId }),
          ...(input.userId && { UserID: input.userId }),
        }
        const result = await orderCloudClient.catalogs.saveCatalogAssignment(assignment)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error saving catalog assignment: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Delete Catalog Assignment
  server.registerTool(
    "delete_catalog_assignment",
    {
      title: "Delete Catalog Assignment",
      description: "Delete a catalog assignment",
      inputSchema: {
        catalogId: z.string(),
      },
    },
    async ({ catalogId }) => {
      try {
        await orderCloudClient.catalogs.deleteCatalogAssignment(catalogId)
        return {
          content: [{ type: "text", text: `Catalog assignment ${catalogId} deleted successfully` }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error deleting catalog assignment: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: List Catalog Bundle Assignments
  server.registerTool(
    "list_catalog_bundle_assignments",
    {
      title: "List Catalog Bundle Assignments",
      description: "List catalog bundle assignments from OrderCloud",
      inputSchema: {
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(20),
        search: z.string().optional(),
        searchOn: z
          .array(z.enum(["CatalogID", "BundleID"]))
          .optional(),
        sortBy: z
          .array(
            z.enum([
              "CatalogID",
              "BundleID",
              "!CatalogID",
              "!BundleID"
            ])
          )
          .optional(),
        filters: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const result = await orderCloudClient.catalogs.listCatalogBundleAssignments(input)
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
              text: `Error listing catalog bundle assignments: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        }
      }
    }
  )

  // Tool: Save Catalog Bundle Assignment
  server.registerTool(
    "save_catalog_bundle_assignment",
    {
      title: "Save Catalog Bundle Assignment",
      description: "Create or update a catalog bundle assignment",
      inputSchema: {
        catalogId: z.string(),
        bundleId: z.string(),
      },
    },
    async ({ catalogId, bundleId }) => {
      try {
        const assignment = {
          CatalogID: catalogId,
          BundleID: bundleId,
        }
        const result = await orderCloudClient.catalogs.saveCatalogBundleAssignment(assignment)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error saving catalog bundle assignment: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Delete Catalog Bundle Assignment
  server.registerTool(
    "delete_catalog_bundle_assignment",
    {
      title: "Delete Catalog Bundle Assignment",
      description: "Delete a catalog bundle assignment",
      inputSchema: {
        catalogId: z.string(),
        bundleId: z.string(),
      },
    },
    async ({ catalogId, bundleId }) => {
      try {
        await orderCloudClient.catalogs.deleteCatalogBundleAssignment(catalogId, bundleId)
        return {
          content: [{ type: "text", text: `Catalog bundle assignment ${catalogId}/${bundleId} deleted successfully` }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error deleting catalog bundle assignment: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: List Catalog Product Assignments
  server.registerTool(
    "list_catalog_product_assignments",
    {
      title: "List Catalog Product Assignments",
      description: "List catalog product assignments from OrderCloud",
      inputSchema: {
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(20),
        search: z.string().optional(),
        searchOn: z
          .array(z.enum(["CatalogID", "ProductID"]))
          .optional(),
        sortBy: z
          .array(
            z.enum([
              "CatalogID",
              "ProductID",
              "!CatalogID",
              "!ProductID"
            ])
          )
          .optional(),
        filters: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const result = await orderCloudClient.catalogs.listCatalogProductAssignments(input)
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
              text: `Error listing catalog product assignments: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        }
      }
    }
  )

  // Tool: Save Catalog Product Assignment
  server.registerTool(
    "save_catalog_product_assignment",
    {
      title: "Save Catalog Product Assignment",
      description: "Create or update a catalog product assignment",
      inputSchema: {
        catalogId: z.string(),
        productId: z.string(),
      },
    },
    async ({ catalogId, productId }) => {
      try {
        const assignment = {
          CatalogID: catalogId,
          ProductID: productId,
        }
        const result = await orderCloudClient.catalogs.saveCatalogProductAssignment(assignment)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error saving catalog product assignment: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Delete Catalog Product Assignment
  server.registerTool(
    "delete_catalog_product_assignment",
    {
      title: "Delete Catalog Product Assignment",
      description: "Delete a catalog product assignment",
      inputSchema: {
        catalogId: z.string(),
        productId: z.string(),
      },
    },
    async ({ catalogId, productId }) => {
      try {
        await orderCloudClient.catalogs.deleteCatalogProductAssignment(catalogId, productId)
        return {
          content: [{ type: "text", text: `Catalog product assignment ${catalogId}/${productId} deleted successfully` }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error deleting catalog product assignment: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )
}
