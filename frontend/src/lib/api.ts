/**
 * Robust fetch utility that ensures JSON is parsed ONLY when the response Content-Type is application/json
 * and the response body is valid JSON, preventing "Unexpected token '<'..." exceptions gracefully.
 */

export async function safeFetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    // If response is not ok, handle both JSON error bodies and fallback HTML bodies
    if (isJson) {
      try {
        const errorData = await response.json();
        throw new Error(errorData?.error || errorData?.message || `HTTP error! Status: ${response.status}`);
      } catch (e: any) {
        throw new Error(e.message || `HTTP error! Status: ${response.status}`);
      }
    } else {
      const text = await response.text();
      const trimmedText = text.trim();
      if (
        trimmedText.startsWith('<!DOCTYPE') || 
        trimmedText.startsWith('<!doctype') || 
        trimmedText.includes('<html') || 
        trimmedText.includes('<head')
      ) {
        throw new Error(`The requested endpoint returned HTML (index fallback) instead of JSON. This suggests a misconfigured endpoint or a server-side route error. (Status: ${response.status})`);
      }
      throw new Error(text || `HTTP error! Status: ${response.status}`);
    }
  }

  if (!isJson) {
    const text = await response.text();
    const trimmedText = text.trim();
    if (
      trimmedText.startsWith('<!DOCTYPE') || 
      trimmedText.startsWith('<!doctype') || 
      trimmedText.includes('<html') || 
      trimmedText.includes('<head')
    ) {
      throw new Error(`The requested endpoint returned an HTML page (index fallback) instead of valid JSON data. Please verify the endpoint URL: ${url}`);
    }
    throw new Error(`Expected application/json response from ${url} but received Content-Type: "${contentType || 'unknown'}"`);
  }

  try {
    const text = await response.text();
    // Validate that the string looks like JSON before parsing
    const trimmedText = text.trim();
    if (!trimmedText) {
      throw new Error('Received an empty response from the server.');
    }
    if (
      (trimmedText.startsWith('{') && trimmedText.endsWith('}')) ||
      (trimmedText.startsWith('[') && trimmedText.endsWith(']'))
    ) {
      return JSON.parse(trimmedText) as T;
    } else {
      if (trimmedText.startsWith('<!doctype') || trimmedText.startsWith('<!DOCTYPE') || trimmedText.includes('<html')) {
        throw new Error(`The requested endpoint returned an HTML document (index fallback) instead of JSON. Please verify the API endpoint is correct.`);
      }
      throw new Error('Received a non-JSON formatted response from the server.');
    }
  } catch (err: any) {
    throw new Error(`Failed to parse response as JSON: ${err.message}`);
  }
}
