'use client';

import { useState } from 'react';
import { X, Star } from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  companyId: string;
  candidateId: string;
  escrowId: string;
  companyName: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export default function RatingModal({
  isOpen,
  companyName,
  onClose,
  onSubmit,
}: RatingModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(rating, comment);
      setRating(5);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-dark rounded-xl p-6 max-w-md w-full animate-fadeInUp">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Rate {companyName}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-dark-700 rounded transition-all"
          >
            <X size={24} className="text-dark-400" />
          </button>
        </div>

        <p className="text-dark-300 mb-6">How was your experience working with this company?</p>

        {/* Star Rating */}
        <div className="mb-6">
          <p className="text-sm text-dark-400 mb-3">Your Rating</p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-all"
              >
                <Star
                  size={40}
                  className={`${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-dark-600'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-dark-400 mt-2">{rating} out of 5 stars</p>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-white mb-2">
            Additional Comments (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 resize-none"
            rows={4}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 text-white rounded-lg transition-all font-medium"
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
}
