const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

const SYSTEM_PROMPT = `You are an expert tropical cyclone analyst specializing in satellite imagery interpretation.

Analyze the provided satellite image and classify the tropical cyclone using ALL THREE international classification systems. Base your analysis on visible features: eye structure, eye wall organization, spiral band density, cloud top temperatures, and overall system symmetry.

Return ONLY a valid JSON object with this exact structure, no markdown, no explanation:

{
  "detected": true,
  "confidence": "high|medium|low",
  "analysis": "2-3 sentence expert description of visible satellite features",
  "destructive_potential": "brief 1-sentence risk summary",
  "pagasa": {
    "classification": "TD|TS|STS|TY|STY",
    "label": "Tropical Depression|Tropical Storm|Severe Tropical Storm|Typhoon|Super Typhoon",
    "signal": "N/A|PSWS#1|PSWS#2|PSWS#3|PSWS#4|PSWS#5",
    "wind_kmh_sustained": "range as string e.g. 45-60",
    "wind_knots": "range as string",
    "description": "one sentence on PAGASA classification basis"
  },
  "saffir_simpson": {
    "classification": "TD|TS|CAT1|CAT2|CAT3|CAT4|CAT5",
    "label": "Tropical Depression|Tropical Storm|Category 1|Category 2|Category 3|Category 4|Category 5",
    "wind_mph_sustained": "range as string",
    "storm_surge_ft": "range as string",
    "damage_potential": "Minimal|Moderate|Extensive|Extreme|Catastrophic",
    "description": "one sentence on Saffir-Simpson classification basis"
  },
  "jma": {
    "classification": "TD|TS|STS|T",
    "label": "Tropical Depression|Tropical Storm|Severe Tropical Storm|Typhoon",
    "wind_ms_10min": "range as string e.g. 25-32",
    "central_pressure_hpa": "estimated value as string e.g. 975",
    "basin": "Western North Pacific",
    "description": "one sentence on JMA classification basis"
  },
  "storm_surge_risk": "None|Low|Moderate|High|Extreme",
  "rainfall_risk": "None|Low|Moderate|High|Extreme",
  "estimated_diameter_km": "value as string or range"
}

If no tropical cyclone is detected, return:
{"detected": false, "confidence": "high", "analysis": "No tropical cyclone structure detected.", "reason": "brief explanation"}`;

export async function classifyViaNgrok(ngrokUrl, base64Image, mimeType = 'image/jpeg') {
  const endpoint = `${ngrokUrl.replace(/\/$/, '')}/classify`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image, mime_type: mimeType }),
  });
  if (!response.ok) throw new Error(`ESP32 responded with ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return JSON.parse(data.result);
}

export async function classifyDirect(base64Image, mimeType = 'image/jpeg') {
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: SYSTEM_PROMPT },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || `Groq API error ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from Groq');

  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

export async function pingESP32(ngrokUrl) {
  try {
    const start = Date.now();
    const res = await fetch(`${ngrokUrl.replace(/\/$/, '')}/ping`, {
      method: 'GET',
      signal: AbortSignal.timeout(4000),
    });
    const latency = Date.now() - start;
    if (res.ok) return { online: true, latency };
    return { online: false, latency: null };
  } catch {
    return { online: false, latency: null };
  }
}