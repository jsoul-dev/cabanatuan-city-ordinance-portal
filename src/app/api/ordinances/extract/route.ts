import { NextResponse } from "next/server";
import { ai, GEMINI_MODEL } from "@/lib/gemini";
import { Type, Schema } from "@google/genai";

/**
 * POST /api/ordinances/extract
 * Uses @google/genai with gemini-3.5-flash-lite to extract structured ordinance metadata
 * from text or scanned images/PDFs.
 *
 * CRITICAL RULE: Automatically strips redundant prefixes from the title
 * (e.g. "City Ordinance Establishing...", "Ordinansa para sa...", "AN ORDINANCE...").
 */

const ORDINANCE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description:
        "Cleaned and descriptive title of the ordinance. STRIP any redundant prefixes like 'City Ordinance...', 'Ordinansa para sa...', 'AN ORDINANCE...', 'Ordinance Establishing...', 'Ordinansang...'. Just give the core clean title (e.g. 'Curfew Hours for Minors in Cabanatuan City', 'Tamang Pagtatapon ng Basura at Segregation').",
    },
    ordinanceNumber: {
      type: Type.STRING,
      description:
        "The official ordinance or resolution number (e.g. 'Ord. No. 001-2024' or '012-2024').",
    },
    series: {
      type: Type.STRING,
      description: "The series year of the ordinance (e.g. '2024').",
    },
    year: {
      type: Type.INTEGER,
      description: "4-digit year enacted (e.g. 2024).",
    },
    dateEnacted: {
      type: Type.STRING,
      description:
        "Date of enactment in YYYY-MM-DD format if available, otherwise 'YYYY-01-01'.",
    },
    category: {
      type: Type.STRING,
      enum: [
        "PUBLIC_SAFETY",
        "ENVIRONMENT",
        "HEALTH",
        "BUSINESS",
        "TRAFFIC",
        "YOUTH",
        "OTHER",
      ],
      description: "Primary category classification of the ordinance.",
    },
    summary: {
      type: Type.STRING,
      description:
        "A clear, easy-to-understand 2-3 sentence summary in Filipino/Tagalog explaining what the ordinance is about and why it matters.",
    },
    coverage: {
      type: Type.STRING,
      description:
        "Geographical or demographic coverage (e.g., 'Buong Lungsod ng Cabanatuan', 'Barangay Camp Tinio', 'Lahat ng komersyal na establisimyento').",
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        "3 to 6 relevant search tags or keywords in lowercase (e.g. ['curfew', 'minors', 'public safety']).",
    },
    penalties: {
      type: Type.STRING,
      description:
        "Summary of penalties, fines, and sanctions per offense (e.g. 'Unang Paglabag: Php 500 o babala; Ikalawang Paglabag: Php 1,000; Ikatlong Paglabag: Php 2,500 o community service'). If none stated, enter 'Walang nakasaad na parusa'.",
    },
    enforcement: {
      type: Type.STRING,
      description:
        "Agency or officials responsible for enforcement (e.g. 'PNP Cabanatuan, Barangay Tanod, City Social Welfare and Development Office').",
    },
    content: {
      type: Type.STRING,
      description:
        "The full comprehensive legal content of the ordinance formatted in clean Markdown, including articles, sections, WHEREAS clauses, and provisions.",
    },
  },
  required: [
    "title",
    "ordinanceNumber",
    "series",
    "year",
    "dateEnacted",
    "category",
    "summary",
    "coverage",
    "tags",
    "penalties",
    "enforcement",
    "content",
  ],
};

const EXTRACTION_PROMPT = `Ikaw ay isang batikan at eksperto sa mga lokal na ordinansa sa Pilipinas, lalo na sa Lungsod ng Cabanatuan.
Suriin nang mabuti ang ibinigay na teksto o larawan/scanned na ordinansa o resolusyon.
I-extract ang lahat ng kinakailangang impormasyon at sundin nang maigi ang schema.

MAHALAGANG PATAKARAN SA PAMAGAT (TITLE):
- ALISIN ANG MGA REDUNDANT NA SALITA sa simula ng pamagat gaya ng:
  * "City Ordinance Establishing..." -> alisin ang "City Ordinance Establishing ", ibigay ang natitirang malinaw na pamagat
  * "An Ordinance Regulating..." -> alisin ang "An Ordinance Regulating "
  * "Ordinansa para sa..." -> alisin ang "Ordinansa para sa "
  * "Ordinansang..." -> alisin ang "Ordinansang "
- Ang pamagat ay dapat maikli, malinaw, at direktang nagsasabi kung tungkol saan ang ordinansa (halimbawa: "Curfew Hours for Minors in Cabanatuan City", "Tamang Pagtatapon ng Basura at Segregation sa Barangay", "Anti-Muffler at Maingay na Tambutso").
- Para sa "summary", gumawa ng napakalinaw at madaling intindihing buod sa wikang Tagalog/Filipino para sa ordinaryong mamamayan.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, base64Image, mimeType } = body;

    if (!text && !base64Image) {
      return NextResponse.json(
        { error: "Mangyaring magbigay ng teksto o larawan ng ordinansa." },
        { status: 400 }
      );
    }

    const contents: any[] = [];
    if (base64Image && mimeType) {
      contents.push({
        inlineData: {
          data: base64Image,
          mimeType,
        },
      });
    }
    if (text) {
      contents.push(text);
    }
    contents.push(EXTRACTION_PROMPT);

    const result = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: ORDINANCE_SCHEMA,
        temperature: 0.1,
      },
    });

    const responseText = result.text;
    if (!responseText) {
      return NextResponse.json(
        { error: "Hindi nabasa ang ordinansa. Subukan muli." },
        { status: 500 }
      );
    }

    const extracted = JSON.parse(responseText);
    return NextResponse.json({ success: true, data: extracted });
  } catch (error: any) {
    console.error("AI Ordinance Extraction Error:", error);
    return NextResponse.json(
      {
        error:
          error?.message || "Nagkaroon ng aberya sa AI auto-extraction.",
      },
      { status: 500 }
    );
  }
}
