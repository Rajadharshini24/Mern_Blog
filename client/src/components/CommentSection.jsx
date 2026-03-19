import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getComments, addComment, deleteComment } from "../services/api";
import { toast } from "react-toastify";

const CommentSection = ({ blogId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const res = await getComments(blogId);
      setComments(res.data.comment || []);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    setSubmitting(true);
    try {
      await addComment({ text: text.trim(), blogId });
      setText("");
      toast.success("Comment added!");
      await fetchComments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId);
      toast.success("Comment deleted");
      await fetchComments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        💬 Comments
        <span className="text-sm font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
          {comments.length}
        </span>
      </h3>

      {/* Add Comment */}
      {user ? (
        <form onSubmit={handleAddComment} className="mb-8">
          <div className="flex gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                maxLength={50}
                className="w-full px-4 py-3 rounded-lg text-sm border border-gray-300 text-gray-700 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">{text.length}/50</span>
                <button
                  type="submit"
                  disabled={submitting || !text.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-6 mb-6 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">
            Please{" "}
            <a href="/login" className="text-indigo-600 font-medium hover:underline">
              sign in
            </a>{" "}
            to comment
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-3xl mb-2">🗨️</p>
          <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex gap-3 p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="w-8 h-8 bg-purple-600 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                {comment.userId?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {comment.userId?.name || "Unknown User"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  {user && comment.userId?._id === user._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1 break-words">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
