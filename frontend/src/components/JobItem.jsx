import { useState } from 'react'; 
import api from '../api'; 
import ToggleSwitch from './ToggleSwitch';

export default function JobItem({ job, onJobUpdated }) {
    const [isLoading, setIsLoading] = useState(false);
  // Helper to format the cron string for readability
  const formatCron = (cron) => {
    const parts = cron.split(' ');
    // A simple formatter (can be improved later)
    if (cron === '* * * * *') return 'Every minute';
    if (parts[0] === '0' && parts[1] === '0') return 'Daily at midnight';
    if (parts[1] === '0') return `Hourly at minute 0`;
    return cron; // Fallback
  };

    const handleToggle = async (newEnabledState) => {
    if (isLoading) return; // Prevent double-clicks
    setIsLoading(true);
    
    try {
      // Call the update endpoint
      await api.put(`/jobs/${job._id}`, {
        isEnabled: newEnabledState,
      });
      // Tell the dashboard to refresh its list
      onJobUpdated(); 
    } catch (err) {
      console.error('Failed to update job', err);
      // TODO: Add an error toast/message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="flex items-center justify-between gap-4 rounded-lg bg-gray-800 p-4 shadow">
      <div className="flex items-center gap-3">
        
        
        <div>
          {/* Job Name */}
          <p className="font-semibold text-white">{job.name}</p>
          {/* Job URL & Method */}
          <p className="text-sm text-gray-400">
            <span
              className={`mr-2 inline-block rounded px-1.5 py-0.5 text-xs font-bold ${
                job.httpMethod === 'POST' ? 'bg-blue-600' : 'bg-green-600'
              } text-white`}
            >
              {job.httpMethod}
            </span>
            {job.url}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
            {/* Schedule */}
            <p className="text-sm font-medium text-white">
            {formatCron(job.cronSchedule)}
            </p>
            {/* Last updated (we don't have this yet, but good to add) */}
            <p className="text-xs text-gray-500">
            Created: {new Date(job.createdAt).toLocaleDateString()}
            </p>
        </div>

        <ToggleSwitch 
          enabled={job.isEnabled} 
          onChange={handleToggle} 
        />
      </div>
    </li>
  );
}