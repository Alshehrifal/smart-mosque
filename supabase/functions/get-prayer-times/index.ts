import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlAdhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface AlAdhanResponse {
  code: number;
  status: string;
  data: {
    timings: AlAdhanTimings;
    date: {
      readable: string;
      timestamp: string;
      hijri: {
        date: string;
        day: string;
        month: { number: number; en: string; ar: string };
        year: string;
      };
      gregorian: {
        date: string;
        day: string;
        month: { number: number; en: string };
        year: string;
      };
    };
    meta: {
      timezone: string;
      method: { id: number; name: string };
    };
  };
}

// Simple in-memory cache
let cachedData: { date: string; data: AlAdhanResponse['data'] } | null = null;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const city = url.searchParams.get('city') || 'Jeddah';
    const country = url.searchParams.get('country') || 'Saudi Arabia';
    const method = url.searchParams.get('method') || '4'; // Umm Al-Qura
    const school = url.searchParams.get('school') || '0'; // Shafi
    const dateParam = url.searchParams.get('date'); // Optional: DD-MM-YYYY format
    
    // Get today's date in DD-MM-YYYY format
    const today = new Date();
    const todayStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
    const requestDate = dateParam || todayStr;
    
    // Check cache (only for today's date with default city)
    const cacheKey = `${city}-${country}-${method}-${requestDate}`;
    if (cachedData && cachedData.date === cacheKey) {
      console.log('Returning cached prayer times for:', cacheKey);
      return new Response(JSON.stringify({
        success: true,
        cached: true,
        data: cachedData.data,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Fetch from AlAdhan API
    const apiUrl = `https://api.aladhan.com/v1/timingsByCity/${requestDate}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}&school=${school}`;
    
    console.log('Fetching prayer times from AlAdhan API:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`AlAdhan API error: ${response.status} ${response.statusText}`);
    }
    
    const result: AlAdhanResponse = await response.json();
    
    if (result.code !== 200) {
      throw new Error(`AlAdhan API returned error: ${result.status}`);
    }
    
    // Cache the result
    cachedData = {
      date: cacheKey,
      data: result.data,
    };
    
    console.log('Prayer times fetched successfully:', {
      city,
      country,
      method,
      date: requestDate,
      timezone: result.data.meta.timezone,
      timings: result.data.timings,
    });
    
    return new Response(JSON.stringify({
      success: true,
      cached: false,
      data: result.data,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching prayer times:', errorMessage);
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
