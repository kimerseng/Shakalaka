import prisma from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";

const ALLOWED_FIELDS = [
  "title",
  "duration",
  "type",
  "subtitle",
  "poster",
  "posterUrl",
  "year",
];

function pickAllowed(data: any) {
  const out: any = {};
  for (const k of ALLOWED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(data, k)) {
      out[k] = data[k];
    }
  }
  // If frontend sent posterUrl (data URL), always map it to poster (DB column)
  // prefer posterUrl over poster so uploaded image data is used as-is.
  if (Object.prototype.hasOwnProperty.call(out, 'posterUrl')) {
    out.poster = out.posterUrl;
    delete out.posterUrl;
  }

  // Normalize poster: if explicitly undefined, remove the key so Prisma uses default/null
  if (out.poster === undefined) delete out.poster;

  return out;
}

export const movieService = {
  async getMovies(filters?: any) {
    const where: any = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.search)
      where.title = { contains: filters.search, mode: "insensitive" };

    return await prisma.movie.findMany({
      where,
      orderBy: { id: "desc" },
    });
  },

  async getMovieById(id: number) {
  return await prisma.movie.findUnique({ where: { id: id as any } });
  },

  async createMovie(data: any) {
    try {
      console.log("service.createMovie payload (raw):", data);
      const payload: any = pickAllowed(data);
      console.log("service.createMovie payload (processed):", payload);
      if (payload.year !== undefined && payload.year !== null)
        payload.year = Number(payload.year);

      const created = await prisma.movie.create({ data: payload });
      console.log("service.createMovie created:", created);
      return created;
    } catch (err) {
      console.error("service.createMovie error:", err);
      throw err;
    }
  },

  async updateMovie(id: number, data: any) {
    const payload: any = pickAllowed(data);
    if (payload.year !== undefined && payload.year !== null)
      payload.year = Number(payload.year);

    try {
  return await prisma.movie.update({ where: { id: id as any }, data: payload });
    } catch (err) {
      // Return null when record not found, keep other errors bubbling
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        return null;
      }
      throw err;
    }
  },

  async deleteMovie(id: number) {
    try {
  await prisma.movie.delete({ where: { id: id as any } });
      return true;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        return false;
      }
      throw err;
    }
  },
};