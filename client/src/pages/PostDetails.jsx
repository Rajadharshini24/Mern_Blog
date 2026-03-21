import { useEffect, useState, useRef } from "react"; // ✅ updated
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSingleBlog, likeBlog } from "../services/api";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  // ✅ ADD THIS
  const hasFetched = useRef(false);

  // ✅ FIXED useEffect
  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);

      const res = await getSingleBlog(id);
      const blogData = res.data.blog || res.data;

      setBlog(blogData);
      setLikesCount(blogData.likes?.count || 0);
      setLiked(user ? blogData.likes?.users?.includes(user._id) : false);
    } catch (err) {
      console.error(err);
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };




  const handleLike = async (id) => {
  if (!user) {
    toast.error("Please login to like");
    return;
  }

  setLikeLoading(true);

  const newLiked = !liked;

  // Optimistic UI update
  setLiked(newLiked);
  setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));

  try {
    await likeBlog(id);
    toast.success(newLiked ? "Liked!" : "Unliked!");
  } catch (err) {
    // revert
    setLiked(!newLiked);
    setLikesCount((prev) => (newLiked ? prev - 1 : prev + 1));
    toast.error("Failed to update like");
  } finally {
    setLikeLoading(false);
  }
};

 const currentUserId = user?._id || user?.id || user?.user?._id;

const isAuthor = blog?.author?._id === currentUserId;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">😔</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{error}</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <article className="animate-fade-in-up">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 cursor-pointer transition-colors"
        >
          ← Back
        </button>

        
        {/* Header Card */}
<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-8">

  {/* ✅ ADD IMAGE HERE */}
  {blog.image && (
    <img
      src={`https://mern-blog-backend-wdq0.onrender.com${blog.image}`}
      className="w-full h-64 object-cover rounded-xl mb-6"
    />
  )}

  {/* Category + Date */}
  <div className="flex flex-wrap items-center gap-3 mb-4">
    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
      {blog.category}
    </span>
    <span className="text-sm text-gray-500">
      {formatDate(blog.createdAt)}
    </span>
  </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Author + Actions */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {blog.author?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {blog.author?.name || "Unknown Author"}
                </p>
                <p className="text-xs text-gray-500">{blog.views || 0} views</p>
              </div>
            </div>

            {isAuthor && (
              <Link
                to={`/edit/${blog._id}`}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                ✏️ Edit
              </Link>
            )}
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap mb-8" style={{ lineHeight: '1.8' }}>
          {blog.content}
        </div>

        {/* Like Bar */}
        <div className="flex items-center justify-between py-6 mb-8 border-t border-b border-gray-200">
          <button
  onClick={() => handleLike(blog._id)}
  disabled={likeLoading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer disabled:opacity-60 transition-all ${
              liked
                ? "bg-red-50 border border-red-200 text-red-500"
                : "bg-white border border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
          >
            <span className="text-lg">{liked ? "❤️" : "🤍"}</span>
            {likesCount} {likesCount === 1 ? "Like" : "Likes"}
          </button>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>💬 {blog.commentCount || 0} comments</span>
            <span>👁️ {blog.views || 0} views</span>
          </div>
        </div>

        {/* Comments */}
        <CommentSection blogId={id} />
      </article>
    </div>
  );
};

export default PostDetails;
