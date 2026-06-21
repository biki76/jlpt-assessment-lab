import { useState, useEffect } from 'react';

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('nihonsync-consent-v1');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('nihonsync-consent-v1', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('nihonsync-consent-v1', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark-800 border-t border-dark-700 p-4">
      <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-3">
        <p className="text-sm text-gray-300 flex-1">
          NihonSync uses anonymized analytics to improve your learning experience. No personal data is sold or shared.
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="tap-min px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="tap-min px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-500 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
