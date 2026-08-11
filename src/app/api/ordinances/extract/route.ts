import { NextResponse } from "next/server";
import { ai, GEMINI_MODEL } from "@/lib/gemini";
import { Type, Schema } from "@google/genai";
import {
  cleanOrdinanceTitle,
  formatResolutionNumber,
  formatEnforcementAgencies,
} from "@/lib/ordinance-utils";

/**
 * POST /api/ordinances/extract
 * Uses @google/genai with gemini-3.5-flash-lite to extract structured ordinance metadata
 * from text, scanned PDF documents, or multiple image pages (OCR).
 *
 * CRITICAL RULE: Automatically strips redundant prefixes and trailing place names from the title
 * (e.g. "City Ordinance Establishing...", "Ordinansa para sa...", "AN ORDINANCE...", "sa Barangay Camp Tinio"),
 * standardizes resolution numbers to YYYY-NNN format, and isolates true signatories from attendees.
 */

const ORDINANCE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description:
        "Cleaned and descriptive title of the ordinance. STRIP any redundant prefixes ('City Ordinance...', 'Ordinansa para sa...', 'AN ORDINANCE...'). ALSO STRIP any trailing place or barangay name like ' sa Barangay Camp Tinio', ' sa Barangay D.S. Garcia', or ' in Cabanatuan City' because the place name belongs in 'coverage'. Example: If the title is 'Ordinansang nagbabawal ng maiingay na muffler sa Barangay Camp Tinio', return 'Pagbabawal ng Maiingay na Muffler o Modified na Tambutso'.",
    },
    ordinanceNumber: {
      type: Type.STRING,
      description:
        "The official RESOLUTION NUMBER or ORDINANCE NUMBER formatted strictly in YYYY-NNN format (e.g. '2024-681', '2024-002'). DO NOT return '681-2024' or 'Ordinance Blg. 02'. If the paper shows 'Resolution No. 681 s. 2024', return '2024-681'. If it shows 'Ordinance No. 02 s. 2024', return '2024-02'.",
    },
    ordinanceLabel: {
      type: Type.STRING,
      description:
        "The exact label printed on the document for the ordinance number, such as 'ORDINANCE NO. 009', 'ORDINANSA BLG. 02 S. 2024', or 'MUNICIPAL ORDINANCE 12'. Include the series if it is part of the label. This preserves the exact formatting from the original document.",
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
        "General",
        "Environment",
        "Public Safety",
        "Health",
        "Infrastructure",
        "Education",
        "Livelihood",
        "Youth",
        "Senior Citizens",
        "Women & Children",
      ],
      description:
        "Primary category classification of the ordinance. Choose the most specific fitting category (e.g. 'Public Safety' for noise/muffler/curfew, 'Environment' for waste management). Only use 'General' if no other category fits.",
    },
    summary: {
      type: Type.STRING,
      description:
        "A clear, professional 2-3 sentence Executive Summary in Tagalog/Filipino. MUST explicitly start with or mention the word 'Ordinansang' or 'Ang ordinansang ito ay' (e.g., 'Ordinansang nagbabawal ng maiingay na muffler...').",
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
        "3 to 6 relevant search tags or keywords in lowercase (e.g. ['curfew', 'minors', 'public safety', 'muffler', 'tambutso']).",
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
    signatories: {
      type: Type.STRING,
      description:
        "List ONLY the official signatories who signed, enacted, or approved the ordinance at the bottom of the document (e.g. Punong Barangay, Sangguniang Barangay members who approved/signed, Kalihim who attested). DO NOT INCLUDE 'Mga Dumalo' (attendees/present in the meeting) unless they explicitly signed at the bottom of the ordinance as signatories. Format as a clean list with names and titles.",
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
    "ordinanceLabel",
    "series",
    "year",
    "dateEnacted",
    "category",
    "summary",
    "coverage",
    "tags",
    "penalties",
    "enforcement",
    "signatories",
    "content",
  ],
};

const EXTRACTION_PROMPT = `Ikaw ay isang batikan at eksperto sa mga lokal na ordinansa sa Pilipinas, lalo na sa Lungsod ng Cabanatuan.
Suriin nang mabuti ang ibinigay na teksto, scanned PDF, o mga larawan (multi-page scanned ordinance o resolusyon).
Kung maraming pahina (multiple images o pages) ang ibinigay, BASAHIN AT PAG-UGNAYIN ANG LAHAT NG PAHINA mula simula hanggang dulo upang makumpleto ang pamagat, mga seksyon, parusa, signatories, at buong nilalaman.
I-extract ang lahat ng kinakailangang impormasyon at sundin nang maigi ang schema.

MAHALAGANG PATAKARAN:
1. RESOLUTION NUMBER / ORDINANCE NUMBER FORMAT: Laging gamitin ang pormat na YYYY-NNN (halimbawa: "2024-681", "2024-002"). Kung ang nakasulat sa dokumento ay "681-2024" o "Resolution No. 681 s. 2024", gawin itong "2024-681". Kung may Resolution No. at Ordinance Blg., unahin ang Resolution Number sa pormat na YYYY-NNN.
2. PAMAGAT (TITLE): Alisin ang mga salitang "City Ordinance Establishing", "Ordinansa para sa", "Ordinansang". ALISIN DIN ang pangalan ng barangay o lungsod sa dulo ng pamagat (hal. "sa Barangay Camp Tinio", "sa Barangay D.S. Garcia", "in Cabanatuan City") dahil ang lokasyon ay inilalagay na sa 'coverage'.
3. EXECUTIVE SUMMARY (SUMMARY): Laging simulan o banggitin na ito ay isang ordinansa (hal. "Ordinansang nagbabawal ng maiingay na muffler...").
4. MGA LUMAGDA (SIGNATORIES): HUWAG ISAMA ang "Mga Dumalo" (attendees sa pulong) sa listahan ng signatories. ILAGAY LAMANG ANG MGA OPISYAL NA LUMAGDA SA IBABA NG ORDINANSA (hal. Punong Barangay, mga Kagawad na lumagda/nagpatibay, SK Chairman, at Kalihim na nagpatunay).
5. KATEGORYA (CATEGORY): Pumili ng pinakaangkop na kategorya mula sa listahan (hal. "Public Safety" para sa curfew o maingay na muffler, "Environment" para sa basura). Huwag gamitin ang "General" kung may mas angkop na kategorya.
6. KUNG SCANNED DOCUMENT: Gamitin ang iyong OCR upang basahin ang lahat ng tatak (stamp), sulat-kamay na petsa o numero, at lagda.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, base64Image, mimeType, files } = body;

    const uploadedFiles: Array<{ data: string; mimeType: string; name?: string }> = [];

    if (Array.isArray(files) && files.length > 0) {
      uploadedFiles.push(...files);
    } else if (base64Image && mimeType) {
      uploadedFiles.push({ data: base64Image, mimeType });
    }

    if (!text && uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: "Mangyaring magbigay ng teksto o mag-upload ng dokumento/larawan ng ordinansa." },
        { status: 400 }
      );
    }

    const contents: any[] = [];
    for (const f of uploadedFiles) {
      contents.push({
        inlineData: {
          data: f.data,
          mimeType: f.mimeType,
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

    // Apply deterministic post-processing cleanups to guarantee consistency
    extracted.title = cleanOrdinanceTitle(extracted.title);
    extracted.ordinanceNumber = formatResolutionNumber(extracted.ordinanceNumber);
    extracted.enforcement = formatEnforcementAgencies(extracted.enforcement);

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

