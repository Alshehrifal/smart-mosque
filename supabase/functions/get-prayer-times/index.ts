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

interface DayData {
  timings: AlAdhanTimings;
  date: AlAdhanResponse['data']['date'];
}

// Format date to DD-MM-YYYY in a specific timezone
function formatDateInTimezone(date: Date, timezone: string): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(date);
  const day = parts.find(p => p.type === 'day')?.value || '01';
  const month = parts.find(p => p.type === 'month')?.value || '01';
  const year = parts.find(p => p.type === 'year')?.value || '2026';
  return `${day}-${month}-${year}`;
}

// Fetch prayer times for a single day
async function fetchDayPrayerTimes(
  date: string,
  city: string,
  country: string,
  method: string,
  school: string
): Promise<DayData> {
  const apiUrl = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}&school=${school}`;
  
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    throw new Error(`AlAdhan API error: ${response.status} ${response.statusText}`);
  }
  
  const result: AlAdhanResponse = await response.json();
  
  if (result.code !== 200) {
    throw new Error(`AlAdhan API returned error: ${result.status}`);
  }
  
  return {
    timings: result.data.timings,
    date: result.data.date,
  };
}

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
    const days = parseInt(url.searchParams.get('days') || '7', 10); // Default 7 days
    
    // Get dates for the next N days (starting from today in Jeddah timezone)
    const timezone = 'Asia/Riyadh'; // Saudi Arabia timezone
    const dates: string[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(formatDateInTimezone(date, timezone));
    }
    
    console.log(`Fetching prayer times for ${days} days:`, dates);
    
    // Fetch all days in parallel
    const results = await Promise.all(
      dates.map(date => fetchDayPrayerTimes(date, city, country, method, school))
    );
    
    // Create a map of date -> data
    const prayerTimesMap: Record<string, DayData> = {};
    results.forEach((data, index) => {
      prayerTimesMap[dates[index]] = data;
    });
    
    console.log('Prayer times fetched successfully for dates:', Object.keys(prayerTimesMap));
    
    return new Response(JSON.stringify({
      success: true,
      data: prayerTimesMap,
      dates: dates,
      firstDay: results[0], // For backward compatibility
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
