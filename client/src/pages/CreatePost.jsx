import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../services/api";
import { toast } from "react-toastify";

const CATEGORIES = [
  { value: "Programming", label: "💻 Programming" },
  { value: "Tech", label: "🔧 Tech" },
  { value: "Tutorial", label: "📚 Tutorial" },
  { value: "career", label: "🎯 Career" },
  { value: "others", label: "📝 Others" },
];

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const tagsArray = tags.split(",").map((t) => t.trim()).filter((t) => t);
      const formData = new FormData();

formData.append("title", title);
formData.append("content", content);
formData.append("category", category);
formData.append("tags", tagsArray);
formData.append("image", image); // ✅ IMPORTANT

await createBlog(formData);
      toast.success("Post published! 🎉");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="animate-fade-in-up">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">✍️ Create New Post</h1>
          <p className="text-sm text-gray-500 mt-1">Share your knowledge with the community</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="An amazing blog post title..."
              required
              minLength={3}
              maxLength={100}
              className="w-full px-4 py-3 rounded-lg text-sm border border-gray-300 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here... (min 30 characters)"
              required
              minLength={30}
              rows={12}
              className="w-full px-4 py-3 rounded-lg text-sm border border-gray-300 text-gray-700 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition leading-relaxed"
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm border border-gray-300 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer transition"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="react, javascript, web"
                className="w-full px-4 py-3 rounded-lg text-sm border border-gray-300 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
            </div>
            <input
  type="file"
  accept="image/*"
  onChange={(e) => setImage(e.target.files[0])}
  className="border p-2 rounded w-full"
/>
{image && (
  <img
    src={URL.createObjectURL(image)}
    alt="preview"
    className="w-full h-48 object-cover rounded mt-3"
  />
)}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-60 cursor-pointer transition-colors"
            >
              {loading ? "Publishing..." : "🚀 Publish Post"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
