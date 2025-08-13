/* eslint-env node */
/* global process */
import fetch from 'node-fetch';

export const schema = {
  name: 'searchNearby',
  description: 'Busca negocios cercanos usando Google Places API.',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      lat: { type: 'number' },
      lng: { type: 'number' },
      radius: { type: 'number' },
    },
    required: ['query'],
  },
};

export async function run({ query, lat = -34.6037, lng = -58.3816, radius = 1500 }) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query
  )}&location=${lat},${lng}&radius=${radius}&key=${key}`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.results || []).slice(0, 5).map((r) => ({
    name: r.name,
    address: r.formatted_address,
    rating: r.rating,
    placeId: r.place_id,
    mapUrl: `https://maps.google.com/?q=${encodeURIComponent(r.name)}&ll=${r.geometry.location.lat},${r.geometry.location.lng}`,
  }));
}

export default { schema, run };
