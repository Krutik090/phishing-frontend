import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';

// Placeholder components for other routes
const Campaigns = () => <div className="p-6">Campaigns Page</div>;
const EmailTemplates = () => <div className="p-6">Email Templates Page</div>;
const LandingPages = () => <div className="p-6">Landing Pages</div>;
const Users = () => <div className="p-6">Users & Groups</div>;
const Profiles = () => <div className="p-6">Sending Profiles</div>;
const IMAP = () => <div className="p-6">IMAP Settings</div>;
const Management = () => <div className="p-6">User Management</div>;
const Training = () => <div className="p-6">Training</div>;
const Quiz = () => <div className="p-6">Quiz</div>;
const Settings = () => <div className="p-6">Settings</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route - No Layout */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - With Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/templates" element={<EmailTemplates />} />
          <Route path="/pages" element={<LandingPages />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/imap" element={<IMAP />} />
          <Route path="/management" element={<Management />} />
          <Route path="/training" element={<Training />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
