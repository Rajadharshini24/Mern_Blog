import { useEffect, useState } from "react";
import { getProfile, getMyBlogs, getLikedBlogs, updateProfile, deleteBlog } from "../services/api";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import { toast, ToastContainer } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState({ _id:"", name: "", email: "", profileImage: "", followers: [] });
  const [blogs, setBlogs] = useState([]);
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLiked, setShowLiked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", profileImage: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await getProfile();
        setUser(userRes.data.user);
        setFormData({ name: userRes.data.user.name, email: userRes.data.user.email });

        const blogsRes = await getMyBlogs();
        setBlogs(blogsRes.data.blogs);

        const likedRes = await getLikedBlogs();
        setLikedBlogs(likedRes.data.blogs);
      } catch (err) {
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deleteBlog(id);
      toast.success("Deleted");
      setBlogs((b) => b.filter((bk) => bk._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEditProfile = async (e) => {
  e.preventDefault();
  try {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    if (formData.profileImage) data.append("profileImage", formData.profileImage);

    const res = await updateProfile(data); // call backend API
    setUser(res.data.user); // update frontend state
    setFormData({
      ...formData,
      profileImage: null, // reset file input
    });
    toast.success("Profile updated!");
    setEditing(false);
  } catch (err) {
    toast.error(err.response?.data?.message || "Update failed");
  }
};

  if (loading) return <Loader />;

  const totalLikes = blogs.reduce((acc, b) => acc + (b.likes?.count || 0), 0);

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <ToastContainer position="bottom-right" />

      {/* Cover */}
      <div className="h-56 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="max-w-6xl mx-auto px-4 -mt-24 pb-20">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border">

          <div className="flex flex-col md:flex-row items-center gap-8">

            {/* IMAGE */}
            <div className="relative">
              <img
  src={
    formData.profileImage
      ? URL.createObjectURL(formData.profileImage) // preview selected file
      : user.profileImage
      ? user.profileImage // ✅ full Cloudinary/Render URL directly
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}` // fallback avatar
  }
  className="w-32 h-32 md:w-44 md:h-44 rounded-2xl object-cover border-4 border-white shadow-lg"
/>
              <input
                type="file"
                className="absolute bottom-2 right-2 opacity-0 cursor-pointer"
                onChange={(e) =>
                  setFormData({ ...formData, profileImage: e.target.files[0] })
                }
              />
            </div>

            {/* INFO */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>

              {/* STATS */}
              <div className="flex justify-center md:justify-start gap-10 mt-6 border-t pt-4">
                <div>
                  <p className="text-xl font-bold">{user.followers?.length || 0}</p>
                  <p className="text-xs text-gray-400">Followers</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{totalLikes}</p>
                  <p className="text-xs text-gray-400">Likes</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{blogs.length}</p>
                  <p className="text-xs text-gray-400">Posts</p>
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => setEditing(!editing)}
              className={`px-6 py-2 rounded-xl font-semibold ${
                editing
                  ? "bg-gray-200"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>

          {/* EDIT FORM */}
          {editing && (
            <form onSubmit={handleEditProfile} className="mt-8 border-t pt-6 space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
                placeholder="Name"
                required
              />

              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 border rounded-xl"
                placeholder="Email"
                required
              />

              <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl">
                Save Changes
              </button>
            </form>
          )}
        </div>

        {/* TABS */}
        <div className="mt-10 flex gap-4">
          <button
            onClick={() => setShowLiked(false)}
            className={`px-5 py-2 rounded-xl ${
              !showLiked ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            My Posts
          </button>

          <button
            onClick={() => setShowLiked(true)}
            className={`px-5 py-2 rounded-xl ${
              showLiked ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            Liked Posts
          </button>
        </div>

        {/* POSTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {(showLiked ? likedBlogs : blogs).length > 0 ? (
            (showLiked ? likedBlogs : blogs).map((blog) => (
              <PostCard
                key={blog._id}
                blog={blog}
                currentUserId={showLiked ? null : user._id}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 mt-10">
              {showLiked ? "No liked posts" : "No posts yet"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;