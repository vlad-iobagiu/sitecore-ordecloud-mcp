import axios, { type AxiosInstance } from "axios"

export class BaseClient {
  protected client: AxiosInstance
  protected accessToken: string | null = null

  constructor(baseURL = "https://sandboxapi.ordercloud.io") {
    this.client = axios.create({ baseURL })

    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`
      }
      return config
    })
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  ensureAuthenticated() {
    if (!this.accessToken) {
      throw new Error("Not authenticated. Please call authenticate() first.")
    }
  }
}
