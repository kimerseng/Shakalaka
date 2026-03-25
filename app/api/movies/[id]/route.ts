import { NextRequest, NextResponse } from "next/server";
import { movieController } from "@/src/controller/movie.contoller";

// GET /api/movies/:id - get movie by id
export async function GET(req: NextRequest, context: any) {
  try {
  const params = await context?.params;
  const id = parseInt(params?.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const movie = await movieController.getMovieById(id);
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch movie" }, { status: 500 });
  }
}

// PUT /api/movies/:id - update movie
export async function PUT(req: NextRequest, context: any) {
  try {
  const params = await context?.params;
  const id = parseInt(params?.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();

    const updated = await movieController.updateMovie(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
  }
}

// DELETE /api/movies/:id - delete movie
export async function DELETE(req: NextRequest, context: any) {
  try {
  const params = await context?.params;
  const id = parseInt(params?.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    // Check existence first
    const existing = await movieController.getMovieById(id);
    if (!existing) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    await movieController.deleteMovie(id);

    // respond with 204 No Content
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
  }
}