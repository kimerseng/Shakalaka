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
  // If frontend sent posterUrl, map it to poster (DB column)
  if (Object.prototype.hasOwnProperty.call(out, "posterUrl")) {
    out.poster = out.posterUrl;
    delete out.posterUrl;
  }

  if (out.poster === undefined) delete out.poster;

  return out;
}

function mapDbMovieToDto(m: any) {
  if (!m) return m;
  // convert DB model fields to frontend-friendly shape
  const dto: any = {
    ...m,
    posterUrl: m.poster ?? undefined,
  };
  // normalize id/year to strings where the frontend expects them
  if (typeof dto.id === "number") dto.id = String(dto.id);
  if (dto.year !== undefined && dto.year !== null) dto.year = String(dto.year);
  return dto;
}

export const movieService = {
  async getMovies(filters?: any) {
    const where: any = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.search) where.title = { contains: filters.search, mode: "insensitive" };

    const rows = await prisma.movie.findMany({ where, orderBy: { id: "desc" } });
    return rows.map(mapDbMovieToDto);
  },

  async getMovieById(id: number) {
    const row = await prisma.movie.findUnique({ where: { id: id as any } });
    return mapDbMovieToDto(row);
  },

  async createMovie(data: any) {
    try {
      console.log("service.createMovie payload (raw):", data);
      const payload: any = pickAllowed(data);
      console.log("service.createMovie payload (processed):", payload);
      if (payload.year !== undefined && payload.year !== null) payload.year = Number(payload.year);

      const created = await prisma.movie.create({ data: payload });
      console.log("service.createMovie created:", created);
      return mapDbMovieToDto(created);
    } catch (err) {
      console.error("service.createMovie error:", err);
      throw err;
    }
  },

  async updateMovie(id: number, data: any) {
    const payload: any = pickAllowed(data);
    if (payload.year !== undefined && payload.year !== null) payload.year = Number(payload.year);

    try {
      const updated = await prisma.movie.update({ where: { id: id as any }, data: payload });
      return mapDbMovieToDto(updated);
    } catch (err) {
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