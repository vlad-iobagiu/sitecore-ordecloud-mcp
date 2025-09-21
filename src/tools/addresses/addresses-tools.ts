import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import OrderCloudClient from "../ordercloud-client.js"

export function registerAddressTools(server: McpServer, orderCloudClient: OrderCloudClient) {

// Tool: List Addresses
server.registerTool(
  "list_addresses",
  {
    title: "List Addresses",
    description: "Retrieve a list of addresses for a specific buyer from OrderCloud with advanced filtering, searching, and sorting",
    inputSchema: {
      buyerId: z.string(),
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
      search: z.string().optional(),
      searchOn: z
        .array(z.enum(["ID", "AddressName", "CompanyName", "FirstName", "LastName", "City", "State", "Zip", "Country"]))
        .optional(),
      sortBy: z
        .array(
          z.enum([
            "AddressName",
            "CompanyName",
            "FirstName",
            "LastName",
            "City",
            "State",
            "Zip",
            "Country",
            "!AddressName",
            "!CompanyName",
            "!FirstName",
            "!LastName",
            "!City",
            "!State",
            "!Zip",
            "!Country"
          ])
        )
        .optional(),
      filters: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { buyerId, ...options } = input
      const result = await orderCloudClient.addresses.listAddresses(buyerId, options)
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
            text: `Error listing addresses: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Tool: Get Address by ID
server.registerTool(
  "get_address",
  {
    title: "Get Address",
    description: "Retrieve a specific address by ID from OrderCloud",
    inputSchema: {
      buyerId: z.string(),
      addressId: z.string(),
    },
  },
  async ({ buyerId, addressId }) => {
    try {
      const result = await orderCloudClient.addresses.getAddress(buyerId, addressId)
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
            text: `Error getting address: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Create Address
server.registerTool(
  "create_address",
  {
    title: "Create Address",
    description: "Create a new address for a buyer in OrderCloud",
    inputSchema: {
      buyerId: z.string(),
      id: z.string().optional(),
      addressName: z.string().optional(),
      companyName: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      street1: z.string().optional(),
      street2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      country: z.string().optional(),
      phone: z.string().optional(),
      addressType: z.enum(["Billing", "Shipping"]).optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { buyerId, ...addressData } = input
      const address = {
        ...(addressData.id && { ID: addressData.id }),
        ...(addressData.addressName && { AddressName: addressData.addressName }),
        ...(addressData.companyName && { CompanyName: addressData.companyName }),
        ...(addressData.firstName && { FirstName: addressData.firstName }),
        ...(addressData.lastName && { LastName: addressData.lastName }),
        ...(addressData.street1 && { Street1: addressData.street1 }),
        ...(addressData.street2 && { Street2: addressData.street2 }),
        ...(addressData.city && { City: addressData.city }),
        ...(addressData.state && { State: addressData.state }),
        ...(addressData.zip && { Zip: addressData.zip }),
        ...(addressData.country && { Country: addressData.country }),
        ...(addressData.phone && { Phone: addressData.phone }),
        ...(addressData.addressType && { AddressType: addressData.addressType }),
        ...(addressData.xp && { xp: addressData.xp }),
      }
      const result = await orderCloudClient.addresses.createAddress(buyerId, address)
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
            text: `Error creating address: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Update Address (Full Update)
server.registerTool(
  "update_address",
  {
    title: "Update Address",
    description: "Update an existing address in OrderCloud (full update - PUT)",
    inputSchema: {
      buyerId: z.string(),
      addressId: z.string(),
      id: z.string().optional(),
      addressName: z.string().optional(),
      companyName: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      street1: z.string().optional(),
      street2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      country: z.string().optional(),
      phone: z.string().optional(),
      addressType: z.enum(["Billing", "Shipping"]).optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { buyerId, addressId, ...updateData } = input
      const address: any = {}
      
      if (updateData.id) address.ID = updateData.id
      if (updateData.addressName) address.AddressName = updateData.addressName
      if (updateData.companyName) address.CompanyName = updateData.companyName
      if (updateData.firstName) address.FirstName = updateData.firstName
      if (updateData.lastName) address.LastName = updateData.lastName
      if (updateData.street1) address.Street1 = updateData.street1
      if (updateData.street2) address.Street2 = updateData.street2
      if (updateData.city) address.City = updateData.city
      if (updateData.state) address.State = updateData.state
      if (updateData.zip) address.Zip = updateData.zip
      if (updateData.country) address.Country = updateData.country
      if (updateData.phone) address.Phone = updateData.phone
      if (updateData.addressType) address.AddressType = updateData.addressType
      if (updateData.xp) address.xp = updateData.xp
      
      const result = await orderCloudClient.addresses.updateAddress(buyerId, addressId, address)
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
            text: `Error updating address: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Patch Address (Partial Update)
server.registerTool(
  "patch_address",
  {
    title: "Patch Address",
    description: "Partially update an existing address in OrderCloud (PATCH)",
    inputSchema: {
      buyerId: z.string(),
      addressId: z.string(),
      id: z.string().optional(),
      addressName: z.string().optional(),
      companyName: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      street1: z.string().optional(),
      street2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      country: z.string().optional(),
      phone: z.string().optional(),
      addressType: z.enum(["Billing", "Shipping"]).optional(),
      xp: z.record(z.any()).optional(),
    },
  },
  async (input) => {
    try {
      const { buyerId, addressId, ...updateData } = input
      const address = {
        ...(updateData.id && { ID: updateData.id }),
        ...(updateData.addressName && { AddressName: updateData.addressName }),
        ...(updateData.companyName && { CompanyName: updateData.companyName }),
        ...(updateData.firstName && { FirstName: updateData.firstName }),
        ...(updateData.lastName && { LastName: updateData.lastName }),
        ...(updateData.street1 && { Street1: updateData.street1 }),
        ...(updateData.street2 && { Street2: updateData.street2 }),
        ...(updateData.city && { City: updateData.city }),
        ...(updateData.state && { State: updateData.state }),
        ...(updateData.zip && { Zip: updateData.zip }),
        ...(updateData.country && { Country: updateData.country }),
        ...(updateData.phone && { Phone: updateData.phone }),
        ...(updateData.addressType && { AddressType: updateData.addressType }),
        ...(updateData.xp && { xp: updateData.xp }),
      }
      const result = await orderCloudClient.addresses.patchAddress(buyerId, addressId, address)
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
            text: `Error patching address: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Delete Address
server.registerTool(
  "delete_address",
  {
    title: "Delete Address",
    description: "Delete an address from OrderCloud",
    inputSchema: {
      buyerId: z.string(),
      addressId: z.string(),
    },
  },
  async ({ buyerId, addressId }) => {
    try {
      await orderCloudClient.addresses.deleteAddress(buyerId, addressId)
      return {
        content: [
          {
            type: "text",
            text: `Address ${addressId} deleted successfully`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting address: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: List Address Assignments
server.registerTool(
  "list_address_assignments",
  {
    title: "List Address Assignments",
    description: "List address assignments for a specific buyer from OrderCloud",
    inputSchema: {
      buyerId: z.string(),
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
      search: z.string().optional(),
      searchOn: z
        .array(z.enum(["AddressID", "UserGroupID", "UserID"]))
        .optional(),
      sortBy: z
        .array(
          z.enum([
            "AddressID",
            "UserGroupID",
            "UserID",
            "!AddressID",
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
      const { buyerId, ...options } = input
      const result = await orderCloudClient.addresses.listAddressAssignments(buyerId, options)
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
            text: `Error listing address assignments: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      }
    }
  }
)

// Tool: Create or Update Address Assignment
server.registerTool(
  "save_address_assignment",
  {
    title: "Save Address Assignment",
    description: "Create or update an address assignment in OrderCloud",
    inputSchema: {
      buyerId: z.string(),
      addressId: z.string(),
      userGroupId: z.string().optional(),
      userId: z.string().optional(),
      isBilling: z.boolean().optional(),
      isShipping: z.boolean().optional(),
    },
  },
  async (input) => {
    try {
      const { buyerId, addressId, ...assignmentData } = input
      const assignment = {
        AddressID: addressId,
        ...(assignmentData.userGroupId && { UserGroupID: assignmentData.userGroupId }),
        ...(assignmentData.userId && { UserID: assignmentData.userId }),
        ...(assignmentData.isBilling !== undefined && { IsBilling: assignmentData.isBilling }),
        ...(assignmentData.isShipping !== undefined && { IsShipping: assignmentData.isShipping }),
      }
      const result = await orderCloudClient.addresses.saveAddressAssignment(buyerId, assignment)
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
            text: `Error saving address assignment: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

// Tool: Delete Address Assignment
server.registerTool(
  "delete_address_assignment",
  {
    title: "Delete Address Assignment",
    description: "Delete an address assignment from OrderCloud",
    inputSchema: {
      buyerId: z.string(),
      addressId: z.string(),
    },
  },
  async ({ buyerId, addressId }) => {
    try {
      await orderCloudClient.addresses.deleteAddressAssignment(buyerId, addressId)
      return {
        content: [
          {
            type: "text",
            text: `Address assignment for ${addressId} deleted successfully`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting address assignment: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      }
    }
  },
)

}
