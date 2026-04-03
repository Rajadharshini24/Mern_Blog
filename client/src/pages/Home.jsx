import { useEffect, useState } from "react";
import { getAllBlogs } from "../services/api";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, [page, search]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await getAllBlogs(page, 6, search);
      setBlogs(res.data.blogs || []);
      setHasMore(res.data.blogs?.length === 6);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* HERO */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Discover <span className="text-indigo-600">Stories</span> & Ideas
          </h1>

          <p className="text-gray-500 max-w-xl mx-auto mb-8">
            Join our community of writers and readers exploring Programming,
            Design, Tech, and Career insights.
          </p>

          {/* SEARCH */}
          <form
            onSubmit={handleSearch}
            className="max-w-lg mx-auto flex items-center bg-white rounded-full shadow-md border overflow-hidden"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for topics..."
              className="flex-1 px-5 py-3 text-sm outline-none"
            />

            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
            >
              Search
            </button>
          </form>

          {/* SEARCH RESULT */}
          {search && (
            <div className="mt-4 text-sm text-gray-500">
              Results for{" "}
              <span className="font-semibold text-indigo-600">"{search}"</span>
              <button
                onClick={() => {
                  setSearch("");
                  setSearchInput("");
                  setPage(1);
                }}
                className="ml-3 text-red-500 hover:underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* CONTENT */}
        {loading ? (
          <Loader />
        ) : blogs.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📝</p>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {search ? "No posts found" : "No posts yet"}
            </h2>
            <p className="text-gray-500">
              {search
                ? "Try different keywords."
                : "Be the first to create a post!"}
            </p>
          </div>
        ) : (
          <>
            {/* TITLE */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Latest Articles
              </h2>
            </div>

            <div className="flex gap-3 mb-8 flex-wrap">
              {["All", "Tech", "Design", "Career", "AI"].map((cat) => (
                <button
                  key={cat}
                  className="px-4 py-1.5 text-sm rounded-full border bg-white hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* BLOG GRID */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Link to={`/blog/${blog._id}`} key={blog._id}>
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden group cursor-pointer">
                    {/* IMAGE */}
                    <div className="relative">
                      <img
  src={
    blog.image?.startsWith("http")
      ? blog.image
      : blog.image?.startsWith("https//")
      ? blog.image.replace("https//", "https://")
      : blog.image
      ? `https://mern-blog-backend-wdq0.onrender.com${blog.image}`
      : "https://source.unsplash.com/400x250/?technology"
  }
  className="h-44 w-full object-cover"
/>

                      {/* CATEGORY TAG */}
                      <span className="absolute top-3 left-3 text-xs bg-indigo-600 text-white px-3 py-1 rounded-full shadow">
                        {blog.category || "Tech"}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      {/* DATE */}
                      <p className="text-xs text-gray-400 mb-2">
                        {new Date(blog.createdAt).toDateString()}
                      </p>

                      {/* TITLE */}
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">
                        {blog.title}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {blog.content}
                      </p>

                      {/* FOOTER */}
                      <div className="flex justify-between items-center mt-4">
                        {/* AUTHOR */}
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gray-300"></div>
                          <span className="text-xs text-gray-600">
                            {blog.author?.name || "User"}
                          </span>
                        </div>

                        {/* STATS */}
                        <div className="flex items-center gap-3 text-xs text-gray-400">
  <span>👁 {blog.views || 0}</span>
  <span>❤️ {blog.likes?.count || 0}</span>
  <span>💬 {blog.commentCount || 0}</span>
</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-6 bg-white px-6 py-2 rounded-full border shadow-sm">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-sm text-gray-600 hover:text-black disabled:opacity-40"
                >
                  ← Previous
                </button>

                <span className="text-sm font-semibold text-indigo-600">
                  Page {page}
                </span>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasMore}
                  className="text-sm text-gray-600 hover:text-black disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
