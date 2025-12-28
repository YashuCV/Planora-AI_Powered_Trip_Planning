import db from '../config/database.js';
import axios from 'axios';

// Generate UUID v4 helper
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const getItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // First verify the trip belongs to the user
    const tripResult = await db.query(
      'SELECT id FROM trips WHERE id = $1 AND user_id = $2',
      [tripId, userId]
    );

    if (tripResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Get the itinerary
    const result = await db.query(
      'SELECT * FROM itineraries WHERE trip_id = $1 ORDER BY version DESC LIMIT 1',
      [tripId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    const itinerary = result.rows[0];
    
    // Parse JSONB fields
    itinerary.items = itinerary.items || [];
    itinerary.aiSuggestions = itinerary.aiSuggestions || {};

    res.json(itinerary);
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
};

export const generateItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Verify trip belongs to user and get trip data
    const tripResult = await db.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [tripId, userId]
    );

    if (tripResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const trip = tripResult.rows[0];
    const destinations = trip.destinations || [];
    const destination = Array.isArray(destinations) && destinations.length > 0 
      ? (typeof destinations[0] === 'string' ? destinations[0] : destinations[0]?.name || destinations[0])
      : trip.original_request || 'the destination specified';
    // Use the exact duration from the trip - parse as integer, default to 3 only if not specified
    let duration = 3;
    if (trip.duration_days !== null && trip.duration_days !== undefined) {
      if (typeof trip.duration_days === 'number') {
        duration = trip.duration_days;
      } else {
        duration = parseInt(trip.duration_days, 10);
      }
    }
    
    if (isNaN(duration) || duration < 1) {
      console.warn(`⚠️ Invalid duration: ${trip.duration_days}, defaulting to 3`);
      duration = 3;
    }
    
    // Log for debugging
    console.log('📅 Itinerary generation - Duration:', {
      tripId: tripId,
      duration_days_from_db: trip.duration_days,
      type: typeof trip.duration_days,
      final_duration: duration,
      original_request: trip.original_request
    });
    const travelersCount = trip.travelers_count || 2;

    // Check if Groq API key is configured
    const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.GROK_API_KEY; // Support both for backward compatibility
    const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';

    if (!GROQ_API_KEY) {
      return res.status(500).json({ 
        error: 'Groq API key not configured. Please set GROQ_API_KEY in .env file' 
      });
    }

    // Build the AI prompt
    const systemPrompt = `You are an expert travel itinerary planner. You MUST respond with ONLY valid JSON. No explanations, no text before or after the JSON.

🚨 CRITICAL RULES:
1. Respond with ONLY valid JSON - no text before or after
2. You MUST use the EXACT destination provided - do NOT default to any other city
3. 🚨🚨🚨 YOU MUST generate EXACTLY ${duration} day(s) - NOT 3 days, NOT 2 days, NOT 5 days - EXACTLY ${duration} day(s). If you generate any other number, the response will be REJECTED! 🚨🚨🚨
4. NEVER use generic titles like 'Morning Activity', 'Afternoon Exploration', 'Lunch', or 'Dinner'
5. ALWAYS use SPECIFIC place names, landmarks, museums, parks, restaurants FROM THE DESTINATION CITY/COUNTRY PROVIDED
6. For meals: Include restaurant name (e.g., 'Lunch at [Restaurant Name]')
7. For activities: Include attraction name (e.g., 'Visit [Museum Name]', 'Explore [Park Name]')
8. GROUP ACTIVITIES BY LOCATION: Activities in the same area/neighborhood should be on the same day
9. MINIMUM 6-8 activities per day (not just 4) - include breakfast, lunch, dinner, and multiple attractions
10. Organize by proximity: If visiting X area, include nearby restaurants and attractions in that same area

REQUIRED JSON FORMAT:
{
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "theme": "Area/Neighborhood name (e.g., 'Downtown District', 'Historic Quarter')",
      "items": [
        {
          "time": "08:00",
          "type": "meal",
          "title": "Breakfast at [RESTAURANT NAME]",
          "description": "Detailed description",
          "location": "Full address in the destination city",
          "duration": 60,
          "price": 15,
          "bookingRequired": false
        },
        {
          "time": "09:30",
          "type": "activity",
          "title": "Visit [SPECIFIC ATTRACTION NAME]",
          "description": "Detailed description",
          "location": "Full address in the destination city",
          "duration": 120,
          "price": 25,
          "bookingRequired": true
        }
      ]
    }
  ]
}

🚨🚨🚨 YOU MUST generate EXACTLY ${duration} day(s) in the "days" array - NOT 3, NOT 2, NOT 5 - EXACTLY ${duration}. Each day must have 6-8 items minimum (breakfast, activities, lunch, more activities, dinner, evening activities). Group activities by location/proximity. If you generate ${duration !== 3 ? '3' : 'a different number of'} days, the response will be REJECTED!

🚫 FORBIDDEN:
- 'Morning Activity', 'Afternoon Exploration', 'Lunch', 'Dinner' (use specific restaurant/place names)
- Any text before or after the JSON
- Explanations or conversational text
- Using wrong city attractions (e.g., Paris attractions for Miami trip)
- Empty days array
- Less than ${duration} days
- More than ${duration} days

Respond with ONLY the JSON object, nothing else.`;

    const userPrompt = `Create a DETAILED, SPECIFIC itinerary for this trip with REAL locations and attractions.

🚨🚨🚨 MOST IMPORTANT: THE DESTINATION IS: ${JSON.stringify(destinations)} 🚨🚨🚨

YOU MUST CREATE AN ITINERARY FOR: ${destination}

DO NOT use any default city - use ONLY the destination provided above!

TRIP DETAILS:
DESTINATION: ${JSON.stringify(destinations)} ⬅️ THIS IS THE MOST IMPORTANT FIELD!
Duration: ${duration} days
Start Date: ${trip.start_date || 'Not specified'}
End Date: ${trip.end_date || 'Not specified'}
Travelers: ${travelersCount} people
Interests: ${JSON.stringify(trip.preferences?.interests || [])}
Accommodation: ${trip.preferences?.accommodationType || 'mid-range'}
Travel Style: ${trip.preferences?.travelStyle || 'moderate'}
Original Request: ${trip.original_request || ''}

🚨 CRITICAL INSTRUCTIONS:
1. Look at the DESTINATION field above - that is where the trip is going!
2. Research REAL attractions, museums, parks, restaurants, and landmarks FOR THAT SPECIFIC DESTINATION
3. Generate EXACTLY ${duration} day(s) - NOT 3 days, NOT any other number - EXACTLY ${duration} days
4. Each day should have 6-8 items minimum: breakfast, morning activity, lunch, afternoon activity, another activity, dinner, evening activity
5. GROUP BY LOCATION: Organize activities by area/neighborhood
   - Day 1: Focus on one area (e.g., Downtown) - visit attractions there, dine at nearby restaurants
   - Day 2: Focus on another area (e.g., Historic Quarter) - visit attractions there, dine at nearby restaurants
   - Continue this pattern for all ${duration} days
6. DO NOT default to any other city - use the destination provided!
7. If visiting X place, include nearby restaurants and attractions in that same area on the same day

For EACH activity, you MUST:
- Use the ACTUAL name of a real place in THE DESTINATION CITY/COUNTRY
- Include the full name (e.g., 'Visit Senso-ji Temple' for Tokyo, NOT 'Visit The Louvre')
- For meals: 'Breakfast at [Restaurant Name]', 'Lunch at [Restaurant Name]', 'Dinner at [Restaurant Name]' - use REAL restaurant names
- For activities: 'Visit [Attraction Name]', 'Explore [Park Name]', 'Tour [Museum Name]' - use REAL attraction names
- Location must be in the destination city/country
- Group nearby locations together on the same day

🚨 FINAL INSTRUCTION: You MUST generate EXACTLY ${duration} day(s) in the "days" array. Each day must have 6-8 items minimum. Group activities by location/proximity. DO NOT return {"days":[]} - that is invalid! DO NOT default to 3 days - use ${duration} days!`;

    // Call Groq API
    try {
      const groqResponse = await axios.post(
        GROQ_API_URL,
        {
          model: 'llama-3.3-70b-versatile', // Groq model (updated from decommissioned llama-3.1-70b-versatile)
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 6000
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract content from Groq response
      const content = groqResponse.data.choices?.[0]?.message?.content || 
                     groqResponse.data.content ||
                     '';

      if (!content) {
        throw new Error('No content in Groq API response');
      }

      // Parse JSON response
      let cleanContent = content.trim();
      
      // Remove markdown code blocks if present
      cleanContent = cleanContent.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
      
      // Find first { and extract JSON
      const firstBrace = cleanContent.indexOf('{');
      if (firstBrace > 0) {
        cleanContent = cleanContent.substring(firstBrace);
      }

      // Extract JSON object (find matching braces)
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

      // Parse JSON
      let itineraryData;
      try {
        itineraryData = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError.message);
        console.error('Content:', cleanContent.substring(0, 500));
        throw new Error(`Failed to parse AI response: ${parseError.message}`);
      }

      // Check for error in response
      if (itineraryData.error) {
        throw new Error(`AI Error: ${itineraryData.error}`);
      }

      // Validate structure
      if (!itineraryData.days || !Array.isArray(itineraryData.days)) {
        throw new Error('Invalid itinerary structure: missing days array');
      }

      if (itineraryData.days.length === 0) {
        throw new Error(`AI returned an empty days array. Destination: ${destination}, Duration: ${duration} days`);
      }
      
      // Validate that the number of days matches the requested duration
      if (itineraryData.days.length !== duration) {
        console.error(`❌ DURATION MISMATCH: Requested ${duration} days, but AI generated ${itineraryData.days.length} days`);
        console.error(`   Trip ID: ${tripId}, Destination: ${destination}`);
        throw new Error(`AI generated ${itineraryData.days.length} days but ${duration} days were requested. Please regenerate with exactly ${duration} days.`);
      }
      
      console.log(`✅ Duration validated: ${itineraryData.days.length} days generated (requested: ${duration} days)`);

      // Validate items are specific (not generic)
      const exactGenericTitles = ['Morning Activity', 'Afternoon Exploration', 'Lunch', 'Dinner', 'Breakfast'];
      let genericItems = [];

      itineraryData.days.forEach(day => {
        if (day.items && Array.isArray(day.items)) {
          day.items.forEach(item => {
            if (!item.title) {
              genericItems.push({ day: day.dayNumber, title: '(no title)' });
              return;
            }
            
            const titleLower = item.title.toLowerCase().trim();
            const isExactGeneric = exactGenericTitles.some(generic => titleLower === generic.toLowerCase());
            const hasSpecificLocation = titleLower.includes(' at ') || 
                                       titleLower.includes('visit ') || 
                                       titleLower.includes('explore ') ||
                                       titleLower.startsWith('visit ') ||
                                       titleLower.startsWith('explore ');
            
            if (isExactGeneric && !hasSpecificLocation) {
              genericItems.push({ day: day.dayNumber, title: item.title });
            }
          });
        }
      });

      if (genericItems.length > 0) {
        console.warn('Generic items found:', genericItems);
        // Don't throw error, just log warning
      }

      // Flatten items and add IDs
      let itemId = 1;
      const allItems = [];

      itineraryData.days.forEach(day => {
        if (day.items && Array.isArray(day.items)) {
          day.items.forEach(item => {
            allItems.push({
              id: `item-${tripId}-${itemId++}`,
              dayNumber: day.dayNumber,
              time: item.time || '09:00',
              type: item.type || 'activity',
              title: item.title || 'Activity',
              description: item.description || '',
              location: item.location || '',
              duration: item.duration || 120,
              price: item.price !== undefined ? item.price : null,
              bookingRequired: item.bookingRequired || false,
              bookingStatus: item.bookingRequired ? 'pending' : null
            });
          });
        }
      });

      // Calculate total estimated cost
      const totalCost = allItems.reduce((sum, item) => sum + (item.price || 0), 0) * travelersCount;

      // Generate itinerary ID
      const itineraryId = generateUUID();

      // Save to database
      await db.query(
        `INSERT INTO itineraries (id, trip_id, version, status, items, total_cost)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6)
         RETURNING *`,
        [
          itineraryId,
          tripId,
          1,
          'draft',
          JSON.stringify(allItems),
          totalCost
        ]
      );

      // Return the itinerary
      const result = await db.query(
        'SELECT * FROM itineraries WHERE id = $1',
        [itineraryId]
      );

      const itinerary = result.rows[0];
      itinerary.items = itinerary.items || [];

      res.json({
        success: true,
        itinerary: itinerary
      });

    } catch (groqError) {
      console.error('Groq API Error:', groqError.response?.data || groqError.message);
      
      if (groqError.response?.status === 401) {
        return res.status(500).json({ 
          error: 'Invalid Groq API key. Please check GROQ_API_KEY in .env file' 
        });
      }
      
      return res.status(500).json({ 
        error: `Failed to generate itinerary: ${groqError.message}` 
      });
    }

  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
};
