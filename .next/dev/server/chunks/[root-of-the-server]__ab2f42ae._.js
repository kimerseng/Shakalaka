module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const prismaClientSingleton = ()=>{
    return new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
};
const prisma = globalThis.prisma ?? prismaClientSingleton();
const __TURBOPACK__default__export__ = prisma;
if ("TURBOPACK compile-time truthy", 1) globalThis.prisma = prisma;
}),
"[project]/src/services/movie.service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "movieService",
    ()=>movieService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
;
const ALLOWED_FIELDS = [
    "title",
    "duration",
    "type",
    "subtitle",
    "poster",
    "posterUrl",
    "year"
];
function pickAllowed(data) {
    const out = {};
    for (const k of ALLOWED_FIELDS){
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
function mapDbMovieToDto(m) {
    if (!m) return m;
    // convert DB model fields to frontend-friendly shape
    const dto = {
        ...m,
        posterUrl: m.poster ?? undefined
    };
    // normalize id/year to strings where the frontend expects them
    if (typeof dto.id === "number") dto.id = String(dto.id);
    if (dto.year !== undefined && dto.year !== null) dto.year = String(dto.year);
    return dto;
}
const movieService = {
    async getMovies (filters) {
        const where = {};
        if (filters?.type) where.type = filters.type;
        if (filters?.search) where.title = {
            contains: filters.search,
            mode: "insensitive"
        };
        const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].movie.findMany({
            where,
            orderBy: {
                id: "desc"
            }
        });
        return rows.map(mapDbMovieToDto);
    },
    async getMovieById (id) {
        const row = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].movie.findUnique({
            where: {
                id: id
            }
        });
        return mapDbMovieToDto(row);
    },
    async createMovie (data) {
        try {
            console.log("service.createMovie payload (raw):", data);
            const payload = pickAllowed(data);
            console.log("service.createMovie payload (processed):", payload);
            if (payload.year !== undefined && payload.year !== null) payload.year = Number(payload.year);
            const created = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].movie.create({
                data: payload
            });
            console.log("service.createMovie created:", created);
            return mapDbMovieToDto(created);
        } catch (err) {
            console.error("service.createMovie error:", err);
            throw err;
        }
    },
    async updateMovie (id, data) {
        const payload = pickAllowed(data);
        if (payload.year !== undefined && payload.year !== null) payload.year = Number(payload.year);
        try {
            const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].movie.update({
                where: {
                    id: id
                },
                data: payload
            });
            return mapDbMovieToDto(updated);
        } catch (err) {
            if (err instanceof __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Prisma"].PrismaClientKnownRequestError && err.code === "P2025") {
                return null;
            }
            throw err;
        }
    },
    async deleteMovie (id) {
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].movie.delete({
                where: {
                    id: id
                }
            });
            return true;
        } catch (err) {
            if (err instanceof __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Prisma"].PrismaClientKnownRequestError && err.code === "P2025") {
                return false;
            }
            throw err;
        }
    }
};
}),
"[project]/src/controller/movie.contoller.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "movieController",
    ()=>movieController
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$movie$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/movie.service.ts [app-route] (ecmascript)");
;
const movieController = {
    async getMovies (query) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$movie$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["movieService"].getMovies(query);
    },
    async getMovieById (id) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$movie$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["movieService"].getMovieById(id);
    },
    async createMovie (body) {
        try {
            console.log('controller.createMovie body:', body);
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$movie$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["movieService"].createMovie(body);
            console.log('controller.createMovie result:', result);
            return result;
        } catch (err) {
            console.error('controller.createMovie error:', err);
            throw err;
        }
    },
    async updateMovie (id, body) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$movie$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["movieService"].updateMovie(id, body);
    },
    async deleteMovie (id) {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$movie$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["movieService"].deleteMovie(id);
    }
};
}),
"[project]/app/api/movies/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$controller$2f$movie$2e$contoller$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/controller/movie.contoller.ts [app-route] (ecmascript)");
;
;
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const query = {
            search: searchParams.get("search") || undefined,
            type: searchParams.get("type") || undefined
        };
        const movies = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$controller$2f$movie$2e$contoller$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["movieController"].getMovies(query);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(movies);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch"
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const body = await req.json();
        // Basic validation
        const required = [
            "title",
            "duration",
            "type",
            "subtitle"
        ];
        for (const key of required){
            if (!body || typeof body[key] !== "string" || !body[key].trim()) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Missing or invalid field: ${key}`
                }, {
                    status: 400
                });
            }
        }
        // normalize year/poster if needed
        if (body.year && typeof body.year === "string" && body.year.trim()) {
            body.year = Number(body.year);
        }
        const movie = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$controller$2f$movie$2e$contoller$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["movieController"].createMovie(body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(movie);
    } catch (error) {
        console.error('POST /api/movies error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ab2f42ae._.js.map