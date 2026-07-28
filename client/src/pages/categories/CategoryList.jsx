import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Tags } from 'lucide-react';
import categoryService from '../../services/categoryService';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate, getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, category: null });
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data.data.categories);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async () => {
    if (!deleteModal.category) return;

    setDeleting(true);
    try {
      await categoryService.delete(deleteModal.category._id);
      toast.success('Category deleted successfully');
      setDeleteModal({ open: false, category: null });
      fetchCategories();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader text="Loading categories..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your product categories
          </p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/categories/add')}>
          Add Category
        </Button>
      </div>

      {/* Table */}
      {categories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="No categories yet"
          description="Create your first category to organize your products."
          actionLabel="Add Category"
          onAction={() => navigate('/categories/add')}
        />
      ) : (
        <Table
          columns={['Name', 'Description', 'Created', 'Actions']}
          data={categories}
          renderRow={(category) => (
            <tr
              key={category._id}
              className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
            >
              <td className="table-cell">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <Tags className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                </div>
              </td>
              <td className="table-cell text-gray-500 dark:text-gray-400 max-w-xs truncate">
                {category.description || '—'}
              </td>
              <td className="table-cell text-gray-500">
                {formatDate(category.createdAt)}
              </td>
              <td className="table-cell">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/categories/edit/${category._id}`)}
                    className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, category })}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, category: null })}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteModal.category?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default CategoryList;
