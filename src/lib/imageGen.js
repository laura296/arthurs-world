const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/images';

async function apiCall(url, body, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${res.status}`);
      }
      return await res.json();
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

/** Generate a single image and return as Blob */
export async function generateImage(prompt) {
  const data = await apiCall(`${API_URL}/generations`, {
    model: 'gpt-image-1',
    prompt,
    n: 1,
    size: '1536x1024',
    quality: 'high',
  });
  // gpt-image-1 returns b64_json by default
  const b64 = data.data[0].b64_json;
  if (b64) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: 'image/png' });
  }
  // Fallback: if URL returned, fetch it
  const url = data.data[0].url;
  if (url) {
    const imgRes = await fetch(url);
    return await imgRes.blob();
  }
  throw new Error('No image data in response');
}

/** Generate an image using a reference image (for character consistency) */
export async function generateWithReference(referenceBlob, prompt) {
  const formData = new FormData();
  formData.append('model', 'gpt-image-1');
  formData.append('image[]', referenceBlob, 'reference.png');
  formData.append('prompt', prompt);
  formData.append('size', '1536x1024');
  formData.append('quality', 'high');

  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
      const res = await fetch(`${API_URL}/edits`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_KEY}` },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${res.status}`);
      }
      const data = await res.json();
      const b64 = data.data[0].b64_json;
      if (b64) {
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new Blob([bytes], { type: 'image/png' });
      }
      const url = data.data[0].url;
      if (url) {
        const imgRes = await fetch(url);
        return await imgRes.blob();
      }
      throw new Error('No image data in response');
    } catch (e) {
      if (attempt === 1) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

/** Check if the API key is configured */
export function hasApiKey() {
  return !!API_KEY;
}
