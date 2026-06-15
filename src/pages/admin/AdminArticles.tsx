import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Eye } from "lucide-react";

export function AdminArticles() {
  const [articles, setArticles] = useState([]);

  const fetchArticles = () => {
    fetch("/api/articles")
      .then(r => r.json())
      .then(setArticles);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = (id: string) => {
    if(confirm("Are you sure?")) {
      fetch(`/api/articles/${id}`, { method: "DELETE" })
        .then(() => fetchArticles());
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Articles</h1>
          <p className="text-gray-500 mt-1">Manage all published and drafted content.</p>
        </div>
        <Link to="/admin/editor/new" className="bg-brand-500 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-brand-600 transition-colors shadow-sm">
          Write Article
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Views</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map((article: any) => (
              <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-semibold text-gray-900">{article.title || "Untitled"}</div>
                  <div className="text-sm text-gray-500">{new Date(article.updated_at).toLocaleDateString()}</div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {article.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-500 text-sm">
                  {article.view_count || 0}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-3 text-gray-400">
                    <Link to={`/admin/editor/${article.id}`} className="hover:text-brand-500 transition-colors">
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDelete(article.id)} className="hover:text-red-500 transition-colors">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-500">
                  No articles found. Start writing!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
