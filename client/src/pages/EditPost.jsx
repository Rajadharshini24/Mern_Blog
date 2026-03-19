import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleBlog, updateBlog, deleteBlog } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const CATEGORIES = [
  { value: "Programming", label: "💻 Programming" },
  { value: "Tech", label: "🔧 Tech" },
  { value: "Tutorial", label: "📚 Tutorial" },
  { value: "career", label: "🎯 Career" },
  { value: "others", label: "📝 Others" },
];

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // NEW STATE FOR IMAGE
  const [image, setImage] = useState(null); // existing image URL or filename
  const [newImage, setNewImage] = useState(null); // preview for uploaded image

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getSingleBlog(id);
        const blog = res.data.blog;

        const currentUserId = user?._id || user?.user?._id;
        if (!currentUserId || blog.author?._id !== currentUserId) {
          toast.error("You're not authorized to edit this post");
          navigate("/");
          return;
        }

        setTitle(blog.title);
        setContent(blog.content);
        setCategory(blog.category);
        setTags(
          Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
        );
        setImage(blog.image); // set existing image
      } catch {
        setError("Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, user, navigate]);

  const handleUpdate = async (e) => {
  e.preventDefault();

  if (!title.trim() || !content.trim() || !category) {
    toast.error("Please fill in all required fields");
    return;
  }

  setSubmitting(true);
  try {
    const tagsArray = tags.split(",").map((t) => t.trim()).filter((t) => t);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("tags", tagsArray.join(","));
    
    // ✅ Append new image if selected
    if (newImage) formData.append("image", newImage);

    const res = await updateBlog(id, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // ✅ Update frontend state
    setImage(res.data.blog.image || null);
    setNewImage(null);

    toast.success("Post updated successfully ✨");
    navigate(`/blog/${id}`);
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Update failed");
  } finally {
    setSubmitting(false);
  }
};

  const handleDelete = async () => {
    try {
      await deleteBlog(id);
      toast.success("Post deleted");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
    setShowDeleteModal(false);
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">😔</p>
        <h2 className="text-2xl font-bold text-gray-900">{error}</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">✏️ Edit Post</h1>
            <p className="text-sm text-gray-500 mt-1">Update your post</p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 text-sm font-medium text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 cursor-pointer transition-colors"
          >
            🗑️ Delete
          </button>
        </div>

        {/* IMAGE PREVIEW */}
        {(newImage || image) && (
  <img
    src={newImage ? URL.createObjectURL(newImage) : `https://mern-blog-backend-wdq0.onrender.com${image}`}
    alt="Blog"
    className="mb-4 w-full h-64 object-cover rounded-lg"
  />
)}

        {/* Form */}
        <form
          onSubmit={handleUpdate}
          className="bg-white shadow-md rounded-xl p-6 space-y-6"
        >
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Change Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setNewImage(file);
              }}
              className="w-full text-sm text-gray-700"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              required
              minLength={3}
              maxLength={100}
              className="w-full px-4 py-3 rounded-lg text-sm border border-gray-300 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content..."
              required
              minLength={30}
              rows={12}
              className="w-full px-4 py-3 rounded-lg text-sm border border-gray-300 text-gray-700 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition leading-relaxed"
            />
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm border border-gray-300 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer transition"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="react, node, web"
                className="w-full px-4 py-3 rounded-lg text-sm border border-gray-300 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-60 cursor-pointer transition-colors"
            >
              {submitting ? "Updating..." : "✨ Update Post"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/blog/${id}`)}
              className="px-6 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6 animate-fade-in-up">
            <div className="text-center">
              <p className="text-4xl mb-3">⚠️</p>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete This Post?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone. The post will be permanently
                removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 cursor-pointer transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPost;
