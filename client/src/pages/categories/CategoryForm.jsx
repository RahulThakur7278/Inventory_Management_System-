import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import categoryService from '../../services/categoryService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Fetch category data for editing
  useEffect(() => {
    if (isEditing) {
      const fetchCategory = async () => {
        try {
          const response = await categoryService.getById(id);
          const category = response.data.data.category;
          reset({
            name: category.name,
            description: category.description || '',
          });
        } catch (error) {
          toast.error(getErrorMessage(error));
          navigate('/categories');
        } finally {
          setFetching(false);
        }
      };

      fetchCategory();
    }
  }, [id, isEditing, reset, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEditing) {
        await categoryService.update(id, data);
        toast.success('Category updated successfully');
      } else {
        await categoryService.create(data);
        toast.success('Category created successfully');
      }
      navigate('/categories');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader text="Loading category..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/categories')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Category' : 'Add Category'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isEditing ? 'Update category information' : 'Create a new product category'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <Input
            label="Category Name *"
            placeholder="e.g., Electronics"
            error={errors.name?.message}
            {...register('name', {
              required: 'Category name is required',
              maxLength: {
                value: 100,
                message: 'Name cannot exceed 100 characters',
              },
            })}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter category description (optional)"
              className="input-field resize-none"
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'Description cannot exceed 500 characters',
                },
              })}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1 animate-fade-in">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
            <Button type="submit" icon={Save} loading={loading}>
              {isEditing ? 'Update Category' : 'Create Category'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/categories')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
