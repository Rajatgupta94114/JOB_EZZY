'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/lib/store';
import { ArrowLeft, Download, CheckCircle, Clock, FileText } from 'lucide-react';

interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  resume: {
    fileName: string;
    fileData: string;
    fileType: string;
  };
  details: {
    fullName: string;
    email: string;
    phone: string;
    experience: string;
    coverLetter: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  escrowContractId: string | null;
  contractAccepted?: boolean;
  contractAcceptedAt?: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  createdBy: string;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    if (user?.role === 'company') {
      fetchData();
      
      // Auto-refresh every 5 seconds to check for contract acceptances
      const interval = setInterval(() => {
        fetchData();
      }, 5000);
      
      return () => clearInterval(interval);
    }
    return undefined;
  }, [user]);

  const fetchData = async () => {
    try {
      const [appsRes, jobsRes, escrowRes] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/jobs'),
        fetch('/api/escrow'),
      ]);

      if (appsRes.ok && jobsRes.ok && escrowRes.ok) {
        const allApps = await appsRes.json();
        const allJobs = await jobsRes.json();
        const allEscrows = await escrowRes.json();

        // Filter applications for jobs created by this company
        const companyJobIds = allJobs
          .filter((j: Job) => j.createdBy === user?.id)
          .map((j: Job) => j.id);

        const companyApps = allApps.filter((app: Application) =>
          companyJobIds.includes(app.jobId)
        );

        setApplications(companyApps);
        setJobs(allJobs);
        setEscrows(allEscrows);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = (app: Application) => {
    const link = document.createElement('a');
    link.href = app.resume.fileData;
    link.download = app.resume.fileName;
    link.click();
  };

  const getEscrowDetails = (escrowId: string) => {
    return escrows.find(e => e.id === escrowId);
  };

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diff = end.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return Math.max(0, days);
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: applicationId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getJobTitle = (jobId: string) => {
    return jobs.find(j => j.id === jobId)?.title || 'Unknown Job';
  };

  const filteredApplications = applications.filter(app =>
    filter === 'all' ? true : app.status === filter
  );

  if (!isAuthenticated || !user) return null;

  if (user.role !== 'company') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
          <p className="text-dark-300">Only companies can view applications</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" suppressHydrationWarning>
      <Navigation />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-32 md:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex items-center gap-2 sm:gap-4 animate-fadeInUp">
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-lg hover:bg-white/10 transition-all flex-shrink-0"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6 text-primary-400" />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-4xl font-bold gradient-text truncate">Job Applications</h1>
            <p className="text-xs sm:text-sm text-dark-300 mt-1 sm:mt-2">Manage candidate submissions</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="glass-dark rounded-xl p-4 mb-8 flex gap-2 flex-wrap animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          {(['all', 'pending', 'accepted', 'rejected'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                filter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-800 text-dark-300 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="glass-dark rounded-xl p-12 text-center">
            <p className="text-dark-400">Loading applications...</p>
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {filteredApplications.map(app => (
              <div key={app.id} className="glass-dark rounded-xl p-6 hover:border-primary-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{app.candidateName}</h3>
                    <p className="text-sm text-dark-400 mb-2">Applied for: {getJobTitle(app.jobId)}</p>
                    <div className="flex gap-4 text-sm text-dark-300">
                      <span>📧 {app.details.email}</span>
                      <span>📱 {app.details.phone}</span>
                      <span>💼 {app.details.experience || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.status === 'pending' && (
                      <Clock size={20} className="text-yellow-400" />
                    )}
                    {app.status === 'accepted' && !app.escrowContractId && (
                      <CheckCircle size={20} className="text-green-400" />
                    )}
                    {app.status === 'accepted' && app.escrowContractId && !app.contractAccepted && (
                      <Clock size={20} className="text-yellow-400" />
                    )}
                    {app.status === 'accepted' && app.contractAccepted && (
                      <CheckCircle size={20} className="text-green-400" />
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                      app.status === 'accepted' && !app.escrowContractId ? 'bg-green-500/20 text-green-300' :
                      app.status === 'accepted' && app.escrowContractId && !app.contractAccepted ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {app.status === 'pending' ? 'pending' :
                       app.status === 'accepted' && !app.escrowContractId ? 'accepted' :
                       app.status === 'accepted' && app.escrowContractId && !app.contractAccepted ? 'pending approval' :
                       app.status === 'accepted' && app.contractAccepted ? 'hired' :
                       app.status}
                    </span>
                  </div>
                </div>

                {app.details.coverLetter && (
                  <div className="mb-4 p-4 bg-dark-800/50 rounded-lg">
                    <p className="text-sm text-dark-300 line-clamp-2">{app.details.coverLetter}</p>
                  </div>
                )}

                <div className="flex gap-2 sm:gap-3 flex-wrap">
                  <button
                    onClick={() => handleDownloadResume(app)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-all"
                  >
                    <Download size={16} />
                    Download Resume
                  </button>

                  {app.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'accepted')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all"
                      >
                        <CheckCircle size={16} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'rejected')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {app.status === 'accepted' && !app.escrowContractId && (
                    <button
                      onClick={() => router.push(`/escrow-create/${app.id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-accent-500/20 hover:bg-accent-500/30 text-accent-400 rounded-lg transition-all"
                    >
                      <FileText size={16} />
                      Create Escrow Contract
                    </button>
                  )}

                  {app.status === 'accepted' && app.escrowContractId && !app.contractAccepted && (
                    <>
                      <button
                        onClick={() => router.push(`/escrow-view/${app.escrowContractId}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-all"
                      >
                        <Download size={16} />
                        Download Contract
                      </button>
                      <div className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm flex items-center gap-2 font-bold">
                        <Clock size={14} />
                        Pending
                      </div>
                    </>
                  )}

                  {app.status === 'accepted' && app.contractAccepted && (
                    <div className="space-y-3 w-full">
                      <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm flex items-center gap-2 font-bold">
                        ✓ Candidate Hired
                      </div>
                      {app.escrowContractId && (() => {
                        const escrow = getEscrowDetails(app.escrowContractId);
                        return escrow ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div className="bg-dark-800/50 p-3 rounded-lg">
                                <p className="text-dark-400 text-xs">Start Date</p>
                                <p className="text-white font-bold">{new Date(escrow.startDate).toLocaleDateString()}</p>
                              </div>
                              <div className="bg-dark-800/50 p-3 rounded-lg">
                                <p className="text-dark-400 text-xs">End Date</p>
                                <p className="text-white font-bold">{new Date(escrow.endDate).toLocaleDateString()}</p>
                              </div>
                              <div className="bg-dark-800/50 p-3 rounded-lg">
                                <p className="text-dark-400 text-xs">Days Left</p>
                                <p className="text-white font-bold">{calculateDaysRemaining(escrow.endDate)} days</p>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => {
                                  const element = document.createElement('a');
                                  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Contract Details\n\nJob: ${escrow.jobTitle}\nAmount: ${escrow.amount} ${escrow.currency}\nStart: ${new Date(escrow.startDate).toLocaleDateString()}\nEnd: ${new Date(escrow.endDate).toLocaleDateString()}\n\nDescription: ${escrow.description}\n\nTerms: ${escrow.terms}`));
                                  element.setAttribute('download', `contract_${escrow.id}.txt`);
                                  element.style.display = 'none';
                                  document.body.appendChild(element);
                                  element.click();
                                  document.body.removeChild(element);
                                }}
                                className="flex-1 py-2 px-4 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-bold"
                              >
                                <Download size={16} />
                                Download Contract
                              </button>
                              <button
                                onClick={() => router.push(`/payment/${escrow.id}`)}
                                className="flex-1 py-2 px-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-bold"
                              >
                                💰 Make Payment
                              </button>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-dark rounded-xl p-12 text-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <FileText size={48} className="mx-auto mb-4 text-dark-500" />
            <h3 className="text-xl font-bold text-white mb-2">No applications yet</h3>
            <p className="text-dark-400">
              {filter === 'all' ? 'Candidates will submit applications to your jobs here' : `No ${filter} applications`}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
