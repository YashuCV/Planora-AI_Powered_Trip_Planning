import db from '../config/database.js';
import axios from 'axios';
import { generateItinerary } from './itineraryController.js';

// Generate UUID v4 helper
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const getTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      console.error('No user ID in request:', req.user);
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await db.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const trip = result.rows[0];
    
    // Parse JSONB fields
    trip.destinations = trip.destinations || [];
    trip.preferences = trip.preferences || {};

    res.json(trip);
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
};

export const getTrips = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await db.query(
      'SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const trips = result.rows.map(trip => ({
      ...trip,
      destinations: trip.destinations || [],
      preferences: trip.preferences || {},
    }));

    res.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
};

export const createTrip = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { request, preferences } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!request || !request.trim()) {
      return res.status(400).json({ error: 'Trip request is required' });
    }

    // Check if Groq API key is configured
    const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.GROK_API_KEY; // Support both for backward compatibility
    const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';

    if (!GROQ_API_KEY) {
      return res.status(500).json({ 
        error: 'Groq API key not configured. Please set GROQ_API_KEY in .env file' 
      });
    }

    // Parse trip request using Grok API
    const parsePrompt = `You are a travel planning assistant. Parse the user's trip request and extract structured information.

Extract the following details from the request:
- destinations (array of cities/countries)
- start_date (ISO format if mentioned)
- end_date (ISO format if mentioned)
- duration_days (number)
- travelers_count (number)
- budget_range (object with min/max)
- interests (array of keywords like 'food', 'culture', 'adventure', etc.)
- accommodation_preference (budget/mid-range/luxury)
- special_requirements (any specific needs mentioned)

Respond ONLY with a valid JSON object containing these fields. If a field is not mentioned, use null.

Example response:
{
  "destinations": ["Tokyo"],
  "duration_days": 5,
  "travelers_count": 2,
  "interests": ["food", "culture"],
  "accommodation_preference": "mid-range"
}`;

    let parsedData;
    try {
      const groqResponse = await axios.post(
        GROQ_API_URL,
        {
          model: 'llama-3.3-70b-versatile', // Groq model (updated from decommissioned llama-3.1-70b-versatile)
          messages: [
            { role: 'system', content: parsePrompt },
            { role: 'user', content: request }
          ],
          temperature: 0.3,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = groqResponse.data.choices?.[0]?.message?.content || 
                     groqResponse.data.content ||
                     '';

      if (!content) {
        throw new Error('No content in Grok API response');
      }

      // Parse JSON response
      let cleanContent = content.trim();
      cleanContent = cleanContent.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
      
      // Find first { and extract JSON
      const firstBrace = cleanContent.indexOf('{');
      if (firstBrace > 0) {
        cleanContent = cleanContent.substring(firstBrace);
      }

      // Extract JSON object
      let braceCount = 0;
      let jsonStart = -1;
      let jsonEnd = -1;
      
      for (let i = 0; i < cleanContent.length; i++) {
        if (cleanContent[i] === '{') {
          if (jsonStart === -1) jsonStart = i;
          braceCount++;
        } else if (cleanContent[i] === '}') {
          braceCount--;
          if (braceCount === 0 && jsonStart !== -1) {
            jsonEnd = i + 1;
            break;
          }
        }
      }
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanContent = cleanContent.substring(jsonStart, jsonEnd);
      }

      // Fix trailing commas
      cleanContent = cleanContent.replace(/,(\\s*[}\\]])/g, '$1');

      try {
        parsedData = JSON.parse(cleanContent);
      } catch (parseErr) {
        console.error('JSON parse error:', parseErr.message);
        console.error('Content that failed to parse:', cleanContent.substring(0, 500));
        // Fallback: try to extract basic info from request
        // Better duration extraction - look for patterns like "4 day", "5 days", "2-day", etc.
        const durationMatch = cleanContent.match(/(\d+)\s*-?\s*(?:day|days?)/i) || request.match(/(\d+)\s*-?\s*(?:day|days?)/i);
        const extractedDuration = durationMatch ? parseInt(durationMatch[1], 10) : null;
        
        parsedData = {
          destinations: request.match(/\b(?:to|in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi)?.map(m => m.replace(/^(?:to|in|at)\s+/i, '')) || [],
          duration_days: extractedDuration,
          travelers_count: request.match(/(\d+)\s*(?:person|people|traveler|travelers)/i)?.[1] || null,
        };
        console.log('Using fallback parsed data:', parsedData);
      }
    } catch (parseError) {
      console.error('Error calling Groq API:', parseError.message);
      console.error('Full error:', parseError);
      
      // If Groq API fails, still create trip with basic info
      console.log('Falling back to basic trip creation without AI parsing');
        // Better duration extraction - look for patterns like "4 day", "5 days", "2-day", etc.
        const durationMatch = request.match(/(\d+)\s*-?\s*(?:day|days?)/i);
        const extractedDuration = durationMatch ? parseInt(durationMatch[1], 10) : null;
        
        parsedData = {
          destinations: request.match(/\b(?:to|in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi)?.map(m => m.replace(/^(?:to|in|at)\s+/i, '')) || ['Unknown'],
          duration_days: extractedDuration || request.match(/(\d+)\s*(?:day|days)/i)?.[1] || 3,
          travelers_count: request.match(/(\d+)\s*(?:person|people|traveler|travelers)/i)?.[1] || 1,
        };
      console.log('Using fallback parsed data:', parsedData);
    }

    // Generate trip ID
    const tripId = generateUUID();

    // Generate title from destinations or request
    const title = parsedData.destinations?.length > 0 
      ? `${parsedData.destinations[0]} Trip`
      : 'New Trip';

    // Merge parsed data with user preferences
    // Ensure duration is properly parsed - try multiple sources
    let durationDays = null;
    
    // First, try from parsed AI response
    if (parsedData.duration_days) {
      if (typeof parsedData.duration_days === 'number') {
        durationDays = parsedData.duration_days;
      } else if (typeof parsedData.duration_days === 'string') {
        durationDays = parseInt(parsedData.duration_days, 10);
      }
    }
    
    // If still null, extract directly from request using regex
    if (!durationDays || isNaN(durationDays)) {
      const durationMatch = request.match(/(\d+)\s*-?\s*(?:day|days?)/i);
      if (durationMatch) {
        durationDays = parseInt(durationMatch[1], 10);
        console.log('📅 Extracted duration from request:', durationDays);
      }
    }
    
    // Log for debugging
    console.log('📅 Duration parsing:', {
      originalRequest: request,
      parsedDuration: parsedData.duration_days,
      extractedFromRequest: durationDays,
      finalDuration: durationDays,
      type: typeof parsedData.duration_days
    });
    
    const tripData = {
      id: tripId,
      userId: userId,
      title: title,
      originalRequest: request,
      destinations: parsedData.destinations || [],
      startDate: parsedData.start_date || null,
      endDate: parsedData.end_date || null,
      durationDays: durationDays,
      travelersCount: parsedData.travelers_count || preferences?.travelersCount || 1,
      budgetRange: parsedData.budget_range || preferences?.budget || null,
      interests: [...(parsedData.interests || []), ...(preferences?.interests || [])],
      accommodationPreference: parsedData.accommodation_preference || preferences?.accommodationType || 'mid-range',
      travelStyle: preferences?.travelStyle || 'moderate',
      specialRequirements: parsedData.special_requirements || null,
      status: 'planning'
    };

    // Save trip to database
    await db.query(
      `INSERT INTO trips (id, user_id, title, description, original_request, status, start_date, end_date, duration_days, travelers_count, destinations, preferences)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12::jsonb)
       RETURNING *`,
      [
        tripData.id,
        tripData.userId,
        tripData.title,
        tripData.title, // description same as title for now
        tripData.originalRequest,
        tripData.status,
        tripData.startDate,
        tripData.endDate,
        tripData.durationDays || null, // Save duration_days to database
        tripData.travelersCount,
        JSON.stringify(tripData.destinations),
        JSON.stringify({
          interests: tripData.interests,
          accommodationType: tripData.accommodationPreference,
          travelStyle: tripData.travelStyle,
          budget: tripData.budgetRange
        })
      ]
    );

    // Generate AI response message
    let aiMessage = `Great! I've analyzed your trip request for ${tripData.destinations[0] || 'your destination'}. `;
    aiMessage += `I'm creating a detailed ${tripData.durationDays || 3}-day itinerary with specific attractions, restaurants, and activities. `;
    aiMessage += `I'll help you with flights, hotels, and activity bookings.`;

    const suggestions = [
      `Consider visiting during ${tripData.destinations[0] ? tripData.destinations[0] + "'s" : 'the destination\'s'} best season`,
      'Book accommodations in central locations for easy access to attractions',
      'Try local cuisine at highly-rated restaurants',
      'Purchase attraction tickets in advance to avoid queues',
      'Consider travel insurance for peace of mind'
    ];

    // Trigger itinerary generation (async, don't wait)
    // Call the function directly instead of HTTP call
    setImmediate(async () => {
      try {
        const mockReq = {
          params: { tripId },
          user: { userId },
          headers: req.headers
        };
        const mockRes = {
          json: (data) => {
            console.log('✅ Itinerary generated successfully for trip:', tripId);
            if (data.itinerary) {
              console.log('   Itinerary ID:', data.itinerary.id);
            }
          },
          status: (code) => ({ 
            json: (data) => {
              console.error(`❌ Itinerary generation error (${code}):`, data);
            }
          })
        };
        
        await generateItinerary(mockReq, mockRes);
      } catch (err) {
        console.error('Error generating itinerary:', err.message);
        console.error('Stack:', err.stack);
      }
    });

    // Return response
    res.json({
      success: true,
      tripId: tripId,
      message: aiMessage,
      suggestions: suggestions.slice(0, 3),
      tripData: tripData
    });

  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ 
      error: 'Failed to create trip',
      message: error.message 
    });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // First verify the trip belongs to the user
    const tripResult = await db.query(
      'SELECT id FROM trips WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (tripResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Delete associated itineraries first (cascade delete)
    await db.query('DELETE FROM itineraries WHERE trip_id = $1', [id]);

    // Delete the trip
    await db.query('DELETE FROM trips WHERE id = $1', [id]);

    res.json({ 
      success: true,
      message: 'Trip deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
};
