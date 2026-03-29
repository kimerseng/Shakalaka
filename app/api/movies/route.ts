import { NextRequest } from 'next/server';
import { movieService } from '@/src/services/movie.service';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type') ?? undefined;
  const search = url.searchParams.get('search') ?? undefined;

  const movies = await movieService.getMovies({ type, search });
  return new Response(JSON.stringify(movies), { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const movie = await movieService.createMovie(body);

  return new Response(JSON.stringify(movie), { status: 201 });
}