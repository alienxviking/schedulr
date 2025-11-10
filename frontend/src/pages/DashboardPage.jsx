import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../api'; // <-- Import our new api helper
import JobItem from '../components/JobItem'; // <-- Import our new JobItem
import CreateJobModal from '../components/CreateJobModal';

export default function DashboardPage() {
  const { logout, user } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch jobs when the component loads
const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load your jobs.');
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleJobCreated = () => {
    fetchJobs(); 
  };

  return (
    <div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
      {/* --- Header --- */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Your Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Welcome back, {user?.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={()=>setIsModalOpen(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Create New Job
          </button>
          <button 
            onClick={logout} 
            className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* --- Job List --- */}
      <main className="mt-8">
        <div className="w-full">
          {isLoading && (
            <p className="text-center text-gray-400">Loading jobs...</p>
          )}

          {!isLoading && error && (
            <p className="text-center text-red-400">{error}</p>
          )}

          {!isLoading && !error && jobs.length === 0 && (
            <div className="text-center rounded-lg border-2 border-dashed border-gray-700 p-12">
              <h3 className="text-lg font-medium text-white">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-400">
                Get started by creating your first scheduled job.
              </p>
            </div>
          )}

          {!isLoading && !error && jobs.length > 0 && (
            <ul className="space-y-4">
              {jobs.map((job) => (
                <JobItem key={job._id} job={job} onJobUpdated={fetchJobs}/>
              ))}
            </ul>
          )}
        </div>
      </main>
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
}