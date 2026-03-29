import { movieService } from '@/src/services/movie.service';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const movie = await movieService.getMovieById(Number(params.id));

  if (!movie) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json(movie);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await movieService.updateMovie(Number(params.id), body);

    if (!updated) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    return Response.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const deleted = await movieService.deleteMovie(Number(params.id));

  if (!deleted) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json({ success: true });
}