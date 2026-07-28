import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Tags, AlertTriangle, TrendingDown } from 'lucide-react';
import dashboardService from '../services/dashboardService';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import Badge from '../components/ui/Badge';
import { formatCurrency, getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading dashboard..." />;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Overview of your inventory at a glance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={Package}
          color="primary"
          subtitle="All registered products"
        />
        <Card
          title="Total Categories"
          value={stats?.totalCategories || 0}
          icon={Tags}
          color="emerald"
          subtitle="Active categories"
        />
        <Card
          title="Low Stock Items"
          value={stats?.lowStockCount || 0}
          icon={AlertTriangle}
          color={stats?.lowStockCount > 0 ? 'red' : 'amber'}
          subtitle="Quantity below 10"
        />
      </div>

      {/* Low Stock Products Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Low Stock Products
              </h2>
              <p className="text-xs text-gray-400">Products with quantity less than 10</p>
            </div>
          </div>
          {stats?.lowStockProducts?.length > 0 && (
            <Badge variant="danger">{stats.lowStockProducts.length} items</Badge>
          )}
        </div>

        {stats?.lowStockProducts?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-border">
                  <th className="table-header">Product</th>
                  <th className="table-header">SKU</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Price</th>
                  <th className="table-header">Quantity</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {stats.lowStockProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors cursor-pointer"
                    onClick={() => navigate(`/products/edit/${product._id}`)}
                  >
                    <td className="table-cell font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </td>
                    <td className="table-cell">
                      <span className="font-mono text-xs bg-gray-100 dark:bg-dark-hover px-2 py-1 rounded">
                        {product.sku}
                      </span>
                    </td>
                    <td className="table-cell">
                      {product.category?.name || 'N/A'}
                    </td>
                    <td className="table-cell">
                      {formatCurrency(product.sellingPrice)}
                    </td>
                    <td className="table-cell">
                      <span className={`font-semibold ${
                        product.quantity === 0
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="table-cell">
                      <Badge variant={product.quantity === 0 ? 'danger' : 'warning'}>
                        {product.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">All products are well-stocked!</p>
            <p className="text-xs text-gray-400 mt-1">No products below the threshold of 10 units</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
