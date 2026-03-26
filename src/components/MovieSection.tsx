'use client';

import React from 'react';
import { Movie } from '@/src/types';
import { Play } from 'lucide-react';

const VideoCard = ({ movie }: { movie: Movie }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-white/5 group-hover:border-white/20 transition-all">
        {movie.videoUrl ? (
          <video
            src={movie.videoUrl}
            poster={movie.posterUrl}
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <img
            src={movie.posterUrl || `https://picsum.photos/seed/${movie.id}/600/400`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute top-2 right-2">
          <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">
            {movie.type}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <Play size={32} className="text-white opacity-50" fill="currentColor" />
        </div>
      </div>

      <div className="mt-3">
        <h3 className="font-bold text-sm text-white truncate">{movie.title}</h3>
        <p className="text-xs text-zinc-500 mt-1">{movie.duration}</p>
      </div>
    </div>
  );
};

const PosterCard = ({ movie }: { movie: Movie }) => (
  <div className="group cursor-pointer">
    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 group-hover:border-white/20 transition-all group-hover:scale-105">
      <img
        src={movie.posterUrl || `https://picsum.photos/seed/${movie.id}/400/600`}
        alt={movie.title}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
      />
    </div>

    <div className="mt-3">
      <h3 className="font-bold text-sm text-white truncate">{movie.title}</h3>
      <p className="text-xs text-zinc-500 mt-1">
        {movie.year || '2024'} • {movie.type}
      </p>
    </div>
  </div>
);

const MovieSection = ({
  title,
  movies,
  type = 'video'
}: {
  title: string;
  movies: Movie[];
  type?: 'video' | 'poster';
}) => {
  return (
    <div className="py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>

        {/* 4-column grid with vertical scroll */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-h-[700px] overflow-y-auto pr-2">
          {movies.map((movie) => (
            <div key={movie.id}>
              {type === 'video' ? <VideoCard movie={movie} /> : <PosterCard movie={movie} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieSection;