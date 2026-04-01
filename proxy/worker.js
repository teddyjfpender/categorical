/**
 * Cloudflare Worker — CORS proxy for the Haskell Playground API.
 *
 * Deploy with: npx wrangler deploy proxy/worker.js --name categorical-proxy
 *
 * This adds CORS headers so the static site at GitHub Pages can
 * call play.haskell.org/submit from the browser.
 */

const PLAYGROUND_URL = 'https://play.haskell.org/submit';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    try {
      const body = await request.text();

      const response = await fetch(PLAYGROUND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const data = await response.text();

      return new Response(data, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      });
    } catch (e) {
      return new Response(JSON.stringify({ err: e.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
  },
};
