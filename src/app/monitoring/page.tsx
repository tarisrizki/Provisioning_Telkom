export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Monitoring</h1>
        <p className="text-gray-400">
          Real-time monitoring of your provisioning system performance and status.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1e293b] border border-[#334155] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg">
              <span className="text-gray-300">Database Connection</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-sm">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg">
              <span className="text-gray-300">API Services</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-sm">Running</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg">
              <span className="text-gray-300">File Storage</span>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-400 text-sm">Warning</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">99.8%</p>
              <p className="text-sm text-gray-400">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">45ms</p>
              <p className="text-sm text-gray-400">Avg Response</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">1.2K</p>
              <p className="text-sm text-gray-400">Requests/min</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-[#0f172a] rounded-lg">
            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-300">Storage usage at 85%</span>
            <span className="text-gray-500 text-sm ml-auto">5 min ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[#0f172a] rounded-lg">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Backup completed successfully</span>
            <span className="text-gray-500 text-sm ml-auto">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
