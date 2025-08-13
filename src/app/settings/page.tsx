export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">
          Configure your provisioning system preferences and account settings.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-gray-500"
                placeholder="Enter your display name"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-white placeholder-gray-500"
                placeholder="Enter your email"
              />
            </div>
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
        
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Dark Theme</span>
              <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Notifications</span>
              <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Auto-save</span>
              <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
        <div className="space-y-4">
          <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
            Change Password
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ml-3">
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  )
}
