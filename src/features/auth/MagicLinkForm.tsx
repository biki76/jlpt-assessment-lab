import { useState } from 'react';
import { sendMagicLink } from '../../services/authService';

export function MagicLinkForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setStatus('sending');
    try {
      await sendMagicLink(email.trim());
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send magic link');
    }
  };

  if (status === 'sent') {
    return (
      <div className="text-center p-6">
        <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">✉️</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Check your email</h3>
        <p className="text-sm text-gray-400">A magic link has been sent to {email}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full px-4 py-3 rounded-lg bg-dark-700 border border-dark-600 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-400">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full tap-min px-4 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500 transition-colors disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending...' : 'Send Magic Link'}
      </button>
    </form>
  );
}
