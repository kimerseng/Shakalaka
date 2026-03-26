import { NextRequest, NextResponse } from "next/server";
import { movieController } from "@/src/controller/movie.contoller";

// ✅ GET ALL
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query = {
      search: searchParams.get("search") || undefined,
      type: searchParams.get("type") || undefined,
    };

    const movies = await movieController.getMovies(query);

    return NextResponse.json(movies);
  } catch (error) {
    const dev = process.env.NODE_ENV !== 'production';
    console.error('GET /api/movies error:', error);
    return NextResponse.json(
      { error: dev ? String(error) : 'Failed to fetch' },
      { status: 500 }
    );
    
  }
}

// ✅ CREATE
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    const required = ["title", "duration", "type", "subtitle"];
    for (const key of required) {
      if (!body || typeof body[key] !== "string" || !body[key].trim()) {
        return NextResponse.json(
          { error: `Missing or invalid field: ${key}` },
          { status: 400 }
        );
      }
    }

    // normalize year/poster if needed
    if (body.year && typeof body.year === "string" && body.year.trim()) {
      body.year = Number(body.year);
    }

    const movie = await movieController.createMovie(body);

    return NextResponse.json(movie);
  } catch (error) {
    console.error('POST /api/movies error:', error);
    const dev = process.env.NODE_ENV !== 'production';
    return NextResponse.json(
      { error: dev ? String(error) : 'Failed to create' },
      { status: 500 }
    );
  }
}