import React from 'react';
import Chatwindow from './Chatwindow'; // Ensure capitalization matches filename (Chatwindow vs ChatWindow)

const Chatpopup: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const isLoginPage = window.location.pathname === "/login";
  const profilePic = localStorage.getItem("profilePic") || "https://via.placeholder.com/32";

  return (
    <>
      {!isLoginPage && (
        <div className="fixed bottom-4 right-4 z-50">
          {!isOpen ? (
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
              aria-label="Open chat"
            >
              <div className="relative w-8 h-8 mr-2">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover ring-2 ring-white"
                />
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-white rounded-full border-2 border-green-500 animate-pulse"></div>
              </div>
              <span className="font-semibold text-sm text-white group-hover:tracking-wide transition-all">
                Messages
              </span>
              <svg 
                className="w-4 h-4 ml-2 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                />
              </svg>
            </button>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 w-96 h-[600px] flex flex-col animate-slideUp">
              {/* CHAT HEADER */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                  />
                  <div>
                    <h3 className="font-semibold text-white">Messages</h3>
                    <p className="text-xs text-green-100">Chat with friends</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 group"
                  aria-label="Close chat"
                >
                  <svg 
                    className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </div>

              {/* CHAT CONTENT */}
              <div className="flex-1 overflow-hidden">
                {/* FIX: Passed the onClose prop required by the interface */}
                <Chatwindow onClose={() => setIsOpen(false)} />
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Chatpopup;