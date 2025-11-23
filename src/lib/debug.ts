// lib/debug.js
"use client";
export async function debugApiCall() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  console.log('🔍 DEBUG - API_URL:', API_URL);
  
  try {
    const testUrl = `${API_URL}/health-check`; // hoặc endpoint đơn giản
    console.log('🔍 DEBUG - Testing URL:', testUrl);
    
    const response = await fetch(testUrl);
    const text = await response.text();
    
    console.log('🔍 DEBUG - Response status:', response.status);
    console.log('🔍 DEBUG - Response headers:', Object.fromEntries(response.headers));
    console.log('🔍 DEBUG - First 500 chars of response:', text.substring(0, 500));
    
    // Thử parse JSON
    try {
      const json = JSON.parse(text);
      console.log('🔍 DEBUG - JSON parse success:', json);
      return json;
    } catch (e) {
      // Fix type cho error
      const error = e as Error;
      console.error('🔍 DEBUG - JSON parse failed. Response is HTML:', error.message);
      return { error: 'HTML response received', html: text.substring(0, 200) };
    }
  } catch (error) {
    // Fix type cho error
    const err = error as Error;
    console.error('🔍 DEBUG - Fetch error:', err);
    return { error: err.message };
  }
}