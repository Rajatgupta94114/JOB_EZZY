'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/lib/store';
import { ArrowLeft, FileText, Calendar, DollarSign } from 'lucide-react';

interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  details: {
    email: string;
    phone: string;
  };
}

interface Job {
  id: string;
  title: string;
  salary: string;
}

interface EscrowData {
  jobTitle: string;
  startDate: string;
  endDate: string;
  amount: string;
  currency: string;
  description: string;
  terms: string;
}

export default function EscrowCreatePage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.applicationId as string;
  const { user, isAuthenticated } = useAuthStore();

  const [application, setApplication] = useState<Application | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [escrowData, setEscrowData] = useState<EscrowData>({
    jobTitle: '',
    startDate: '',
    endDate: '',
    amount: '',
    currency: 'TON',
    description: '',
    terms: '',
  });

  useEffect(() => {
    fetchData();
  }, [applicationId]);

  const fetchData = async () => {
    try {
      const [appsRes, jobsRes] = await Promise.all([
        fetch('/api/applications'),
        fetch('/api/jobs'),
      ]);

      if (appsRes.ok && jobsRes.ok) {
        const apps = await appsRes.json();
        const jobs = await jobsRes.json();

        const app = apps.find((a: Application) => a.id === applicationId);
        const jobData = jobs.find((j: Job) => j.id === app?.jobId);

        setApplication(app);
        setJob(jobData);

        if (app && jobData) {
          setEscrowData(prev => ({
            ...prev,
            jobTitle: jobData.title,
            amount: jobData.salary,
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEscrowData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!escrowData.startDate || !escrowData.endDate || !escrowData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    if (new Date(escrowData.endDate) <= new Date(escrowData.startDate)) {
      alert('End date must be after start date');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          companyId: user?.id,
          candidateId: application?.candidateId,
          jobTitle: escrowData.jobTitle,
          startDate: escrowData.startDate,
          endDate: escrowData.endDate,
          amount: escrowData.amount,
          currency: escrowData.currency,
          description: escrowData.description,
          terms: escrowData.terms,
        }),
      });

      if (response.ok) {
        const escrow = await response.json();
        
        // Update application with escrow contract ID
        await fetch('/api/applications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: applicationId,
            escrowContractId: escrow.id,
          }),
        });
        
        // Send notification to candidate
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderId: user?.id,
            recipientId: application?.candidateId,
            type: 'escrow_created',
            title: 'New Escrow Contract',
            message: `${user?.name || 'A company'} has created an escrow contract for the position of ${escrow.jobTitle}. Please review and approve the contract.`,
            escrowId: escrow.id,
            applicationId: applicationId,
          }),
        });

        alert('Escrow contract created and sent to candidate!');
        router.push(`/escrow-view/${escrow.id}`);
      } else {
        alert('Failed to create escrow contract');
      }
    } catch (error) {
      console.error('Error creating escrow:', error);
      alert('Error creating escrow contract');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated || !user) return null;

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
          <p className="text-dark-300">Loading...</p>
        </div>
      </main>
    );
  }

  if (!application || !job) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
          <p className="text-dark-300">Application not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 p-2 rounded-lg hover:bg-white/10 transition-all inline-block"
        >
          <ArrowLeft size={24} className="text-primary-400" />
        </button>

        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Create Escrow Contract</h1>
          <p className="text-dark-300">
            Set up a secure contract for {application.candidateName}
          </p>
        </div>

        {/* Candidate Info */}
        <div className="glass-dark rounded-xl p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-lg font-bold mb-4">Candidate Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-dark-400 text-sm">Name</p>
              <p className="text-white font-bold">{application.candidateName}</p>
            </div>
            <div>
              <p className="text-dark-400 text-sm">Email</p>
              <p className="text-white font-bold">{application.details.email}</p>
            </div>
            <div>
              <p className="text-dark-400 text-sm">Phone</p>
              <p className="text-white font-bold">{application.details.phone}</p>
            </div>
            <div>
              <p className="text-dark-400 text-sm">Position</p>
              <p className="text-white font-bold">{job.title}</p>
            </div>
          </div>
        </div>

        {/* Escrow Form */}
        <form onSubmit={handleSubmit} className="glass-dark rounded-xl p-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-2xl font-bold mb-6">Contract Details</h3>

          <div className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-white font-bold mb-2">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={escrowData.jobTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
                disabled
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-white font-bold mb-2 flex items-center gap-2">
                <Calendar size={18} />
                Contract Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={escrowData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white focus:outline-none focus:border-primary-500"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-white font-bold mb-2 flex items-center gap-2">
                <Calendar size={18} />
                Contract End Date * (Auto-ends on this date)
              </label>
              <input
                type="date"
                name="endDate"
                value={escrowData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white focus:outline-none focus:border-primary-500"
                required
              />
            </div>

            {/* Amount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-bold mb-2 flex items-center gap-2">
                  <DollarSign size={18} />
                  Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={escrowData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-bold mb-2">Currency</label>
                <select
                  name="currency"
                  value={escrowData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="TON">TON</option>
                  <option value="USDT">USDT</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-bold mb-2">Job Description</label>
              <textarea
                name="description"
                value={escrowData.description}
                onChange={handleInputChange}
                placeholder="Describe the job responsibilities and requirements..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="block text-white font-bold mb-2">Terms & Conditions</label>
              <textarea
                name="terms"
                value={escrowData.terms}
                onChange={handleInputChange}
                placeholder="Enter contract terms, payment schedule, deliverables, etc..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-6 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <FileText size={20} />
              {submitting ? 'Creating Contract...' : 'Create Escrow Contract'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
