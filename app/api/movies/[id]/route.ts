// app/api/movies/[id]/route.ts
import { NextRequest } from 'next/server';
import { movieService } from '@/src/services/movie.service';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const movie = await movieService.getMovieById(Number(id));

  if (!movie) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(movie), { status: 200 });
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const body = await req.json();

  const updated = await movieService.updateMovie(Number(id), body);
  if (!updated) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  const deleted = await movieService.deleteMovie(Number(id));
  if (!deleted) {
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}