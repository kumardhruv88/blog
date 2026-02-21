import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLayout from './components/layout/UserLayout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';
import UserDashboard from './pages/UserDashboard';
import CreatePost from './pages/CreatePost';
import Search from './pages/Search';
import Category from './pages/Category';
import Tags from './pages/Tags';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Snippets from './pages/Snippets';
import About from './pages/About';
import Contact from './pages/Contact';
import UserProfile from './pages/UserProfile';
import PlaceholderPage from './pages/Placeholder';
import CodePlayground from './pages/CodePlayground';
import ResearchPapers from './pages/ResearchPapers';

// Admin Imports
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminPosts from './pages/AdminPosts';
import AdminUsers from './pages/AdminUsers';
import AdminCategories from './pages/AdminCategories';
import AdminTags from './pages/AdminTags';
import AdminComments from './pages/AdminComments';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import AdminActivity from './pages/AdminActivity';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<PostDetail />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/search" element={<Search />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/tags/:tag" element={<Tags />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        
        {/* Supplemental Pages */}
        <Route path="/snippets" element={<Snippets />} />
        <Route path="/about" element={<About />} />
        <Route path="/research" element={<ResearchPapers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile/:username" element={<UserProfile />} />
        
        {/* Legal Placeholders */}
        <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
        <Route path="/terms" element={<PlaceholderPage title="Terms of Service" />} />
        
        <Route path="*" element={<PlaceholderPage title="404 - Not Found" />} />
      </Route>

      <Route path="/playground" element={<CodePlayground />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="posts" element={<AdminPosts />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="tags" element={<AdminTags />} />
        <Route path="comments" element={<AdminComments />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="logs" element={<AdminActivity />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
