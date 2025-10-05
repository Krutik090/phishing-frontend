import { LayoutDashboard, LayoutList, Moon, Sun, Lock, Shield, Eye, EyeOff, Key, CheckCircle2, Copy, Bell, User, Database } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLayout } from "../context/LayoutContext";
import { useState } from "react";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { layoutMode, setLayoutMode } = useLayout();

  // Password Change State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // MFA State
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaSecret] = useState("JBSWY3DPEHPK3PXP");
  const [backupCodes] = useState([
    "A1B2-C3D4-E5F6",
    "G7H8-I9J0-K1L2",
    "M3N4-O5P6-Q7R8",
    "S9T0-U1V2-W3X4",
  ]);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password change:", passwordForm);
    alert("Password updated successfully!");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleMfaSetup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("MFA Code:", mfaCode);
    setMfaEnabled(true);
    setShowMfaSetup(false);
    alert("MFA enabled successfully!");
  };

  return (
    <div className="w-full px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground/60 mt-2">Manage your account preferences and security settings</p>
      </div>

      {/* Two Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          
          {/* Appearance Section */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              {/* Theme Setting */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Theme Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-lg border-2 transition-colors ${
                      theme === 'light'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Sun className="w-6 h-6" />
                    <span className="font-medium text-sm">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-lg border-2 transition-colors ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Moon className="w-6 h-6" />
                    <span className="font-medium text-sm">Dark</span>
                  </button>
                </div>
              </div>

              {/* Layout Setting */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Layout Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLayoutMode('sidebar')}
                    className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-lg border-2 transition-colors ${
                      layoutMode === 'sidebar'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <LayoutDashboard className="w-6 h-6" />
                    <span className="font-medium text-sm">Sidebar</span>
                  </button>
                  <button
                    onClick={() => setLayoutMode('header')}
                    className={`flex flex-col items-center justify-center gap-2 px-4 py-4 rounded-lg border-2 transition-colors ${
                      layoutMode === 'header'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <LayoutList className="w-6 h-6" />
                    <span className="font-medium text-sm">Header</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-foreground/60 mt-1">Must be at least 8 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Account Settings */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Account</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-foreground/70">Email</span>
                <span className="font-medium text-foreground">admin@example.com</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-foreground/70">Account Created</span>
                <span className="font-medium text-foreground">Jan 15, 2025</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-foreground/70">Last Login</span>
                <span className="font-medium text-foreground">Today, 10:30 AM</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* Multi-Factor Authentication */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h2>
              </div>
              {mfaEnabled && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </div>
              )}
            </div>

            <p className="text-sm text-foreground/60 mb-4">
              Secure your account with an additional authentication layer.
            </p>

            {!mfaEnabled && !showMfaSetup && (
              <button
                onClick={() => setShowMfaSetup(true)}
                className="w-full px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Enable MFA
              </button>
            )}

            {mfaEnabled && (
              <div className="space-y-4">
                <div className="p-4 bg-background rounded-lg border border-border">
                  <p className="text-sm text-foreground font-medium mb-2">Backup Codes</p>
                  <p className="text-xs text-foreground/60 mb-3">
                    Save these codes securely. Use them if you lose access to your device.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-2 bg-card border border-border rounded font-mono text-xs">
                        <span>{code}</span>
                        <button className="text-foreground/60 hover:text-foreground">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMfaEnabled(false);
                    alert("MFA disabled");
                  }}
                  className="w-full px-6 py-2 bg-destructive text-white rounded-lg font-medium hover:bg-destructive/90 transition-colors"
                >
                  Disable MFA
                </button>
              </div>
            )}

            {/* MFA Setup */}
            {showMfaSetup && (
              <div className="mt-4 space-y-4">
                <div className="space-y-3">
                  <p className="text-sm text-foreground/70">
                    <strong>Step 1:</strong> Scan this QR code with your authenticator app
                  </p>
                  
                  <div className="w-40 h-40 bg-white p-3 rounded-lg mx-auto flex items-center justify-center">
                    <div className="w-full h-full bg-black/10 rounded flex items-center justify-center">
                      <Key className="w-10 h-10 text-foreground/40" />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-foreground/60 mb-1">Manual entry code:</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded font-mono text-xs">
                      <span>{mfaSecret}</span>
                      <button className="text-foreground/60 hover:text-foreground">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/70">
                    <strong>Step 2:</strong> Enter verification code
                  </p>

                  <form onSubmit={handleMfaSetup} className="space-y-3">
                    <input
                      type="text"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-center text-xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      maxLength={6}
                      required
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowMfaSetup(false);
                          setMfaCode("");
                        }}
                        className="flex-1 px-4 py-2 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      >
                        Verify
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                <span className="text-sm text-foreground">Email notifications</span>
                <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                <span className="text-sm text-foreground">Campaign alerts</span>
                <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                <span className="text-sm text-foreground">Security alerts</span>
                <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
              </label>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">System</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-foreground/70">Version</span>
                <span className="font-medium text-foreground">v2.1.0</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-foreground/70">Database</span>
                <span className="font-medium text-green-600 dark:text-green-400">Connected</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-foreground/70">Storage Used</span>
                <span className="font-medium text-foreground">2.4 GB / 10 GB</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
