export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">
          Welcome to the ProvisioningTSEL management system.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Projects</p>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-xs text-gray-500">+2 from last month</p>
            </div>
            <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active Provisioning</p>
              <p className="text-2xl font-bold text-white">8</p>
              <p className="text-xs text-gray-500">+1 from last week</p>
            </div>
            <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-white">24</p>
              <p className="text-xs text-gray-500">+4 from last month</p>
            </div>
            <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-xs text-gray-500">-1 from last week</p>
            </div>
            <div className="h-8 w-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-[#0f172a] rounded-lg">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300">New user data uploaded</span>
            <span className="text-gray-500 text-sm ml-auto">2 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[#0f172a] rounded-lg">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">System backup completed</span>
            <span className="text-gray-500 text-sm ml-auto">1 hour ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-[#0f172a] rounded-lg">
            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-300">User authentication updated</span>
            <span className="text-gray-500 text-sm ml-auto">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
