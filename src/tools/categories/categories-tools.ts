import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import OrderCloudClient from "../ordercloud-client.js"

export function registerCategoryTools(server: McpServer, orderCloudClient: OrderCloudClient) {

  // Tool: List Categories (Enhanced)
  server.registerTool(
    "list_categories",
    {
      title: "List Categories",
      description: "Retrieve a list of categories from a catalog with advanced filtering, searching, and sorting",
      inputSchema: {
        catalogId: z.string(),
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
        const { catalogId, ...options } = input
        const result = await orderCloudClient.categories.listCategories(catalogId, options)
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
              text: `Error listing categories: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        }
      }
    }
  )

  // Tool: Get Categories (Legacy - for backward compatibility)
  server.registerTool(
    "get_categories",
    {
      title: "Get Categories (Legacy)",
      description: "Retrieve a list of categories for a given catalog (legacy method)",
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
        parentId: z.string().optional(),
        listOrder: z.number().optional(),
        adjustListOrders: z.boolean().optional().default(false),
        xp: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const { catalogId, adjustListOrders, ...categoryData } = input
        const category = {
          ...(categoryData.id && { ID: categoryData.id }),
          Name: categoryData.name,
          ...(categoryData.description && { Description: categoryData.description }),
          Active: categoryData.active,
          ...(categoryData.parentId && { ParentID: categoryData.parentId }),
          ...(categoryData.listOrder !== undefined && { ListOrder: categoryData.listOrder }),
          ...(categoryData.xp && { xp: categoryData.xp }),
        }
        const result = await orderCloudClient.categories.createCategory(catalogId, category, adjustListOrders)
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

  // Tool: Update Category (Full Update)
  server.registerTool(
    "update_category",
    {
      title: "Update Category",
      description: "Update an existing category in a catalog (full update - PUT)",
      inputSchema: {
        catalogId: z.string(),
        categoryId: z.string(),
        id: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        active: z.boolean().optional(),
        parentId: z.string().optional(),
        listOrder: z.number().optional(),
        adjustListOrders: z.boolean().optional().default(false),
        xp: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const { catalogId, categoryId, adjustListOrders, ...updateData } = input
        const category: any = {}
        
        if (updateData.id) category.ID = updateData.id
        if (updateData.name !== undefined) category.Name = updateData.name
        if (updateData.description !== undefined) category.Description = updateData.description
        if (updateData.active !== undefined) category.Active = updateData.active
        if (updateData.parentId !== undefined) category.ParentID = updateData.parentId
        if (updateData.listOrder !== undefined) category.ListOrder = updateData.listOrder
        if (updateData.xp) category.xp = updateData.xp
        
        const result = await orderCloudClient.categories.updateCategory(catalogId, categoryId, category, adjustListOrders)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error updating category: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Patch Category (Partial Update)
  server.registerTool(
    "patch_category",
    {
      title: "Patch Category",
      description: "Partially update an existing category in a catalog (PATCH)",
      inputSchema: {
        catalogId: z.string(),
        categoryId: z.string(),
        id: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        active: z.boolean().optional(),
        parentId: z.string().optional(),
        listOrder: z.number().optional(),
        adjustListOrders: z.boolean().optional().default(false),
        xp: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const { catalogId, categoryId, adjustListOrders, ...updateData } = input
        const category: any = {}
        
        if (updateData.id) category.ID = updateData.id
        if (updateData.name !== undefined) category.Name = updateData.name
        if (updateData.description !== undefined) category.Description = updateData.description
        if (updateData.active !== undefined) category.Active = updateData.active
        if (updateData.parentId !== undefined) category.ParentID = updateData.parentId
        if (updateData.listOrder !== undefined) category.ListOrder = updateData.listOrder
        if (updateData.xp) category.xp = updateData.xp
        
        const result = await orderCloudClient.categories.patchCategory(catalogId, categoryId, category, adjustListOrders)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error patching category: ${error instanceof Error ? error.message : String(error)}` }],
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

  // Tool: List Category Assignments
  server.registerTool(
    "list_category_assignments",
    {
      title: "List Category Assignments",
      description: "List category assignments for a catalog",
      inputSchema: {
        catalogId: z.string(),
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(20),
        search: z.string().optional(),
        searchOn: z
          .array(z.enum(["CategoryID", "BuyerID", "UserGroupID", "UserID"]))
          .optional(),
        sortBy: z
          .array(
            z.enum([
              "CategoryID",
              "BuyerID", 
              "UserGroupID",
              "UserID",
              "!CategoryID",
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
        const { catalogId, ...options } = input
        const result = await orderCloudClient.categories.listCategoryAssignments(catalogId, options)
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
              text: `Error listing category assignments: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        }
      }
    }
  )

  // Tool: Save Category Assignment
  server.registerTool(
    "save_category_assignment",
    {
      title: "Save Category Assignment",
      description: "Create or update a category assignment",
      inputSchema: {
        catalogId: z.string(),
        categoryId: z.string(),
        buyerId: z.string().optional(),
        userGroupId: z.string().optional(),
        userId: z.string().optional(),
      },
    },
    async (input) => {
      try {
        const { catalogId, ...assignmentData } = input
        const assignment = {
          CategoryID: assignmentData.categoryId,
          ...(assignmentData.buyerId && { BuyerID: assignmentData.buyerId }),
          ...(assignmentData.userGroupId && { UserGroupID: assignmentData.userGroupId }),
          ...(assignmentData.userId && { UserID: assignmentData.userId }),
        }
        const result = await orderCloudClient.categories.saveCategoryAssignment(catalogId, assignment)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error saving category assignment: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Delete Category Assignment
  server.registerTool(
    "delete_category_assignment",
    {
      title: "Delete Category Assignment",
      description: "Delete a category assignment",
      inputSchema: {
        catalogId: z.string(),
        categoryId: z.string(),
      },
    },
    async ({ catalogId, categoryId }) => {
      try {
        await orderCloudClient.categories.deleteCategoryAssignment(catalogId, categoryId)
        return {
          content: [{ type: "text", text: `Category assignment ${categoryId} deleted successfully from catalog ${catalogId}` }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error deleting category assignment: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: List Category Bundle Assignments
  server.registerTool(
    "list_category_bundle_assignments",
    {
      title: "List Category Bundle Assignments",
      description: "List category bundle assignments for a catalog",
      inputSchema: {
        catalogId: z.string(),
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(20),
        search: z.string().optional(),
        searchOn: z
          .array(z.enum(["CategoryID", "BundleID"]))
          .optional(),
        sortBy: z
          .array(
            z.enum([
              "CategoryID",
              "BundleID",
              "!CategoryID",
              "!BundleID"
            ])
          )
          .optional(),
        filters: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const { catalogId, ...options } = input
        const result = await orderCloudClient.categories.listCategoryBundleAssignments(catalogId, options)
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
              text: `Error listing category bundle assignments: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        }
      }
    }
  )

  // Tool: Save Category Bundle Assignment
  server.registerTool(
    "save_category_bundle_assignment",
    {
      title: "Save Category Bundle Assignment",
      description: "Create or update a category bundle assignment",
      inputSchema: {
        catalogId: z.string(),
        categoryId: z.string(),
        bundleId: z.string(),
      },
    },
    async ({ catalogId, categoryId, bundleId }) => {
      try {
        const assignment = {
          CategoryID: categoryId,
          BundleID: bundleId,
        }
        const result = await orderCloudClient.categories.saveCategoryBundleAssignment(catalogId, assignment)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error saving category bundle assignment: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Delete Category Bundle Assignment
  server.registerTool(
    "delete_category_bundle_assignment",
    {
      title: "Delete Category Bundle Assignment",
      description: "Delete a category bundle assignment",
      inputSchema: {
        catalogId: z.string(),
        categoryId: z.string(),
        bundleId: z.string(),
      },
    },
    async ({ catalogId, categoryId, bundleId }) => {
      try {
        await orderCloudClient.categories.deleteCategoryBundleAssignment(catalogId, categoryId, bundleId)
        return {
          content: [{ type: "text", text: `Category bundle assignment ${categoryId}/${bundleId} deleted successfully from catalog ${catalogId}` }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error deleting category bundle assignment: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: List Category Product Assignments
  server.registerTool(
    "list_category_product_assignments",
    {
      title: "List Category Product Assignments",
      description: "List category product assignments for a catalog",
      inputSchema: {
        catalogId: z.string(),
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(20),
        search: z.string().optional(),
        searchOn: z
          .array(z.enum(["CategoryID", "ProductID"]))
          .optional(),
        sortBy: z
          .array(
            z.enum([
              "CategoryID",
              "ProductID",
              "!CategoryID",
              "!ProductID"
            ])
          )
          .optional(),
        filters: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const { catalogId, ...options } = input
        const result = await orderCloudClient.categories.listCategoryProductAssignments(catalogId, options)
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
              text: `Error listing category product assignments: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        }
      }
    }
  )

  // Tool: Save Category Product Assignment
  server.registerTool(
    "save_category_product_assignment",
    {
      title: "Save Category Product Assignment",
      description: "Create or update a category product assignment",
      inputSchema: {
        catalogId: z.string(),
        categoryId: z.string(),
        productId: z.string(),
      },
    },
    async ({ catalogId, categoryId, productId }) => {
      try {
        const assignment = {
          CategoryID: categoryId,
          ProductID: productId,
        }
        const result = await orderCloudClient.categories.saveCategoryProductAssignment(catalogId, assignment)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error saving category product assignment: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Delete Category Product Assignment
  server.registerTool(
    "delete_category_product_assignment",
    {
      title: "Delete Category Product Assignment",
      description: "Delete a category product assignment",
      inputSchema: {
        catalogId: z.string(),
        categoryId: z.string(),
        productId: z.string(),
      },
    },
    async ({ catalogId, categoryId, productId }) => {
      try {
        await orderCloudClient.categories.deleteCategoryProductAssignment(catalogId, categoryId, productId)
        return {
          content: [{ type: "text", text: `Category product assignment ${categoryId}/${productId} deleted successfully from catalog ${catalogId}` }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error deleting category product assignment: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )
}
