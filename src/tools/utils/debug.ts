/**
 * Debug utilities for MCP server development
 * These utilities help debug without interfering with MCP protocol
 */
export class DebugLogger {
  static logs: Array<{
    timestamp: string
    operation: string
    params?: any
    result?: any
    error?: Error
    duration?: number
  }> = []
  
  static maxLogs = 100

  static log(operation: string, params?: any, result?: any, error?: Error, duration?: number) {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      operation,
      params,
      result,
      error,
      duration
    }
    
    this.logs.push(debugInfo)
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
    
    // Note: Removed console.log to avoid interfering with MCP protocol
    // Debug logs are stored in memory and can be retrieved via get_debug_logs tool
  }

  static getLogs() {
    return [...this.logs]
  }

  static clearLogs() {
    this.logs = []
  }

  static getLastLog() {
    return this.logs.length > 0 ? this.logs[this.logs.length - 1] : null
  }
}

/**
 * Wraps an async function with debug logging
 */
export function withDebugLogging<T extends (...args: any[]) => Promise<any>>(
  operation: string, 
  fn: T
): T {
  return (async (...args: any[]) => {
    const startTime = Date.now()
    try {
      DebugLogger.log(operation, args)
      const result = await fn(...args)
      const duration = Date.now() - startTime
      DebugLogger.log(operation, args, result, undefined, duration)
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      DebugLogger.log(operation, args, undefined, error as Error, duration)
      throw error
    }
  }) as T
}

/**
 * Creates a debug response for MCP tools
 */
export function createDebugResponse(debugInfo: any, includeLogs = false) {
  const debugData: any = {
    operation: debugInfo.operation,
    timestamp: debugInfo.timestamp,
    duration: debugInfo.duration,
    params: debugInfo.params,
    error: debugInfo.error ? {
      message: debugInfo.error.message,
      stack: debugInfo.error.stack
    } : undefined
  }

  if (includeLogs) {
    debugData.recentLogs = DebugLogger.getLogs().slice(-5)
  }

  return {
    content: [
      {
        type: "text",
        text: `DEBUG INFO:\n${JSON.stringify(debugData, null, 2)}`
      }
    ]
  }
}
