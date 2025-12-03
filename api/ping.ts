export const config = {
  runtime: 'edge',
};

export default function handler(): Response {
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: Date.now(),
      region: process.env.VERCEL_REGION || 'local',
      version: '1.0.0',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
}
