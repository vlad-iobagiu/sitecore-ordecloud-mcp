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
      const result = await orderCloudClient.products.getProducts(page, pageSize, catalogId)
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
      const result = await  orderCloudClient.products.listProducts(input)
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
      const result = await  orderCloudClient.products.getProduct(productId)
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
      id: z.string().optional(),
      name: z.string(),
      description: z.string().optional(),
      active: z.boolean().optional().default(true),
      quantityMultiplier: z.number().optional(),
      shipWeight: z.number().optional(),
      shipHeight: z.number().optional(),
      shipWidth: z.number().optional(),
      shipLength: z.number().optional(),
      shipFromAddressId: z.string().optional(),
      defaultPriceScheduleId: z.string().optional(),
      autoForward: z.boolean().optional(),
      defaultSupplierId: z.string().optional(),
      allSuppliersCanSell: z.boolean().optional(),
      returnable: z.boolean().optional(),
      inventory: z.object({
        enabled: z.boolean().optional(),
        notificationPoint: z.number().optional(),
        variantLevelTracking: z.boolean().optional(),
      }).optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const product = {
        ...(input.id && { ID: input.id }),
        Name: input.name,
        ...(input.description && { Description: input.description }),
        Active: input.active,
        ...(input.quantityMultiplier !== undefined && { QuantityMultiplier: input.quantityMultiplier }),
        ...(input.shipWeight !== undefined && { ShipWeight: input.shipWeight }),
        ...(input.shipHeight !== undefined && { ShipHeight: input.shipHeight }),
        ...(input.shipWidth !== undefined && { ShipWidth: input.shipWidth }),
        ...(input.shipLength !== undefined && { ShipLength: input.shipLength }),
        ...(input.shipFromAddressId && { ShipFromAddressID: input.shipFromAddressId }),
        ...(input.defaultPriceScheduleId && { DefaultPriceScheduleID: input.defaultPriceScheduleId }),
        ...(input.autoForward !== undefined && { AutoForward: input.autoForward }),
        ...(input.defaultSupplierId && { DefaultSupplierID: input.defaultSupplierId }),
        ...(input.allSuppliersCanSell !== undefined && { AllSuppliersCanSell: input.allSuppliersCanSell }),
        ...(input.returnable !== undefined && { Returnable: input.returnable }),
        ...(input.inventory && { 
          Inventory: {
            ...(input.inventory.enabled !== undefined && { Enabled: input.inventory.enabled }),
            ...(input.inventory.notificationPoint !== undefined && { NotificationPoint: input.inventory.notificationPoint }),
            ...(input.inventory.variantLevelTracking !== undefined && { VariantLevelTracking: input.inventory.variantLevelTracking }),
          }
        }),
        ...(input.xp && { xp: input.xp }),
      }
      const result = await orderCloudClient.products.createProduct(product)
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

// Tool: Update Product (Full Update)
server.registerTool(
  "update_product",
  {
    title: "Update Product",
    description: "Update an existing product in OrderCloud (full update - PUT)",
    inputSchema: {
      productId: z.string(),
      id: z.string().optional(),
      name: z.string().optional(),
      description: z.string().optional(),
      active: z.boolean().optional(),
      quantityMultiplier: z.number().optional(),
      shipWeight: z.number().optional(),
      shipHeight: z.number().optional(),
      shipWidth: z.number().optional(),
      shipLength: z.number().optional(),
      shipFromAddressId: z.string().optional(),
      defaultPriceScheduleId: z.string().optional(),
      autoForward: z.boolean().optional(),
      defaultSupplierId: z.string().optional(),
      allSuppliersCanSell: z.boolean().optional(),
      returnable: z.boolean().optional(),
      inventory: z.object({
        enabled: z.boolean().optional(),
        notificationPoint: z.number().optional(),
        variantLevelTracking: z.boolean().optional(),
      }).optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { productId, ...updateData } = input
      const product: any = {}
      
      if (updateData.id) product.ID = updateData.id
      if (updateData.name !== undefined) product.Name = updateData.name
      if (updateData.description !== undefined) product.Description = updateData.description
      if (updateData.active !== undefined) product.Active = updateData.active
      if (updateData.quantityMultiplier !== undefined) product.QuantityMultiplier = updateData.quantityMultiplier
      if (updateData.shipWeight !== undefined) product.ShipWeight = updateData.shipWeight
      if (updateData.shipHeight !== undefined) product.ShipHeight = updateData.shipHeight
      if (updateData.shipWidth !== undefined) product.ShipWidth = updateData.shipWidth
      if (updateData.shipLength !== undefined) product.ShipLength = updateData.shipLength
      if (updateData.shipFromAddressId !== undefined) product.ShipFromAddressID = updateData.shipFromAddressId
      if (updateData.defaultPriceScheduleId !== undefined) product.DefaultPriceScheduleID = updateData.defaultPriceScheduleId
      if (updateData.autoForward !== undefined) product.AutoForward = updateData.autoForward
      if (updateData.defaultSupplierId !== undefined) product.DefaultSupplierID = updateData.defaultSupplierId
      if (updateData.allSuppliersCanSell !== undefined) product.AllSuppliersCanSell = updateData.allSuppliersCanSell
      if (updateData.returnable !== undefined) product.Returnable = updateData.returnable
      if (updateData.inventory) {
        product.Inventory = {
          ...(updateData.inventory.enabled !== undefined && { Enabled: updateData.inventory.enabled }),
          ...(updateData.inventory.notificationPoint !== undefined && { NotificationPoint: updateData.inventory.notificationPoint }),
          ...(updateData.inventory.variantLevelTracking !== undefined && { VariantLevelTracking: updateData.inventory.variantLevelTracking }),
        }
      }
      if (updateData.xp) product.xp = updateData.xp
      
      const result = await orderCloudClient.products.updateProduct(productId, product)
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    } catch (error) {
      // Enhanced error message with API response details
      let errorMessage = `Error updating product: ${error instanceof Error ? error.message : String(error)}`
      
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

// Tool: Patch Product (Partial Update)
server.registerTool(
  "patch_product",
  {
    title: "Patch Product",
    description: "Partially update an existing product in OrderCloud (PATCH)",
    inputSchema: {
      productId: z.string(),
      id: z.string().optional(),
      name: z.string().optional(),
      description: z.string().optional(),
      active: z.boolean().optional(),
      quantityMultiplier: z.number().optional(),
      shipWeight: z.number().optional(),
      shipHeight: z.number().optional(),
      shipWidth: z.number().optional(),
      shipLength: z.number().optional(),
      shipFromAddressId: z.string().optional(),
      defaultPriceScheduleId: z.string().optional(),
      autoForward: z.boolean().optional(),
      defaultSupplierId: z.string().optional(),
      allSuppliersCanSell: z.boolean().optional(),
      returnable: z.boolean().optional(),
      inventory: z.object({
        enabled: z.boolean().optional(),
        notificationPoint: z.number().optional(),
        variantLevelTracking: z.boolean().optional(),
      }).optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { productId, ...updateData } = input
      const product: any = {}
      
      if (updateData.id) product.ID = updateData.id
      if (updateData.name !== undefined) product.Name = updateData.name
      if (updateData.description !== undefined) product.Description = updateData.description
      if (updateData.active !== undefined) product.Active = updateData.active
      if (updateData.quantityMultiplier !== undefined) product.QuantityMultiplier = updateData.quantityMultiplier
      if (updateData.shipWeight !== undefined) product.ShipWeight = updateData.shipWeight
      if (updateData.shipHeight !== undefined) product.ShipHeight = updateData.shipHeight
      if (updateData.shipWidth !== undefined) product.ShipWidth = updateData.shipWidth
      if (updateData.shipLength !== undefined) product.ShipLength = updateData.shipLength
      if (updateData.shipFromAddressId !== undefined) product.ShipFromAddressID = updateData.shipFromAddressId
      if (updateData.defaultPriceScheduleId !== undefined) product.DefaultPriceScheduleID = updateData.defaultPriceScheduleId
      if (updateData.autoForward !== undefined) product.AutoForward = updateData.autoForward
      if (updateData.defaultSupplierId !== undefined) product.DefaultSupplierID = updateData.defaultSupplierId
      if (updateData.allSuppliersCanSell !== undefined) product.AllSuppliersCanSell = updateData.allSuppliersCanSell
      if (updateData.returnable !== undefined) product.Returnable = updateData.returnable
      if (updateData.inventory) {
        product.Inventory = {
          ...(updateData.inventory.enabled !== undefined && { Enabled: updateData.inventory.enabled }),
          ...(updateData.inventory.notificationPoint !== undefined && { NotificationPoint: updateData.inventory.notificationPoint }),
          ...(updateData.inventory.variantLevelTracking !== undefined && { VariantLevelTracking: updateData.inventory.variantLevelTracking }),
        }
      }
      if (updateData.xp) product.xp = updateData.xp
      
      const result = await orderCloudClient.products.patchProduct(productId, product)
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    } catch (error) {
      // Enhanced error message with API response details
      let errorMessage = `Error patching product: ${error instanceof Error ? error.message : String(error)}`
      
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
      await  orderCloudClient.products.deleteProduct(productId)
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


  // Tool: List Product Assignments
  server.registerTool(
    "list_product_assignments",
    {
      title: "List Product Assignments",
      description: "List product assignments from OrderCloud",
      inputSchema: {
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(20),
        search: z.string().optional(),
        searchOn: z
          .array(z.enum(["ProductID", "BuyerID", "UserGroupID", "UserID"]))
          .optional(),
        sortBy: z
          .array(
            z.enum([
              "ProductID",
              "BuyerID", 
              "UserGroupID",
              "UserID",
              "!ProductID",
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
        const result = await orderCloudClient.products.listProductAssignments(input)
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
              text: `Error listing product assignments: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        }
      }
    }
  )

  // Tool: Save Product Assignment
  server.registerTool(
    "save_product_assignment",
    {
      title: "Save Product Assignment",
      description: "Create or update a product assignment",
      inputSchema: {
        productId: z.string(),
        buyerId: z.string().optional(),
        userGroupId: z.string().optional(),
        userId: z.string().optional(),
      },
    },
    async (input) => {
      try {
        const assignment = {
          ProductID: input.productId,
          ...(input.buyerId && { BuyerID: input.buyerId }),
          ...(input.userGroupId && { UserGroupID: input.userGroupId }),
          ...(input.userId && { UserID: input.userId }),
        }
        const result = await orderCloudClient.products.saveProductAssignment(assignment)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error saving product assignment: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Delete Product Assignment
  server.registerTool(
    "delete_product_assignment",
    {
      title: "Delete Product Assignment",
      description: "Delete a product assignment",
      inputSchema: {
        productId: z.string(),
        buyerId: z.string(),
      },
    },
    async ({ productId, buyerId }) => {
      try {
        await orderCloudClient.products.deleteProductAssignment(productId, buyerId)
        return {
          content: [{ type: "text", text: `Product assignment ${productId}/${buyerId} deleted successfully` }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error deleting product assignment: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: List Product Specs
  server.registerTool(
    "list_product_specs",
    {
      title: "List Product Specs",
      description: "List product specs for a specific product",
      inputSchema: {
        productId: z.string(),
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
        const { productId, ...options } = input
        const result = await orderCloudClient.products.listProductSpecs(productId, options)
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
              text: `Error listing product specs: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        }
      }
    }
  )

  // Tool: List Product Suppliers
  server.registerTool(
    "list_product_suppliers",
    {
      title: "List Product Suppliers",
      description: "List suppliers for a specific product",
      inputSchema: {
        productId: z.string(),
        page: z.number().optional().default(1),
        pageSize: z.number().optional().default(20),
        search: z.string().optional(),
        searchOn: z
          .array(z.enum(["SupplierID"]))
          .optional(),
        sortBy: z
          .array(
            z.enum([
              "SupplierID",
              "!SupplierID"
            ])
          )
          .optional(),
        filters: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const { productId, ...options } = input
        const result = await orderCloudClient.products.listProductSuppliers(productId, options)
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
              text: `Error listing product suppliers: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        }
      }
    }
  )

  // Tool: Save Product Supplier
  server.registerTool(
    "save_product_supplier",
    {
      title: "Save Product Supplier",
      description: "Create or update a product supplier relationship",
      inputSchema: {
        productId: z.string(),
        supplierId: z.string(),
        cost: z.number().optional(),
        unitCost: z.number().optional(),
        allBuyersCanPurchase: z.boolean().optional(),
        xp: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const { productId, supplierId, ...supplierData } = input
        const supplier = {
          SupplierID: supplierId,
          ...(supplierData.cost !== undefined && { Cost: supplierData.cost }),
          ...(supplierData.unitCost !== undefined && { UnitCost: supplierData.unitCost }),
          ...(supplierData.allBuyersCanPurchase !== undefined && { AllBuyersCanPurchase: supplierData.allBuyersCanPurchase }),
          ...(supplierData.xp && { xp: supplierData.xp }),
        }
        const result = await orderCloudClient.products.saveProductSupplier(productId, supplierId, supplier)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error saving product supplier: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Remove Product Supplier
  server.registerTool(
    "remove_product_supplier",
    {
      title: "Remove Product Supplier",
      description: "Remove a supplier from a product",
      inputSchema: {
        productId: z.string(),
        supplierId: z.string(),
      },
    },
    async ({ productId, supplierId }) => {
      try {
        await orderCloudClient.products.removeProductSupplier(productId, supplierId)
        return {
          content: [{ type: "text", text: `Product supplier ${productId}/${supplierId} removed successfully` }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error removing product supplier: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: List Product Variants
  server.registerTool(
    "list_product_variants",
    {
      title: "List Product Variants",
      description: "List variants for a specific product",
      inputSchema: {
        productId: z.string(),
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
        const { productId, ...options } = input
        const result = await orderCloudClient.products.listProductVariants(productId, options)
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
              text: `Error listing product variants: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        }
      }
    }
  )

  // Tool: Get Product Variant
  server.registerTool(
    "get_product_variant",
    {
      title: "Get Product Variant",
      description: "Retrieve a specific product variant",
      inputSchema: {
        productId: z.string(),
        variantId: z.string(),
      },
    },
    async ({ productId, variantId }) => {
      try {
        const result = await orderCloudClient.products.getProductVariant(productId, variantId)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error getting product variant: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Save Product Variant
  server.registerTool(
    "save_product_variant",
    {
      title: "Save Product Variant",
      description: "Create or update a product variant",
      inputSchema: {
        productId: z.string(),
        variantId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        active: z.boolean().optional(),
        shipWeight: z.number().optional(),
        shipHeight: z.number().optional(),
        shipWidth: z.number().optional(),
        shipLength: z.number().optional(),
        inventory: z.object({
          enabled: z.boolean().optional(),
          notificationPoint: z.number().optional(),
          variantLevelTracking: z.boolean().optional(),
        }).optional(),
        xp: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const { productId, variantId, ...variantData } = input
        const variant = {
          ...(variantData.name !== undefined && { Name: variantData.name }),
          ...(variantData.description !== undefined && { Description: variantData.description }),
          ...(variantData.active !== undefined && { Active: variantData.active }),
          ...(variantData.shipWeight !== undefined && { ShipWeight: variantData.shipWeight }),
          ...(variantData.shipHeight !== undefined && { ShipHeight: variantData.shipHeight }),
          ...(variantData.shipWidth !== undefined && { ShipWidth: variantData.shipWidth }),
          ...(variantData.shipLength !== undefined && { ShipLength: variantData.shipLength }),
          ...(variantData.inventory && { 
            Inventory: {
              ...(variantData.inventory.enabled !== undefined && { Enabled: variantData.inventory.enabled }),
              ...(variantData.inventory.notificationPoint !== undefined && { NotificationPoint: variantData.inventory.notificationPoint }),
              ...(variantData.inventory.variantLevelTracking !== undefined && { VariantLevelTracking: variantData.inventory.variantLevelTracking }),
            }
          }),
          ...(variantData.xp && { xp: variantData.xp }),
        }
        const result = await orderCloudClient.products.saveProductVariant(productId, variantId, variant)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error saving product variant: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Patch Product Variant
  server.registerTool(
    "patch_product_variant",
    {
      title: "Patch Product Variant",
      description: "Partially update a product variant",
      inputSchema: {
        productId: z.string(),
        variantId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        active: z.boolean().optional(),
        shipWeight: z.number().optional(),
        shipHeight: z.number().optional(),
        shipWidth: z.number().optional(),
        shipLength: z.number().optional(),
        inventory: z.object({
          enabled: z.boolean().optional(),
          notificationPoint: z.number().optional(),
          variantLevelTracking: z.boolean().optional(),
        }).optional(),
        xp: z.record(z.any()).optional(),
      },
    },
    async (input) => {
      try {
        const { productId, variantId, ...variantData } = input
        const variant: any = {}
        
        if (variantData.name !== undefined) variant.Name = variantData.name
        if (variantData.description !== undefined) variant.Description = variantData.description
        if (variantData.active !== undefined) variant.Active = variantData.active
        if (variantData.shipWeight !== undefined) variant.ShipWeight = variantData.shipWeight
        if (variantData.shipHeight !== undefined) variant.ShipHeight = variantData.shipHeight
        if (variantData.shipWidth !== undefined) variant.ShipWidth = variantData.shipWidth
        if (variantData.shipLength !== undefined) variant.ShipLength = variantData.shipLength
        if (variantData.inventory) {
          variant.Inventory = {
            ...(variantData.inventory.enabled !== undefined && { Enabled: variantData.inventory.enabled }),
            ...(variantData.inventory.notificationPoint !== undefined && { NotificationPoint: variantData.inventory.notificationPoint }),
            ...(variantData.inventory.variantLevelTracking !== undefined && { VariantLevelTracking: variantData.inventory.variantLevelTracking }),
          }
        }
        if (variantData.xp) variant.xp = variantData.xp
        
        const result = await orderCloudClient.products.patchProductVariant(productId, variantId, variant)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error patching product variant: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )

  // Tool: Generate Product Variants
  server.registerTool(
    "generate_product_variants",
    {
      title: "Generate Product Variants",
      description: "Generate product variants based on specs",
      inputSchema: {
        productId: z.string(),
        specs: z.array(z.string()),
      },
    },
    async ({ productId, specs }) => {
      try {
        const result = await orderCloudClient.products.generateProductVariants(productId, specs)
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        }
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error generating product variants: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        }
      }
    },
  )
}
