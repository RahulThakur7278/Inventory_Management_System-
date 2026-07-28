import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Package, Image as ImageIcon } from 'lucide-react';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import SearchBox from '../../components/ui/SearchBox';
import Pagination from '../../components/ui/Pagination';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { formatCurrency, formatDate, getErrorMessage, getImageUrl, LOW_STOCK_THRESHOLD } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search,
        ...(categoryFilter && { category: categoryFilter }),
      };

      const response = await productService.getAll(params);
      setProducts(response.data.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, categoryFilter]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.product) return;

    setDeleting(true);
    try {
      await productService.delete(deleteModal.product._id);
      toast.success('Product deleted successfully');
      setDeleteModal({ open: false, product: null });
      fetchProducts();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your product inventory
          </p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/products/add')}>
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBox
          placeholder="Search by name or SKU..."
          onSearch={handleSearch}
          value={search}
          className="flex-1 max-w-md"
        />
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="input-field w-full sm:w-48"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      {loading ? (
        <Loader text="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title={search || categoryFilter ? 'No products found' : 'No products yet'}
          description={
            search || categoryFilter
              ? 'Try adjusting your search or filter criteria.'
              : 'Add your first product to get started.'
          }
          actionLabel={!search && !categoryFilter ? 'Add Product' : undefined}
          onAction={!search && !categoryFilter ? () => navigate('/products/add') : undefined}
        />
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-dark-border">
                    <th className="table-header">Product</th>
                    <th className="table-header">SKU</th>
                    <th className="table-header">Category</th>
                    <th className="table-header">Purchase</th>
                    <th className="table-header">Selling</th>
                    <th className="table-header">Quantity</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
                    >
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-dark-border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-dark-hover flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className="font-mono text-xs bg-gray-100 dark:bg-dark-hover px-2 py-1 rounded">
                          {product.sku}
                        </span>
                      </td>
                      <td className="table-cell text-gray-500">
                        {product.category?.name || 'N/A'}
                      </td>
                      <td className="table-cell">{formatCurrency(product.purchasePrice)}</td>
                      <td className="table-cell font-medium">{formatCurrency(product.sellingPrice)}</td>
                      <td className="table-cell">
                        <span className={`font-semibold ${
                          product.quantity === 0
                            ? 'text-red-600 dark:text-red-400'
                            : product.quantity < LOW_STOCK_THRESHOLD
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="table-cell">
                        {product.quantity === 0 ? (
                          <Badge variant="danger">Out of Stock</Badge>
                        ) : product.quantity < LOW_STOCK_THRESHOLD ? (
                          <Badge variant="warning">Low Stock</Badge>
                        ) : (
                          <Badge variant="success">In Stock</Badge>
                        )}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/products/edit/${product._id}`)}
                            className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, product })}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage || 1}
            totalPages={pagination.totalPages || 1}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, product: null })}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.product?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default ProductList;
