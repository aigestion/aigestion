import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface ConnectHAPropos {
  onSuccess: () => void;
  onCancel: () => void;
}

const ConnectHA: React.FC<ConnectHAPropos> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleConnect = async () => {
    setStatus('testing');
    try {
      // Direct call to backend
      const res = await fetch('/api/iot/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseUrl: url, accessToken: token })
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setTimeout(onSuccess, 1500);
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Connection failed');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error. Check backend logs.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Connect Home Assistant
        </h2>

        {status === 'success' ? (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block"
            >
              <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-4" />
            </motion.div>
            <p className="text-xl font-semibold text-white">Successfully Connected!</p>
            <p className="text-gray-400">Loading your devices...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Instance URL</label>
              <input
                type="text"
                placeholder="http://homeassistant.local:8123"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Must be reachable from the server</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Long-Lived Access Token</label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
                <p className="text-xs text-gray-500 mt-1">Found in HA Profile &rarr; Security</p>
            </div>

            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-3">
                <XCircleIcon className="w-5 h-5 text-red-500" />
                <p className="text-red-400 text-sm">{errorMsg}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                onClick={onCancel}
                className="flex-1 py-3 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                disabled={status === 'testing' || !url || !token}
                className="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {status === 'testing' ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Connect & Import'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ConnectHA;
