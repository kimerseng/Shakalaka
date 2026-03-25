'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Movie, SubtitleLanguage } from '@/src/types';
import { MOVIE_TYPES } from '@/src/constants';
import { compressImage } from '@/src/lib/image';

interface MovieFormProps {
  movie?: Movie;
  onClose: () => void;
  // optional callback after successful submit - may return a promise
  onSuccess?: (data: Omit<Movie, 'id'>) => void | Promise<void>;
}

const MovieForm = ({ movie, onClose, onSuccess }: MovieFormProps) => {
  const [formData, setFormData] = useState<Omit<Movie, 'id'>>({
    title: movie?.title || '',
    duration: movie?.duration || '',
    type: movie?.type || MOVIE_TYPES[0],
    subtitle: movie?.subtitle || 'EN',
    videoUrl: movie?.videoUrl || '',       // optional
    posterUrl: movie?.posterUrl || '',     // required
    year: movie?.year || '2024',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(movie?.posterUrl ?? null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.title || !formData.duration || !formData.type || !formData.year) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // For new movies, poster must be uploaded. For edits, preview may already exist.
    if (!preview) {
      setError('Please upload a poster image');
      setLoading(false);
      return;
    }

    try {
      // Poster can be either a data URL (legacy) or a public URL returned by our upload endpoint
      const posterVal = String(formData.posterUrl || '');
      const isDataUrl = posterVal.startsWith('data:');
      const isPublicUrl = posterVal.startsWith('/') || posterVal.startsWith('http');
      if (!(isDataUrl || isPublicUrl)) {
        setError('Poster must be uploaded from your device');
        setLoading(false);
        return;
      }

  // Prepare sanitized payload: remove videoUrl if empty
  const payload: any = { ...formData };
  if (!payload.videoUrl) delete payload.videoUrl;

  // Emit form data to parent for create/update handling
  await onSuccess?.(payload);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (file?: File) => {
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      // Upload raw file directly to server (no generation)
      const filename = `${Date.now()}-${file.name}`.replace(/[^a-zA-Z0-9._-]/g, '_');
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'POST',
        body: file,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Upload failed');
      }

      const json = await res.json();
      const publicUrl = json.url as string;

      setFormData({ ...formData, posterUrl: publicUrl });
      setPreview(publicUrl);
    } catch (err) {
      console.error('Failed to upload image', err);
      setError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="relative mx-auto my-8 max-w-3xl w-full bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors text-white"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-6">
          {movie ? 'Edit Movie' : 'Create New Movie'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Movie Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Movie Title</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#e5a00d] outline-none text-white transition-all"
              placeholder="e.g. Inception"
            />
          </div>

          {/* Duration + Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Duration</label>
              <input
                required
                type="text"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#e5a00d] outline-none text-white transition-all"
                placeholder="e.g. 2h 15m"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Year</label>
              <input
                required
                type="text"
                value={formData.year}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#e5a00d] outline-none text-white transition-all"
                placeholder="e.g. 2024"
              />
            </div>
          </div>

          {/* Type + Subtitle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#e5a00d] outline-none text-white transition-all"
              >
                {MOVIE_TYPES.map(type => (
                  <option key={type} value={type} className="bg-[#1a1a1a]">{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Subtitle</label>
              <select
                value={formData.subtitle}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value as SubtitleLanguage })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#e5a00d] outline-none text-white transition-all"
              >
                <option value="EN" className="bg-[#1a1a1a]">English</option>
                <option value="KH" className="bg-[#1a1a1a]">Khmer</option>
                <option value="Both" className="bg-[#1a1a1a]">Both</option>
              </select>
            </div>
          </div>

          {/* Video URL removed - videos are not stored via the form */}

          {/* Poster: file upload or URL (required) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Poster (Upload image or enter URL)</label>

            <div className="flex gap-3 items-start">
              <input
                required={!movie}
                type="file"
                accept="image/*"
                onChange={e => handleFileChange(e.target.files?.[0])}
                className="text-sm text-white"
              />

              {preview && (
                <div className="mt-0 w-48 h-64 rounded overflow-hidden border border-white/10">
                  <img src={preview} alt="poster preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[#e5a00d] text-black font-bold rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-[#e5a00d]/20"
            >
              {loading ? 'Saving...' : movie ? 'Save Changes' : 'Create Movie'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MovieForm;