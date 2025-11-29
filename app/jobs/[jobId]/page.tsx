'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/lib/store';
import { ArrowLeft, Upload, Send } from 'lucide-react';

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
}

interface ApplicationDetails {
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter: string;
}

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  const { user, isAuthenticated } = useAuthStore();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [details, setDetails] = useState<ApplicationDetails>({
    fullName: user?.name || '',
    email: '',
    phone: '',
    experience: '',
    coverLetter: '',
  });

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const jobs = await response.json();
        const foundJob = jobs.find((j: Job) => j.id === jobId);
        setJob(foundJob || null);
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeFile || !details.email || !details.phone) {
      alert('Please fill all required fields and upload a resume');
      return;
    }

    setApplying(true);

    try {
      // Read resume file as base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const resumeData = event.target?.result as string;

        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId,
            candidateId: user?.id,
            candidateName: user?.name,
            resume: {
              fileName: resumeFile.name,
              fileData: resumeData,
              fileType: resumeFile.type,
            },
            details,
            status: 'pending',
          }),
        });

        if (response.ok) {
          alert('Application submitted successfully!');
          router.push('/jobs');
        } else {
          alert('Failed to submit application');
        }
      };
      reader.readAsDataURL(resumeFile);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application');
    } finally {
      setApplying(false);
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

  if (!job) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
          <p className="text-dark-300">Job not found</p>
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
          onClick={() => router.push('/jobs')}
          className="mb-8 p-2 rounded-lg hover:bg-white/10 transition-all inline-block"
        >
          <ArrowLeft size={24} className="text-primary-400" />
        </button>

        {/* Job Details */}
        <div className="glass-dark rounded-xl p-8 mb-8 animate-fadeInUp">
          <h1 className="text-4xl font-bold mb-4 gradient-text">{job.title}</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-dark-400 text-sm">Company</p>
              <p className="text-white font-bold">{job.company}</p>
            </div>
            <div>
              <p className="text-dark-400 text-sm">Location</p>
              <p className="text-white font-bold">{job.location}</p>
            </div>
            <div>
              <p className="text-dark-400 text-sm">Salary</p>
              <p className="text-primary-400 font-bold">{job.salary} TON</p>
            </div>
            <div>
              <p className="text-dark-400 text-sm">Type</p>
              <p className="text-accent-400 font-bold capitalize">{job.jobType}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Description</h3>
            <p className="text-dark-300 whitespace-pre-wrap">{job.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Application Form */}
        {user.role === 'candidate' && (
          <div className="glass-dark rounded-xl p-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold mb-6">Apply for this Job</h2>
            <form onSubmit={handleSubmitApplication} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-white font-bold mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={details.fullName}
                  onChange={handleDetailsChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-bold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={details.email}
                  onChange={handleDetailsChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white font-bold mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={details.phone}
                  onChange={handleDetailsChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-white font-bold mb-2">Years of Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={details.experience}
                  onChange={handleDetailsChange}
                  placeholder="e.g., 5 years"
                  className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-white font-bold mb-2">Upload Resume *</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="hidden"
                    id="resume-upload"
                    required
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-dark-800/50 border-2 border-dashed border-primary-500/30 cursor-pointer hover:border-primary-500 transition-all"
                  >
                    <Upload size={20} className="text-primary-400" />
                    <span className="text-dark-300">
                      {resumeFile ? resumeFile.name : 'Click to upload resume (PDF, DOC, DOCX)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-white font-bold mb-2">Cover Letter</label>
                <textarea
                  name="coverLetter"
                  value={details.coverLetter}
                  onChange={handleDetailsChange}
                  placeholder="Tell us why you're a great fit for this role..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={applying}
                className="w-full py-3 px-6 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Send size={20} />
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {user.role === 'company' && (
          <div className="glass-dark rounded-xl p-8 text-center">
            <p className="text-dark-300">Only candidates can apply for jobs</p>
          </div>
        )}
      </div>
    </main>
  );
}
