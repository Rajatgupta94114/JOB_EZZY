'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface JobFormData {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  skills: string[];
  jobType: 'full-time' | 'part-time' | 'contract' | 'freelance';
}

export default function CreateJobPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    company: user?.name || '',
    location: '',
    salary: '',
    skills: [],
    jobType: 'full-time',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('You must be logged in to create a job');
      return;
    }

    if (!formData.title || !formData.description || !formData.location) {
      alert('Please fill in all required fields: Title, Description, and Location');
      return;
    }

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          createdBy: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create job');
      }

      // Show success message
      alert('Job created successfully!');
      
      // Redirect to jobs list
      router.push('/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to create job: ${errorMessage}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950" suppressHydrationWarning>
      <Navigation />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-32 md:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-lg hover:bg-white/10 transition-all flex-shrink-0"
          >
            <ArrowLeft size={20} className="sm:w-6 sm:h-6 text-primary-400" />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-4xl font-bold gradient-text truncate">Create New Job</h1>
            <p className="text-xs sm:text-sm text-dark-300 mt-1 sm:mt-2">Post a new job opening on JOBEZZY</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div className="glass-dark rounded-xl p-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Job Title <span className="text-accent-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Senior Blockchain Developer"
              className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
            />
          </div>

          {/* Job Description */}
          <div className="glass-dark rounded-xl p-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Job Description <span className="text-accent-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the job role, responsibilities, and requirements..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
            />
          </div>

          {/* Company & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-dark rounded-xl p-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Company Name <span className="text-accent-400">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Your company name"
                className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>

            <div className="glass-dark rounded-xl p-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Location <span className="text-accent-400">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Remote, New York, etc."
                className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          {/* Salary & Job Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-dark rounded-xl p-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Salary (TON)
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="e.g., 50 TON"
                className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>

            <div className="glass-dark rounded-xl p-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Job Type
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
          </div>

          {/* Skills */}
          <div className="glass-dark rounded-xl p-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Required Skills
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill and press Enter"
                className="flex-1 px-4 py-3 rounded-lg bg-dark-800/50 border border-primary-500/30 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Skills List */}
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500 text-primary-300"
                >
                  <span className="text-sm font-medium">{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-primary-100 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95"
            >
              Post Job
            </button>
            <Link
              href="/jobs"
              className="flex-1 py-3 px-6 border border-primary-500 text-primary-400 hover:bg-primary-500/10 font-bold rounded-lg transition-all text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
