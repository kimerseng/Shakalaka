"use client";

import { useEffect, useRef } from "react";

export default function MoviePlayer({ src }: { src: string | null }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !src) return;

    let isMounted = true;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (err) {
        console.log("Play interrupted:", err);
      }
    };

    playVideo();

    return () => {
      isMounted = false;

      if (video) {
        video.pause();
        video.removeAttribute("src"); // ✅ IMPORTANT
        video.load(); // ✅ reset
      }
    };
  }, [src]);

  if (!src) return null; // ✅ prevent empty src

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
    />
  );
}