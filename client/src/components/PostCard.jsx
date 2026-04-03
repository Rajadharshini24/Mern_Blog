import { Link } from "react-router-dom";

const categoryColors = {
  Programming: "bg-indigo-100 text-indigo-700",
  Tech: "bg-purple-100 text-purple-700",
  Tutorial: "bg-cyan-100 text-cyan-700",
  career: "bg-amber-100 text-amber-700",
  others: "bg-gray-100 text-gray-600",
};

const PostCard = ({ blog, currentUserId, onDelete }) => {
  console.log("FULL BLOG:", blog);
  const getImageUrl = (image) => {
    if (!image) return "https://source.unsplash.com/400x300/?technology";

    // Fix broken cloudinary URL
    if (image.includes("res.cloudinary.com")) {
      if (image.startsWith("https//")) {
        return image.replace("https//", "https://");
      }
      return image; // already correct
    }

    // Local uploads only
    if (image.startsWith("/uploads")) {
      return `https://mern-blog-backend-wdq0.onrender.com${image}`;
    }

    return image;
  };

  console.log("IMAGE:", blog.image);
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ✅ AUTHOR CHECK
  const isAuthor =
    currentUserId === blog?.author?._id || currentUserId === blog?.author;

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      {/* IMAGE CLICKABLE */}
      <Link to={`/blog/${blog._id}`}>
        <div className="overflow-hidden">
          <img
            src={getImageUrl(blog.image)}
            alt="blog"
            className="w-full h-48 object-cover"
          />
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-5 space-y-3">
        {/* Category + Date */}
        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              categoryColors[blog.category] || categoryColors.others
            }`}
          >
            {blog.category}
          </span>

          <span className="text-xs text-gray-500">
            {formatDate(blog.createdAt)}
          </span>
        </div>

        {/* TITLE CLICKABLE */}
        <Link to={`/blog/${blog._id}`}>
          <h2 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition">
            {blog.title}
          </h2>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-3">
          {blog.content.substring(0, 120)}...
        </p>

        {/* Read more */}
        <Link to={`/blog/${blog._id}`}>
          <p className="text-xs text-indigo-600 font-medium hover:underline">
            Read more →
          </p>
        </Link>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {blog.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {blog.author?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <span className="text-sm text-gray-700">
              {blog.author?.name || "Unknown"}
            </span>
          </div>

          {/* RIGHT SIDE */}
          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>❤️ {blog.likes?.count || 0}</span>
              <span>💬 {blog.commentCount || 0}</span>
              <span>👁 {blog.views || 0}</span>
            </div>

            {/* ✅ ACTION BUTTONS */}
            {isAuthor && (
              <div className="flex gap-2">
                {/* EDIT */}
                <Link
                  to={`/edit/${blog._id}`}
                  onClick={(e) => e.stopPropagation()} // 🔥 prevent card click
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Edit
                </Link>

                {/* DELETE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDelete(blog._id);
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
