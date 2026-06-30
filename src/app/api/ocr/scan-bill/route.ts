import { NextRequest, NextResponse } from "next/server";
import { DEMO_OCR_RESULT } from "@/lib/demo-ocr";

const VISION_ENDPOINT = "https://vision.googleapis.com/v1/images:annotate";
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

/* ── Regex patterns for PLN bill fields ── */
const PATTERNS = {
  noPelanggan:   /(?:no\.?\s*pelanggan|id pelanggan|nomor pelanggan)[^\d]*(\d{10,13})/i,
  namaPelanggan: /(?:nama pelanggan|nama)[^\n:]*[:\s]+([A-Z][A-Z\s]{2,40})/i,
  bulanTagihan:  /(?:periode|bulan tagihan|tagihan bulan)[^\n:]*[:\s]+([A-Z]{3,}\s*\d{4}|\d{2}[/-]\d{4})/i,
  dayaVA:        /(?:daya|tarif daya)[^\d]*(\d[\d.]+\s*VA)/i,
  kwh:           /(?:pemakaian|penggunaan|stand|kwh)[^\d]*(\d[\d.,]+)\s*kwh/i,
  tagihan:       /(?:tagihan listrik|rp\.?\s*tagihan|jumlah tagihan|total)[^\d]*rp\.?\s*([\d.,]+)/i,
};

function extractValue(text: string, pattern: RegExp): string | undefined {
  const m = text.match(pattern);
  return m?.[1]?.trim();
}

function parseNumber(raw?: string): number | undefined {
  if (!raw) return undefined;
  const cleaned = raw.replace(/[.,]/g, "").replace(/\s/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? undefined : n;
}

function scoreConfidence(kwh?: number, tagihan?: number, noPelanggan?: string): number {
  let score = 0;
  if (kwh && kwh > 0 && kwh < 10000) score += 40;
  if (tagihan && tagihan > 1000) score += 35;
  if (noPelanggan && noPelanggan.length >= 10) score += 25;
  return score;
}

export async function POST(req: NextRequest) {
  const VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_VISION_API_KEY ?? "";
  const VISION_URL = `${VISION_ENDPOINT}?key=${VISION_API_KEY}`;

  console.log("[OCR] POST called, key length:", VISION_API_KEY.length);

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    if (!file) {
      console.error("[OCR] No file in formdata");
      return NextResponse.json({ success: false, message: "File gambar tidak ditemukan" }, { status: 400 });
    }

    console.log("[OCR] File received:", file.name, file.size, "bytes", file.type);

    /* Demo mode — return dummy PLN bill data */
    if (DEMO_MODE || !VISION_API_KEY) {
      await new Promise((r) => setTimeout(r, 1200));
      return NextResponse.json({
        ...DEMO_OCR_RESULT,
        message: "Hasil demo — mode lokal tanpa Google Vision API",
      });
    }

    /* Convert to base64 */
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    console.log("[OCR] Calling Vision API, base64 length:", base64.length);

    /* Call Google Vision API */
    const visionRes = await fetch(VISION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [{
          image: { content: base64 },
          features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
          imageContext: { languageHints: ["id", "en"] },
        }],
      }),
    });

    console.log("[OCR] Vision API response status:", visionRes.status);

    if (!visionRes.ok) {
      const errText = await visionRes.text();
      console.error("[OCR] Vision API Error:", errText);
      let errMsg = "Google Vision API error";
      try { errMsg = (JSON.parse(errText) as { error?: { message?: string } }).error?.message ?? errMsg; } catch {}
      return NextResponse.json({ success: false, message: errMsg }, { status: 502 });
    }

    const visionData = await visionRes.json() as {
      responses: Array<{
        textAnnotations?: Array<{ description: string }>;
        error?: { message: string };
      }>;
    };

    const response = visionData.responses?.[0];
    if (response?.error) {
      return NextResponse.json({ success: false, message: response.error.message }, { status: 422 });
    }

    const rawText = response?.textAnnotations?.[0]?.description ?? "";
    if (!rawText) {
      return NextResponse.json({ success: false, message: "Tidak ada teks terdeteksi di gambar" }, { status: 422 });
    }

    /* Extract PLN bill fields */
    const noPelangganRaw   = extractValue(rawText, PATTERNS.noPelanggan);
    const namaPelanggan    = extractValue(rawText, PATTERNS.namaPelanggan);
    const bulanTagihan     = extractValue(rawText, PATTERNS.bulanTagihan);
    const dayaVA           = extractValue(rawText, PATTERNS.dayaVA);
    const kwhRaw           = extractValue(rawText, PATTERNS.kwh);
    const tagihanRaw       = extractValue(rawText, PATTERNS.tagihan);

    const kwh     = parseNumber(kwhRaw);
    const tagihan = parseNumber(tagihanRaw);
    const confidence = scoreConfidence(kwh, tagihan, noPelangganRaw);

    return NextResponse.json({
      success: true,
      kwh,
      tagihan,
      confidence,
      raw_text: rawText,
      data: {
        no_pelanggan:    noPelangganRaw,
        nama_pelanggan:  namaPelanggan,
        bulan_tagihan:   bulanTagihan,
        daya_va:         dayaVA,
        penggunaan_kwh:  kwhRaw,
        tagihan_rp:      tagihanRaw,
      },
    });

  } catch (err) {
    console.error("[OCR Route Error]", err);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
