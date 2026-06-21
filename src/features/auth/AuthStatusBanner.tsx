import { useState, useEffect } from 'react';
import { getCurrentUser, signOut } from '../../services/authService';
import { MagicLinkForm } from './MagicLinkForm';

export function AuthStatusBanner() {
  const [user, setUser] = useState<unknown | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  if (user) {
    return (
      <div className="px-4 py-2 bg-dark-800 border-b border-dark-700 flex items-center justify-between">
        <span className="text-xs text-gray-400">Signed in</span>
        <button
          onClick={() => signOut().then(() => setUser(null))}
          className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-3 bg-dark-800 border-b border-dark-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Sign in to save results across devices</span>
          <button
            onClick={() => setShowAuthModal(true)}
            className="tap-min px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-500 transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl bg-dark-800 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Sign In</h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="tap-min text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <MagicLinkForm />
          </div>
        </div>
      )}
    </>
  );
}
