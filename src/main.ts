import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import dotenv from "dotenv"
import OrderCloudClient from "./tools/ordercloud-client.js"
import { registerAllTools } from "./tools/index.js"

dotenv.config()

const { ORDERCLOUD_USERNAME, ORDERCLOUD_PASSWORD, ORDERCLOUD_CLIENT_ID, ORDERCLOUD_SCOPE = "FullAccess" } = process.env

if (!ORDERCLOUD_USERNAME || !ORDERCLOUD_PASSWORD || !ORDERCLOUD_CLIENT_ID) {
  console.error("Missing required environment variables.")
  process.exit(1)
}

const orderCloudClient = new OrderCloudClient(
  ORDERCLOUD_USERNAME,
  ORDERCLOUD_PASSWORD,
  ORDERCLOUD_CLIENT_ID,
  ORDERCLOUD_SCOPE
)

const server = new McpServer({ name: "OrderCloud Server", version: "1.0.0" })

registerAllTools(server, orderCloudClient)

const transport = new StdioServerTransport()
server.connect(transport)