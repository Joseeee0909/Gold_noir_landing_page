import { randomUUID } from "crypto";
import sharp from "sharp";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "goldnoir-images";

async function ensureBucketExists() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Faltan las variables de Supabase Storage");
  }

  const getResponse = await fetch(
    `${SUPABASE_URL}/storage/v1/bucket/${encodeURIComponent(SUPABASE_STORAGE_BUCKET)}`,
    {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );

  if (getResponse.ok) {
    const bucket = await getResponse.json().catch(() => ({}));
    if (bucket?.public !== false) return;

    throw new Error(`El bucket ${SUPABASE_STORAGE_BUCKET} existe pero no es público`);
  }

  if (getResponse.status !== 404) {
    const message = await getResponse.text().catch(() => "");
    throw new Error(message || `No se pudo consultar el bucket (${getResponse.status})`);
  }

  const response = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: SUPABASE_STORAGE_BUCKET,
      name: SUPABASE_STORAGE_BUCKET,
      public: true,
    }),
  });

  if (response.ok) return;

  const message = await response.text().catch(() => "");
  throw new Error(message || `No se pudo preparar el bucket (${response.status})`);
}

async function uploadToSupabaseStorage(buffer) {
  await ensureBucketExists();

  const fileName = `${randomUUID()}.webp`;
  const objectPath = `perfumes/${fileName}`;
  const uploadResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/${SUPABASE_STORAGE_BUCKET}/${objectPath}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "image/webp",
      "x-upsert": "true",
    },
    body: buffer,
  });

  if (!uploadResponse.ok) {
    const message = await uploadResponse.text().catch(() => "");
    throw new Error(message || `No se pudo subir la imagen (${uploadResponse.status})`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${objectPath}`;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    if (!String(file.type || "").startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json({ error: "La imagen supera el límite de 10 MB" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const webpBuffer = await sharp(buffer)
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const url = await uploadToSupabaseStorage(webpBuffer);

    return NextResponse.json({
      ok: true,
      url,
    });
  } catch (error) {
    console.error("Upload image error:", error);
    return NextResponse.json({ error: error?.message || "No se pudo procesar la imagen" }, { status: 500 });
  }
}