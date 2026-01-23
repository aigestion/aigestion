// Simulating an API response type
export type SystemStats = {
  activeUsers: number
  systemHealth: string
  cpuLoad: number
}

export async function fetchSystemStats(): Promise<SystemStats> {
  // In a real scenario, this would be:
  // const response = await fetch('https://api.aigestion.com/stats')
  // const json = await response.json()

  // simulating network delay
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve({
              activeUsers: Math.floor(Math.random() * 500) + 1200,
              systemHealth: Math.random() > 0.9 ? 'WARNING' : 'OPTIMAL',
              cpuLoad: Math.floor(Math.random() * 30) + 20
          })
      }, 500)
  })
}
