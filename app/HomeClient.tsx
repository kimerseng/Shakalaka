'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import MovieSection from "@/src/components/MovieSection";
import Footer from "@/src/components/Footer";
import { MOVIE_TYPES } from "@/src/constants";

// ✅ FETCH FROM API
async function getMovies(search?: string, type?: string) {
  try {
    let url = "/api/movies";
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (type) params.set("type", type);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) throw new Error("Failed to fetch movies");

    return await res.json();
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

export default function HomeClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize from URL params once
  const [search, setSearch] = useState<string>(searchParams.get("search") || "");
  const [typeFilter, setTypeFilter] = useState<string>(
    searchParams.get("type") || "All"
  );
  const [movies, setMovies] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);

  // ✅ FETCH DATA (Debounce)
  useEffect(() => {
    // Debounced fetch + sync URL (replace to avoid history spam)
    const delay = setTimeout(async () => {
      const data = await getMovies(
        search,
        typeFilter === "All" ? undefined : typeFilter
      );

      setMovies(data);
      setVisibleCount(8);

      // sync URL params without adding history entry
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (typeFilter !== "All") params.set("type", typeFilter);

      const queryString = params.toString();
      // Use replace so typing doesn't create many history entries
      router.replace(queryString ? `/?${queryString}` : "/");
    }, 400);

    return () => clearTimeout(delay);
  }, [search, typeFilter, router]);

  // ✅ SEARCH
  const handleSearch = (query: string) => {
    // only update local state; URL will be synced by debounced effect
    setSearch(query);
  };

  // ✅ FILTER
  const handleTypeFilter = (newType: string) => {
    // only update local state; URL will be synced by debounced effect
    setTypeFilter(newType);
  };

  const visibleMovies = movies.slice(0, visibleCount);
  const hasMore = movies.length > visibleMovies.length;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar onSearch={handleSearch} initialQuery={search} />

      <main className="p-4 max-w-[1400px] mx-auto">

        {/* FILTER */}
        <div className="mb-8">
          <h2 className="text-sm text-zinc-400 mb-3">Filter by Type</h2>
          <div className="flex flex-wrap gap-3">
            {["All", ...MOVIE_TYPES].map((t) => (
              <button
                key={t}
                onClick={() => handleTypeFilter(t)}
                className={`px-5 py-2 rounded-full border
                  ${
                    typeFilter === t
                      ? "bg-[#e5a00d] text-black"
                      : "bg-white/5 text-white"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY */}
        {movies.length === 0 && (
          <div className="text-center py-20 text-zinc-400">
            No Movies Found 😢
          </div>
        )}

        {/* MOVIES */}
        {movies.length > 0 && (
          <MovieSection
            title="Movies"
            movies={visibleMovies}
            type="video"
          />
        )}

        {/* LOAD MORE */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="px-6 py-3 bg-[#e5a00d] text-black rounded-xl"
            >
              Load More
            </button>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}