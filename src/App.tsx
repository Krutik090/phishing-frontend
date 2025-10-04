import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { UserGroups } from './pages/UserGroups';
import { EmailTemplate } from './pages/EmailTemplate';
import { PhishingPages } from './pages/PhishingPage';
import { SendingProfiles } from './pages/SendingProfiles';
import { UserManagement } from './pages/UserManagement';
import { ImapPage } from './pages/ImapPage';
import { QuizAdminPage } from './pages/QuizAdminPage';
import { PublicQuizPage } from './pages/PublicQuizPage';

// Placeholder components for other routes
const Campaigns = () => <div className="p-6">Campaigns Page</div>;
const Training = () => <div className="p-6">Training</div>;
const Settings = () => <div className="p-6">Settings</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route - No Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/public-quiz/:id" element={<PublicQuizPage />} />
        <Route path="/quiz-preview" element={<PublicQuizPage />} />

        {/* Protected Routes - With Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/templates" element={<EmailTemplate />} />
          <Route path="/phishing-pages" element={<PhishingPages />} />
          <Route path="/user-groups" element={<UserGroups />} />
          <Route path="/profiles" element={<SendingProfiles />} />
          <Route path="/imap" element={<ImapPage />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/training" element={<Training />} />
          <Route path="/quiz" element={<QuizAdminPage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
