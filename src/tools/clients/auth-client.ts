import { BaseClient } from "./base-client.js"
export class AuthClient extends BaseClient {
  async authenticate(username: string, clientId: string, password: string, scope = "FullAccess") {
    const authData = new URLSearchParams({
      client_id: clientId,
      grant_type: "password",
      username,
      password,
      scope,
    })

    const response = await this.client.post("/oauth/token", authData.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })

    this.setAccessToken(response.data.access_token)
    return response.data
  }
}
