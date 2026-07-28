import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { getErrorMessage, getImageUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      purchasePrice: '',
      sellingPrice: '',
      quantity: '',
    },
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        setCategories(response.data.data.categories);
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Fetch product data for editing
  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const response = await productService.getById(id);
          const product = response.data.data.product;
          reset({
            name: product.name,
            sku: product.sku,
            category: product.category?._id || product.category,
            purchasePrice: product.purchasePrice,
            sellingPrice: product.sellingPrice,
            quantity: product.quantity,
          });
          if (product.image) {
            setImagePreview(getImageUrl(product.image));
          }
        } catch (error) {
          toast.error(getErrorMessage(error));
          navigate('/products');
        } finally {
          setFetching(false);
        }
      };

      fetchProduct();
    }
  }, [id, isEditing, reset, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const productData = {
        ...data,
        purchasePrice: parseFloat(data.purchasePrice),
        sellingPrice: parseFloat(data.sellingPrice),
        quantity: parseInt(data.quantity, 10),
      };

      if (imageFile) {
        productData.image = imageFile;
      }

      if (isEditing) {
        await productService.update(id, productData);
        toast.success('Product updated successfully');
      } else {
        await productService.create(productData);
        toast.success('Product created successfully');
      }
      navigate('/products');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader text="Loading product..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Product' : 'Add Product'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isEditing ? 'Update product information' : 'Add a new product to inventory'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Product Name *"
              placeholder="e.g., Wireless Mouse"
              error={errors.name?.message}
              {...register('name', {
                required: 'Product name is required',
                maxLength: {
                  value: 200,
                  message: 'Name cannot exceed 200 characters',
                },
              })}
            />

            <Input
              label="SKU *"
              placeholder="e.g., WM-001"
              error={errors.sku?.message}
              {...register('sku', {
                required: 'SKU is required',
                maxLength: {
                  value: 50,
                  message: 'SKU cannot exceed 50 characters',
                },
              })}
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category *
            </label>
            <select
              className={`input-field ${errors.category ? 'input-error' : ''}`}
              {...register('category', {
                required: 'Category is required',
              })}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1 animate-fade-in">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="Purchase Price *"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              error={errors.purchasePrice?.message}
              {...register('purchasePrice', {
                required: 'Purchase price is required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
            />

            <Input
              label="Selling Price *"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              error={errors.sellingPrice?.message}
              {...register('sellingPrice', {
                required: 'Selling price is required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
            />

            <Input
              label="Quantity *"
              type="number"
              min="0"
              placeholder="0"
              error={errors.quantity?.message}
              {...register('quantity', {
                required: 'Quantity is required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Image
            </label>
            {imagePreview ? (
              <div className="relative w-40 h-40 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-dark-border group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-xl cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition-colors bg-gray-50 dark:bg-dark-input">
                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-xs text-gray-400">Upload Image</span>
                <span className="text-[10px] text-gray-300 mt-0.5">Max 5MB</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
            <Button type="submit" icon={Save} loading={loading}>
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/products')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
