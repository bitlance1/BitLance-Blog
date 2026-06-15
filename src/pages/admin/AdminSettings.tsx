import { useEffect, useState } from "react";
import { Trash2, FolderPlus } from "lucide-react";

export function AdminSettings() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const fetchCategories = () => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(setCategories)
      .catch(console.error);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure? This doesn't remove the category from existing articles.")) {
      fetch(`/api/categories/${id}`, { method: "DELETE" })
        .then(() => fetchCategories());
    }
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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-1">Manage publication settings and taxonomy.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-8">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Categories</h2>
            <p className="text-sm text-gray-500">Manage article categories.</p>
          </div>
          <button 
            onClick={() => setIsAddingCategory(true)}
            className="flex items-center gap-2 text-sm bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <FolderPlus className="h-4 w-4" />
            Add Category
          </button>
        </div>

        {isAddingCategory && (
          <form onSubmit={handleAddCategory} className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
            <input 
              type="text" 
              className="flex-1 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-gray-500 bg-white" 
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              placeholder="e.g. Bitcoin News"
              autoFocus
            />
            <button type="button" onClick={() => setIsAddingCategory(false)} className="text-gray-500 hover:text-gray-900 text-sm font-medium px-2">Cancel</button>
            <button type="submit" className="bg-brand-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-brand-600 transition-colors">Save</button>
          </form>
        )}

        <ul className="divide-y divide-gray-100">
          {categories.map((cat) => (
            <li key={cat.id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <span className="font-semibold text-gray-900">{cat.name}</span>
                <span className="text-gray-400 text-sm ml-2">/{cat.slug}</span>
              </div>
              <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
          {categories.length === 0 && (
            <li className="p-8 text-center text-gray-500 text-sm">No categories found.</li>
          )}
        </ul>
      </div>

    </div>
  );
}
