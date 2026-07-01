import { useEffect, useState } from "react";
import { Trash2, FolderPlus, AlertTriangle, X } from "lucide-react";

export function AdminSettings() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = () => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(setCategories)
      .catch(console.error);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const confirmDeleteCategory = () => {
    if (!deleteId) return;
    setIsDeleting(true);
    fetch(`/api/categories/${deleteId}`, { method: "DELETE" })
      .then(() => {
        fetchCategories();
        setDeleteId(null);
        setIsDeleting(false);
      })
      .catch((err) => {
        console.error(err);
        setIsDeleting(false);
      });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCatName })
    })
      .then(() => {
        setNewCatName("");
        setIsAddingCategory(false);
        fetchCategories();
      });
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight heading-display">Settings</h1>
        <p className="text-gray-500 mt-1 font-medium">Manage publication settings, category taxonomies, and options.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-8">
        <div className="p-6 border-b border-gray-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-950">Categories</h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Organize blog articles and resource guides.</p>
          </div>
          {!isAddingCategory && (
            <button 
              onClick={() => setIsAddingCategory(true)}
              className="flex items-center gap-2 text-sm bg-gray-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors self-start sm:self-auto shadow-sm"
            >
              <FolderPlus className="h-4.5 w-4.5" />
              Add Category
            </button>
          )}
        </div>

        {isAddingCategory && (
          <form onSubmit={handleAddCategory} className="p-6 border-b border-gray-150 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-in">
            <input 
              type="text" 
              required
              className="flex-1 border border-gray-200 rounded-xl p-2.5 px-4 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 bg-white font-medium text-sm transition-all" 
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              placeholder="e.g. Bitcoin News"
              autoFocus
            />
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button 
                type="button" 
                onClick={() => setIsAddingCategory(false)} 
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-brand-500 text-white rounded-xl px-4 py-2.5 text-xs font-bold hover:bg-brand-600 transition-colors shadow-sm"
              >
                Save Category
              </button>
            </div>
          </form>
        )}

        <ul className="divide-y divide-gray-100">
          {categories.map((cat) => (
            <li key={cat.id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50/30 transition-colors">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-950">{cat.name}</span>
                <span className="text-gray-400 text-xs font-semibold bg-gray-100 border border-gray-150 px-2.5 py-0.5 rounded-full">/{cat.slug}</span>
              </div>
              <button 
                onClick={() => setDeleteId(cat.id)} 
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                title="Delete category"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </li>
          ))}
          {categories.length === 0 && (
            <li className="p-12 text-center text-gray-400 text-sm font-medium">No categories found.</li>
          )}
        </ul>
      </div>

      {/* Modern, elegant Custom Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-xs transition-opacity" onClick={() => setDeleteId(null)} />
          
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 transform transition-all animate-scale-up">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setDeleteId(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-4 items-start mb-6">
              <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-950 mb-1">Delete Category</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Are you sure you want to delete this category? (This won't remove the category association from any existing articles).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold text-white bg-red-500 border border-transparent rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
              >
                {isDeleting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
