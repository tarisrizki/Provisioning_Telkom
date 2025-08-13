// Dashboard data configuration
export const dashboardConfig = {
  monthlyData: [
    { date: "25-01", value: 120 },
    { date: "25-02", value: 180 },
    { date: "25-03", value: 250 },
    { date: "25-04", value: 348 },
    { date: "25-05", value: 320 },
    { date: "25-06", value: 280 },
    { date: "25-07", value: 310 },
    { date: "25-08", value: 290 },
    { date: "25-09", value: 350 },
    { date: "25-10", value: 380 },
    { date: "25-11", value: 420 },
    { date: "25-12", value: 450 },
  ],

  bimaStatusData: [
    { name: "Complete", value: 65, color: "#10b981" },
    { name: "Cancel Work", value: 15, color: "#f59e0b" },
    { name: "Work Fail", value: 20, color: "#ef4444" },
  ],

  fieldUpdateData: [
    { name: "Kendala Pelanggan", value: 85 },
    { name: "Kendala Teknik (UNSC)", value: 72 },
    { name: "Salah Segmen", value: 58 },
    { name: "Force Majuere", value: 42 },
  ],

  months: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],

  kpiCards: [
    {
      title: "Total Work Order",
      value: "9,699",
      trend: "8.5% Up from yesterday",
      trendType: "up" as const,
      color: "green" as const
    },
    {
      title: "Avg Provisioning Time",
      value: "5.4 hr",
      trend: "1.3% Up from past week",
      trendType: "up" as const,
      color: "green" as const
    },
    {
      title: "Success Rate",
      value: "78%",
      trend: "1.3% Up from past week",
      trendType: "up" as const,
      color: "green" as const
    },
    {
      title: "Failure Rate",
      value: "15%",
      trend: "4.3% Down from yesterday",
      trendType: "down" as const,
      color: "red" as const
    }
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
