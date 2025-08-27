// Dashboard data configuration - now fetches from Supabase
export const dashboardConfig = {
  // Static configuration only - no hardcoded data
  months: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
}

export const chartConfig = {
  colors: {
    primary: "#3b82f6",
    secondary: "#f97316",
    grid: "#334155",
    text: "#9ca3af",
    background: "#1e293b",
    border: "#334155"
  },
  
  tooltipStyle: {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "white"
  }
}
