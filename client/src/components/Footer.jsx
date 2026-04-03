const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-14">

        {/* TOP GRID */}
        <div className="grid md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>
            <h2 className="text-white text-xl font-bold mb-4">BlogVerse</h2>
            <p className="text-sm leading-relaxed text-gray-400">
              A modern platform for sharing stories, ideas, and experiences with
              a global community of curious minds.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Technology</li>
              <li className="hover:text-white cursor-pointer">Design</li>
              <li className="hover:text-white cursor-pointer">Career</li>
              <li className="hover:text-white cursor-pointer">AI</li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-3">
              Get the latest articles delivered to your inbox.
            </p>

            <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-3 py-2 bg-transparent text-sm outline-none"
              />
              <button className="bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 transition">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© 2026 BlogVerse. All rights reserved.</p>

          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">Terms</span>
            <span className="hover:text-white cursor-pointer">LinkedIn</span>
            <span className="hover:text-white cursor-pointer">GitHub</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;