import { NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

/**
 * AI Citizen Legal & Civic Assistant API Route.
 * Uses @google/genai (v2.3.0+) with gemini-3.5-flash-lite
 * and lightweight Prisma keyword search for grounded RAG answers.
 */
export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Mangyaring magpadala ng tamang mensahe." },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1]?.content || "";

    // Lightweight keyword search in database to provide grounded legal context
    const keywords = lastMessage
      .toLowerCase()
      .split(/\s+/)
      .filter((w: string) => w.length > 3)
      .slice(0, 3);

    let dbContext = "Walang partikular na ordinansang tumugma sa database.";

    if (keywords.length > 0) {
      const matchedOrdinances = await prisma.ordinance.findMany({
        where: {
          status: "APPROVED",
          OR: keywords.map((kw: string) => ({
            OR: [
              { title: { contains: kw, mode: "insensitive" } },
              { content: { contains: kw, mode: "insensitive" } },
              { resolutionNumber: { contains: kw, mode: "insensitive" } },
            ],
          })),
        },
        take: 3,
        include: {
          barangay: true,
        },
      });

      if (matchedOrdinances.length > 0) {
        dbContext =
          "KASALUKUYANG MGA ORDINANSA NG KABANATUAN SA DATABASE:\n" +
          matchedOrdinances
            .map(
              (ord) =>
                `- Res. No. ${ord.resolutionNumber} (${ord.type === "CITY" ? "City Ordinance" : `Brgy. ${ord.barangay?.name}`}): ${ord.title}\n  Buod/Nilalaman: ${ord.content?.slice(0, 250)}...`
            )
            .join("\n\n");
      }
    }

    const systemInstruction = `Ikaw ang "Batas Kabanatuan AI" — ang opisyal na AI Legal & Civic Assistant ng Lungsod ng Kabanatuan (Cabanatuan City Ordinance Portal).
Ang layunin mo ay sagutin ang mga katanungan ng mga mamamayan (citizens) tungkol sa mga ordinansa, batas ng lungsod, mga tuntunin sa barangay, curfew, basura, atbp.

MGA PATAKARAN SA PAGSAGOT:
1. Sumagot sa magalang, malinaw, at madaling maintindihan na wikang Filipino/Tagalog (o English kung sa English nagtanong ang user).
2. Gamitin ang sumusunod na data mula sa ating Kabanatuan Ordinance Database upang maging tumpak (grounded):
${dbContext}
3. Kung may tinutukoy na ordinansa, banggitin ang Resolution Number at Title kung nasa context.
4. Kung wala sa database ang partikular na sagot, sabihin nang tapat at payuhing makipag-ugnayan sa Sangguniang Panlungsod o sa kani-kanilang Barangay Hall. Never invent fake legal resolution numbers.
5. Panatilihin ang propesyonal, matulungin, at makababayang tono ("Bagong Kabanatuan").`;

    // Convert chat messages to Gemini content format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents,
      config: {
        systemInstruction,
        temperature: 0.3, // Low temp for accurate legal/civic responses
      },
    });

    const replyText =
      response.text || "Paumanhin, hindi ako nakabuo ng sagot sa ngayon.";

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      {
        error:
          "Nagkaroon ng aberya sa server. Mangyaring subukang muli mamaya.",
      },
      { status: 500 }
    );
  }
}
