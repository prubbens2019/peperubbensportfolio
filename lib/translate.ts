import Anthropic from "@anthropic-ai/sdk";

export interface TranslationItem {
  id: string;
  text: string;
}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY ontbreekt. Zet 'm in .env.local om te kunnen vertalen."
    );
  }
  if (!client) client = new Anthropic();
  return client;
}

const SYSTEM_PROMPT =
  "You translate short Dutch portfolio-website copy (titles, subtitles, and " +
  "markdown body text) into natural, professional English. Preserve markdown " +
  "formatting and line breaks exactly. Keep the tone consistent with a " +
  "personal creative portfolio. Return only the translation, no commentary.";

/** Translates a batch of NL text snippets to EN in a single API call. */
export async function translateBatch(
  items: TranslationItem[]
): Promise<Record<string, string>> {
  if (items.length === 0) return {};

  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: "claude-opus-5",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    output_config: {
      effort: "low",
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            translations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  text_en: { type: "string" },
                },
                required: ["id", "text_en"],
                additionalProperties: false,
              },
            },
          },
          required: ["translations"],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: "user",
        content: JSON.stringify(
          items.map((item) => ({ id: item.id, text: item.text }))
        ),
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("Vertaling geweigerd door de Anthropic API.");
  }

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Geen tekstrespons ontvangen van de Anthropic API.");
  }

  const parsed = JSON.parse(textBlock.text) as {
    translations: { id: string; text_en: string }[];
  };

  const result: Record<string, string> = {};
  for (const entry of parsed.translations) {
    result[entry.id] = entry.text_en;
  }
  return result;
}
