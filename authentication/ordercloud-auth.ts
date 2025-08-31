interface OrderCloudCredentials {
  username: string
  password: string
  clientId: string
  scope?: string[]
}

interface OrderCloudToken {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
}

interface OrderCloudAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
}

class OrderCloudAuth {
  private baseUrl: string
  private credentials: OrderCloudCredentials | null = null
  private token: OrderCloudToken | null = null
  private tokenExpiry: Date | null = null

  constructor(baseUrl = "https://sandboxapi.ordercloud.io") {
    this.baseUrl = baseUrl
  }

  setCredentials(credentials: OrderCloudCredentials) {
    this.credentials = credentials
  }

  async authenticate(): Promise<string> {
    if (!this.credentials) {
      throw new Error("Credentials not set. Call setCredentials() first.")
    }

    // Check if current token is still valid
    if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.token.access_token
    }

    try {
      const response = await fetch(`${this.baseUrl}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          username: this.credentials.username,
          password: this.credentials.password,
          client_id: this.credentials.clientId,
          scope: this.credentials.scope?.join(" ") || "FullAccess",
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Authentication failed: ${response.status} ${errorText}`)
      }

      const authData: OrderCloudAuthResponse = await response.json()

      this.token = {
        access_token: authData.access_token,
        token_type: authData.token_type,
        expires_in: authData.expires_in,
        refresh_token: authData.refresh_token,
      }

      // Set token expiry (subtract 5 minutes for safety)
      this.tokenExpiry = new Date(Date.now() + (authData.expires_in - 300) * 1000)

      return this.token.access_token
    } catch (error) {
      throw new Error(
        `Failed to authenticate with OrderCloud: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.authenticate()
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  isAuthenticated(): boolean {
    return this.token !== null && this.tokenExpiry !== null && new Date() < this.tokenExpiry
  }

  clearAuth() {
    this.token = null
    this.tokenExpiry = null
  }
}

// Singleton instance
export const orderCloudAuth = new OrderCloudAuth()

// Helper function to initialize auth with environment variables
export function initializeOrderCloudAuth() {
  const username = process.env.ORDERCLOUD_USERNAME
  const password = process.env.ORDERCLOUD_PASSWORD
  const clientId = process.env.ORDERCLOUD_CLIENT_ID
  const baseUrl = process.env.ORDERCLOUD_BASE_URL

  if (!username || !password || !clientId) {
    throw new Error(
      "Missing required OrderCloud environment variables: ORDERCLOUD_USERNAME, ORDERCLOUD_PASSWORD, ORDERCLOUD_CLIENT_ID",
    )
  }

  if (baseUrl) {
    orderCloudAuth.constructor(baseUrl)
  }

  orderCloudAuth.setCredentials({
    username,
    password,
    clientId,
    scope: ["FullAccess"], // Can be customized based on needs
  })

  return orderCloudAuth
}
