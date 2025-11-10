import { useState } from 'react';
import api from '../api';

export default function CreateJobModal({ isOpen, onClose, onJobCreated }) {
  // --- Form State ---
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [httpMethod, setHttpMethod] = useState('GET');
  const [cronSchedule, setCronSchedule] = useState('* * * * *');
  
  // --- UI State ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Reset Form ---
  const resetForm = () => {
    setName('');
    setUrl('');
    setHttpMethod('GET');
    setCronSchedule('* * * * *');
    setError(null);
  };

  // --- Handlers ---
  const handleClose = () => {
    resetForm();
    onClose(); // Call the onClose prop passed from the parent
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const newJob = { name, url, httpMethod, cronSchedule };
      await api.post('/jobs', newJob); // Use our API helper
      
      onJobCreated(); // Tell the dashboard to refresh
      handleClose();  // Close this modal
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create job';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // If the modal isn't open, render nothing
  if (!isOpen) {
    return null;
  }

  // --- JSX ---
  return (
    // Backdrop
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={handleClose} // Close modal on backdrop click
    >
      {/* Modal Content */}
      <div 
        className="w-full max-w-lg rounded-lg bg-gray-800 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-xl font-bold text-white">Create New Job</h2>
        <p className="mt-1 text-sm text-gray-400">
          This job will run based on its cron schedule.
        </p>
        
        {/* --- Form --- */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Job Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Daily API Backup"
              required
              className="mt-1 w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300">URL to Call</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/webhook"
              required
              className="mt-1 w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            {/* HTTP Method */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300">Method</label>
              <select
                value={httpMethod}
                onChange={(e) => setHttpMethod(e.target.value)}
                className="mt-1 w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
            </div>
            
            {/* Cron Schedule */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300">Cron Schedule</label>
              <input
                type="text"
                value={cronSchedule}
                onChange={(e) => setCronSchedule(e.target.value)}
                required
                className="mt-1 w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Tip: `* * * * *` = every minute. `0 0 * * *` = daily at midnight.
          </p>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-900/50 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}