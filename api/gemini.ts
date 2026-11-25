import type { IncomingMessage, ServerResponse } from 'node:http';
import { GoogleGenAI, type Schema, Type } from '@google/genai';

interface ServerlessRequest extends IncomingMessage {
  body?: unknown;
}

interface ServerlessResponse extends ServerResponse {
  status: (statusCode: number) => ServerlessResponse;
  json: (data: unknown) => ServerlessResponse;
}

const GEMINI_MODEL = 'gemini-2.5-flash';
const MAX_QUESTION_LENGTH = 500;
const MAX_CONDITION_LENGTH = 200;

const ActionPlanResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    oneThingToDo: { type: Type.STRING },
    urgentActions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          category: { type: Type.STRING },
          why: { type: Type.STRING },
          action: { type: Type.STRING },
          riskLevel: { type: Type.STRING },
          impact: { type: Type.STRING },
        },
        required: ['id', 'title', 'category', 'why', 'action', 'riskLevel', 'impact'],
      },
    },
    swaps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          exposureReductionBadge: { type: Type.STRING },
          co2SavedBadge: { type: Type.STRING },
          action: { type: Type.STRING },
          whyMatters: { type: Type.STRING },
        },
        required: ['id', 'exposureReductionBadge', 'co2SavedBadge', 'action', 'whyMatters'],
      },
    },
    timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          time: { type: Type.STRING },
          aqiForecast: { type: Type.INTEGER },
          label: { type: Type.STRING },
          action: { type: Type.STRING },
          isSafeWindow: { type: Type.BOOLEAN },
          isHazardousWindow: { type: Type.BOOLEAN },
        },
        required: ['time', 'aqiForecast', 'label', 'action', 'isSafeWindow', 'isHazardousWindow'],
      },
    },
    roomShield: {
      type: Type.OBJECT,
      properties: {
        targetRoom: { type: Type.STRING },
        steps: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        diyPurifierTip: { type: Type.STRING },
        estimatedAqiDrop: { type: Type.STRING },
      },
      required: ['targetRoom', 'steps', 'diyPurifierTip', 'estimatedAqiDrop'],
    },
    communityImpactNote: { type: Type.STRING },
  },
  required: [
    'oneThingToDo',
    'urgentActions',
    'swaps',
    'timeline',
    'roomShield',
    'communityImpactNote',
  ],
};

export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    return;
  }

  let body = req.body;
  if (!body && typeof req.read === 'function') {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf8');
      body = JSON.parse(raw);
    } catch {
      res.status(400).json({ error: 'Invalid JSON request body.' });
      return;
    }
  }

  if (typeof body !== 'object' || body === null) {
    res.status(400).json({ error: 'Request body must be an object.' });
    return;
  }

  const payload = body as Record<string, unknown>;
  const action = payload.action;

  const ai = new GoogleGenAI({ apiKey });

  if (action === 'askVayu') {
    const rawQuestion = payload.question;
    if (typeof rawQuestion !== 'string' || !rawQuestion.trim()) {
      res.status(400).json({ error: 'Question is required.' });
      return;
    }
    const question = rawQuestion.trim().slice(0, MAX_QUESTION_LENGTH);
    const prompt = typeof payload.prompt === 'string' ? payload.prompt : question;
    const systemInstruction =
      typeof payload.systemInstruction === 'string' ? payload.systemInstruction : undefined;

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });
      res.status(200).json({ reply: response.text?.trim() ?? '' });
      return;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gemini consultation failed';
      res.status(500).json({ error: msg });
      return;
    }
  }

  if (action === 'generatePlan') {
    const prompt = payload.prompt;
    if (typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    // Sanitize custom condition if present
    if (
      typeof payload.customCondition === 'string' &&
      payload.customCondition.length > MAX_CONDITION_LENGTH
    ) {
      res
        .status(400)
        .json({ error: `Custom condition exceeds ${MAX_CONDITION_LENGTH} characters.` });
      return;
    }

    const systemInstruction =
      typeof payload.systemInstruction === 'string' ? payload.systemInstruction : undefined;

    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: ActionPlanResponseSchema,
          temperature: 0.2,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        res.status(502).json({ error: 'Empty response received from Gemini.' });
        return;
      }

      res.status(200).json({ plan: JSON.parse(responseText) });
      return;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Plan generation failed';
      res.status(500).json({ error: msg });
      return;
    }
  }

  res.status(400).json({ error: `Unsupported action: ${String(action)}` });
}
