import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import EditPost from "./pages/EditPost";
import Profile from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/blog/:id" element={<PostDetails />} />

              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditPost />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
          <footer className="mt-16 py-8 text-center text-sm text-gray-400 border-t border-gray-200">
            <p>
              Made with ❤️ by{" "}
              <span className="font-semibold text-indigo-600">
                BlogVerse
              </span>{" "}
              © {new Date().getFullYear()}
            </p>
          </footer>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="light"
          newestOnTop
          closeOnClick
          draggable
          pauseOnHover={false}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;