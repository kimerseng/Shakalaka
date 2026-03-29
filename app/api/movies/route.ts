import { movieService } from '@/src/services/movie.service';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const type = searchParams.get('type');
  const search = searchParams.get('search');

  const movies = await movieService.getMovies({ type, search });

  return Response.json(movies);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const movie = await movieService.createMovie(body);
    return Response.json(movie);
  } catch (error) {
    return Response.json({ error: 'Create failed' }, { status: 500 });
  }
}