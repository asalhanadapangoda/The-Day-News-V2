import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Search from './pages/Search';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManagePrograms from './pages/admin/ManagePrograms';
import ManageEpisodes from './pages/admin/ManageEpisodes';
import ManageArticles from './pages/admin/ManageArticles';
import ManageCategories from './pages/admin/ManageCategories';
import ManageAds from './pages/admin/ManageAds';
import ManageMessages from './pages/admin/ManageMessages';
import ManageSettings from './pages/admin/ManageSettings';
import ManageHero from './pages/admin/ManageHero';
import ManageTeam from './pages/admin/ManageTeam';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:slug" element={<ProgramDetail />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Search />} />
        </Route>

        {/* Admin Login (No Layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="programs" element={<ManagePrograms />} />
          <Route path="episodes" element={<ManageEpisodes />} />
          <Route path="articles" element={<ManageArticles />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="ads" element={<ManageAds />} />
          <Route path="messages" element={<ManageMessages />} />
          <Route path="settings" element={<ManageSettings />} />
          <Route path="heroes" element={<ManageHero />} />
          <Route path="team" element={<ManageTeam />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
