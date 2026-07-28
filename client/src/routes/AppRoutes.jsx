import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import CategoryList from '../pages/categories/CategoryList';
import CategoryForm from '../pages/categories/CategoryForm';
import ProductList from '../pages/products/ProductList';
import ProductForm from '../pages/products/ProductForm';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/add" element={<CategoryForm />} />
        <Route path="/categories/edit/:id" element={<CategoryForm />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/add" element={<ProductForm />} />
        <Route path="/products/edit/:id" element={<ProductForm />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
