'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/lib/store';
import { Briefcase, Search, ArrowLeft, Plus } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  skills: string[];
  jobType: string;
  createdBy: string;
  createdAt: string;
  applicants: number;
}

export default function JobsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load jobs from API
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on user role
  let roleFilteredJobs = jobs;
  if (user?.role === 'company') {
    // Company only sees their own jobs
    roleFilteredJobs = jobs.filter(job => job.createdBy === user?.id);
  }
  // Candidates see all jobs

  const filteredJobs = roleFilteredJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!isAuthenticated || !user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" suppressHydrationWarning>
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-32 md:pb-8">
        {/* Header with Back Button */}
        <div className="mb-6 sm:mb-8 flex items-center gap-2 sm:gap-4 animate-fadeInUp">
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-lg hover:bg-white/10 transition-all flex-shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6 text-primary-400" />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3 truncate">
              <Briefcase size={24} className="sm:w-8 sm:h-8 text-primary-400 flex-shrink-0" />
              <span className="gradient-text truncate">Available Jobs</span>
            </h1>
            <p className="text-xs sm:text-sm text-dark-300">Explore opportunities and submit candidates</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="glass-dark rounded-xl p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-dark-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs by title, company, or skills..."
                className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
              />
            </div>
            {user?.role === 'company' && (
              <Link
                href="/jobs/create"
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-lg font-medium transition-all flex items-center gap-2 justify-center"
              >
                <Plus size={18} />
                New Job
              </Link>
            )}
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {filteredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="glass-dark rounded-xl p-6 hover:border-primary-500/50 transition-all cursor-pointer group block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-primary-300 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-dark-400">{job.company}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-medium capitalize">
                    {job.jobType}
                  </span>
                </div>

                <p className="text-sm text-dark-300 mb-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-400">Location:</span>
                    <span className="text-primary-400">{job.location}</span>
                  </div>
                  {job.salary && (
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-400">Salary:</span>
                      <span className="text-primary-400 font-bold">{job.salary}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-1 rounded text-xs bg-dark-700 text-dark-300">
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="px-2 py-1 rounded text-xs bg-dark-700 text-dark-300">
                      +{job.skills.length - 3}
                    </span>
                  )}
                </div>

                <button className="w-full py-2 px-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95">
                  View Details
                </button>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-dark rounded-xl p-12 text-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <Briefcase size={48} className="mx-auto mb-4 text-dark-500" />
            <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
            <p className="text-dark-400 mb-6">
              {searchTerm ? 'Try adjusting your search criteria' : 'No jobs posted yet. Be the first to post one!'}
            </p>
            {user?.role === 'company' && !searchTerm && (
              <Link
                href="/jobs/create"
                className="inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95"
              >
                + Post First Job
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
