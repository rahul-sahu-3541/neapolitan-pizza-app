import React, { useState, useEffect } from 'react';
import { fetchMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../../../services/api';
import { Edit2, Trash2, Plus, Search, CheckCircle2 } from 'lucide-react';

const AdminMenu = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    imageUrl: '',
    isAvailable: true,
    isVegetarian: true,
    categoryId: ''
  });

  const loadMenu = async () => {
    try {
      const data = await fetchMenu();
      setCategories(data.categories);
      if (data.categories.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: data.categories[0].id }));
      }
    } catch (err) {
      console.error('Failed to load menu', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (item, categoryId) => {
    setEditingItem(item.id);
    setFormData({
      name: item.name,
      description: item.description || '',
      basePrice: item.basePrice,
      imageUrl: item.imageUrl || '',
      isAvailable: item.isAvailable,
      isVegetarian: item.dietaryType === 'VEG',
      categoryId: categoryId
    });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      name: '', description: '', basePrice: '', imageUrl: '', 
      isAvailable: true, isVegetarian: true, categoryId: categories[0]?.id || ''
    });
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setTimeout(() => {
      setEditingItem(null);
      setFormData({
        name: '', description: '', basePrice: '', imageUrl: '', 
        isAvailable: true, isVegetarian: true, categoryId: categories[0]?.id || ''
      });
    }, 200); // Wait for transition
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMenuItem(editingItem, formData);
      } else {
        await createMenuItem(formData);
      }
      handleCancel();
      loadMenu();
    } catch (err) {
      console.error('Failed to save menu item', err);
      alert('Failed to save menu item');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item from the catalog?')) {
      try {
        await deleteMenuItem(id);
        loadMenu();
      } catch (err) {
        console.error('Failed to delete', err);
        alert('Failed to delete item');
      }
    }
  };

  const handleToggleAvailability = async (item, categoryId) => {
    // Optimistic UI update for instant toggle animation
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        items: cat.items.map(i => i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i)
      };
    }));

    try {
      await updateMenuItem(item.id, {
        name: item.name,
        description: item.description || '',
        basePrice: item.basePrice,
        imageUrl: item.imageUrl || '',
        isAvailable: !item.isAvailable, // Toggle
        isVegetarian: item.dietaryType === 'VEG',
        categoryId: categoryId
      });
      // Optionally loadMenu() here if needed, but optimistic UI already handled it!
      // loadMenu(); 
    } catch (err) {
      console.error('Failed to toggle', err);
      // Revert on failure
      loadMenu();
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center font-bold text-gray-400">Loading catalog...</div>;

  return (
    <div className="h-full flex flex-col relative">
      
      {/* Top Action Bar */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search dishes to toggle availability..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:border-gray-400 transition-colors"
          />
        </div>
        <button 
          onClick={handleAddNew}
          className="px-5 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} /> Add Rare Item
        </button>
      </div>

      {/* Catalog List (Full Width) */}
      <div className="flex-1 overflow-y-auto pb-12">
        <div className="space-y-8">
          {categories.map(category => {
            const filteredItems = category.items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
            if (filteredItems.length === 0) return null;
            
            return (
              <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">{category.name}</h3>
                  <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{filteredItems.length}</span>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {filteredItems.map((item) => (
                    <div key={item.id} className={`flex items-center justify-between p-6 hover:bg-gray-50/50 transition-colors ${!item.isAvailable ? 'bg-gray-50' : ''}`}>
                      
                      <div className="flex items-center gap-6 flex-1">
                        <div className="flex items-center gap-3 w-32">
                          <label className="relative inline-flex items-center cursor-pointer scale-110 shrink-0">
                            <input type="checkbox" className="sr-only peer" checked={item.isAvailable} onChange={() => handleToggleAvailability(item, category.id)} />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 peer-checked:bg-green-500"></div>
                          </label>
                          <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${item.isAvailable ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`}></div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm shrink-0 ${item.dietaryType === 'VEG' ? 'border-green-600' : 'border-red-600'}`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${item.dietaryType === 'VEG' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                          </div>
                          <div>
                            <div className="font-black text-gray-900 text-lg flex items-center gap-3">
                              <span className={!item.isAvailable ? 'line-through text-gray-400' : ''}>{item.name}</span>
                              {!item.isAvailable && <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Out of Stock</span>}
                            </div>
                            <div className="font-bold text-gray-500 mt-0.5">₹{item.basePrice}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 opacity-40 hover:opacity-100 transition-opacity">
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEdit(item, category.id); }} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Edit Item">
                          <Edit2 size={18} />
                        </button>
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item.id); }} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Delete Item">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Overlay for Add/Edit */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {editingItem ? <Edit2 size={24} className="text-blue-500" /> : <Plus size={24} className="text-green-500" />}
                {editingItem ? 'Edit Menu Item' : 'Add New Item'}
              </h3>
              <button onClick={handleCancel} className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition-colors">
                &times;
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <form id="menu-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Dish Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3.5 bg-gray-50 outline-none focus:border-gray-900 focus:bg-white transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category *</label>
                    <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3.5 bg-gray-50 outline-none focus:border-gray-900 focus:bg-white transition-colors">
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Price (₹) *</label>
                    <input type="number" required min="0" step="0.01" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3.5 bg-gray-50 outline-none focus:border-gray-900 focus:bg-white transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3.5 bg-gray-50 outline-none focus:border-gray-900 focus:bg-white transition-colors resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Image URL</label>
                  <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3.5 bg-gray-50 outline-none focus:border-gray-900 focus:bg-white transition-colors" placeholder="https://..." />
                </div>

                <div className="flex gap-4 pt-2">
                  <label className="flex-1 flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                    <input type="radio" checked={formData.isVegetarian} onChange={() => setFormData({...formData, isVegetarian: true})} className="w-4 h-4 accent-green-600" />
                    <span className="font-bold text-gray-700">Veg</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                    <input type="radio" checked={!formData.isVegetarian} onChange={() => setFormData({...formData, isVegetarian: false})} className="w-4 h-4 accent-red-600" />
                    <span className="font-bold text-gray-700">Non-Veg</span>
                  </label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-3">
              <button type="button" onClick={handleCancel} className="flex-1 py-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" form="menu-form" className="flex-[2] py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-colors shadow-lg shadow-black/10 flex items-center justify-center gap-2">
                {editingItem ? <CheckCircle2 size={20} /> : <Plus size={20} />}
                {editingItem ? 'Save Changes' : 'Add to Catalog'}
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
