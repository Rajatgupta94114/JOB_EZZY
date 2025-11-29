'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useAuthStore } from '@/lib/store';
import { ArrowLeft, Upload, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function KYCPage() {
  const { isAuthenticated, user, setUser } = useAuthStore();
  const [kycStatus, setKycStatus] = useState(user?.kycStatus || 'pending');
  const [documents, setDocuments] = useState<string[]>([]);
  const [verificationStarted, setVerificationStarted] = useState(false);

  const requiredDocuments = user?.role === 'company' 
    ? ['GST Certificate']
    : ['Driving License', 'Aadhar Card', 'PAN Card'];

  useEffect(() => {
    if (verificationStarted && kycStatus === 'pending') {
      const timer = setTimeout(() => {
        setKycStatus('verified');
        if (user) {
          setUser({ ...user, kycStatus: 'verified' });
        }
      }, 60000); // 1 minute

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [verificationStarted, kycStatus, user, setUser]);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newDocs = Array.from(files).map((file) => file.name);
      setDocuments([...documents, ...newDocs]);
    }
  };

  const handleStartVerification = async () => {
    if (documents.length < requiredDocuments.length) {
      alert(`Please upload all ${requiredDocuments.length} required documents`);
      return;
    }

    setVerificationStarted(true);
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 py-8 pb-32 md:pb-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4 animate-fadeInUp">
          <Link href="/profile" className="p-2 rounded-lg hover:bg-white/10 transition-all">
            <ArrowLeft size={24} className="text-primary-400" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold gradient-text">KYC Verification</h1>
            <p className="text-dark-300 mt-2">Complete your identity verification</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="glass-dark rounded-xl p-8 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Verification Status</h2>
            {kycStatus === 'verified' ? (
              <CheckCircle size={32} className="text-green-400" />
            ) : (
              <Clock size={32} className="text-yellow-400" />
            )}
          </div>

          <div className={`p-4 rounded-lg ${
            kycStatus === 'verified'
              ? 'bg-green-500/20 border border-green-500/30'
              : 'bg-yellow-500/20 border border-yellow-500/30'
          }`}>
            <p className={`text-lg font-bold ${
              kycStatus === 'verified' ? 'text-green-300' : 'text-yellow-300'
            }`}>
              {kycStatus === 'verified' ? '✓ KYC Verified' : '⏳ Verification Pending'}
            </p>
            {verificationStarted && kycStatus === 'pending' && (
              <p className="text-sm text-dark-300 mt-2">
                Verification in progress... This will complete in 1 minute.
              </p>
            )}
          </div>
        </div>

        {/* Documents Section */}
        {kycStatus !== 'verified' && (
          <div className="glass-dark rounded-xl p-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold mb-6 text-white">Required Documents</h3>

            {/* Document List */}
            <div className="space-y-3 mb-8">
              {requiredDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-dark-800/50 border border-primary-500/30 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-white">{doc}</p>
                    <p className="text-xs text-dark-400">Required for {user.role} verification</p>
                  </div>
                  <div className="text-sm font-medium text-primary-400">
                    {documents.some((d) => d.includes(doc.split(' ')[0])) ? '✓ Uploaded' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Section */}
            <div className="mb-8">
              <label className="block mb-4">
                <div className="glass-dark rounded-xl p-8 border-2 border-dashed border-primary-500/30 hover:border-primary-500/50 transition-all cursor-pointer text-center">
                  <Upload size={32} className="mx-auto mb-3 text-primary-400" />
                  <p className="font-medium text-white mb-1">Click to upload documents</p>
                  <p className="text-sm text-dark-400">Supported formats: PDF, JPG, PNG</p>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={handleDocumentUpload}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
            </div>

            {/* Uploaded Documents */}
            {documents.length > 0 && (
              <div className="mb-8">
                <h4 className="font-medium text-white mb-3">Uploaded Documents ({documents.length})</h4>
                <div className="space-y-2">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-dark-800/50 flex items-center justify-between"
                    >
                      <p className="text-sm text-dark-300">{doc}</p>
                      <button
                        onClick={() => handleRemoveDocument(index)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleStartVerification}
                disabled={documents.length < requiredDocuments.length || verificationStarted}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all"
              >
                {verificationStarted ? 'Verification in Progress...' : 'Start Verification'}
              </button>
              <Link
                href="/profile"
                className="flex-1 py-3 px-6 border border-primary-500 text-primary-400 hover:bg-primary-500/10 font-bold rounded-lg transition-all text-center"
              >
                Cancel
              </Link>
            </div>
          </div>
        )}

        {/* Verified State */}
        {kycStatus === 'verified' && (
          <div className="glass-dark rounded-xl p-12 text-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <CheckCircle size={64} className="mx-auto mb-4 text-green-400" />
            <h3 className="text-3xl font-bold text-white mb-2">KYC Verified!</h3>
            <p className="text-dark-300 mb-8">
              Your identity has been successfully verified. You can now access all platform features.
            </p>
            <Link
              href="/profile"
              className="inline-block px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-bold rounded-lg transition-all"
            >
              Back to Profile
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
