import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const CategoryManagement = () => {
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await api.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setMessage('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.createCategory(newCategoryName, token);
      setMessage('Category created successfully!');
      setNewCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error('Create category error:', error);
      setMessage('Failed to create category.');
    }
  };

  const handleUpdateCategory = async (id) => {
    setMessage('');
    try {
      await api.updateCategory(id, editingCategoryName, token);
      setMessage('Category updated successfully!');
      setEditingCategoryId(null);
      setEditingCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error('Update category error:', error);
      setMessage('Failed to update category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? Tickets assigned to it will have their category removed.')) {
      setMessage('');
      try {
        await api.deleteCategory(id, token);
        setMessage('Category deleted successfully!');
        fetchCategories();
      } catch (error) {
        console.error('Delete category error:', error);
        setMessage('Failed to delete category.');
      }
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading categories...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Category Management</h3>

      <form onSubmit={handleCreateCategory} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Add Category
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingCategoryId === category.id ? (
                    <input
                      type="text"
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-md"
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingCategoryId === category.id ? (
                    <>
                      <button
                        onClick={() => handleUpdateCategory(category.id)}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditingCategoryId(null); setEditingCategoryName(''); }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setEditingCategoryId(category.id); setEditingCategoryName(category.name); }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default CategoryManagement;
