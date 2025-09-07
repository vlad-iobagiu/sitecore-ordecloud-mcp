import { z } from "zod"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import OrderCloudClient from "../ordercloud-client.js"


export function registerAuthTools(server: McpServer, orderCloudClient: OrderCloudClient) {
  server.registerTool(
    "authenticate",
    {
      title: "Authenticate with Sitecore OrderCloud",
      description: "Authenticate with OrderCloud using username, client ID, and password",
      inputSchema: {
        username: z.string().describe("OrderCloud username"),
        clientId: z.string().describe("OrderCloud client ID"),
        password: z.string().describe("OrderCloud password"),
      },
    },
    async ({ username, clientId, password }) => {
      try {
        console.log("Authenticating with OrderCloud...")
        // ✅ use the auth sub-client
        await orderCloudClient.auth.authenticate(username, clientId, password)
        return {
          content: [
            { type: "text", text: "Successfully authenticated with Sitecore OrderCloud" },
          ],
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Authentication failed: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
          isError: true,
        }
      }
    }
  )
}
