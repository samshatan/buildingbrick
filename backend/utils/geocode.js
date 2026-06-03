

/**
 * Geocodes a text address into latitude and longitude using OpenStreetMap Nominatim API.
 * @param {string} address - The text address to geocode.
 * @returns {Promise<{lat: number, lng: number} | null>} - The coordinates or null if not found/error.
 */
export const geocodeAddress = async (address) => {
  if (!address || address.trim() === '' || address.toLowerCase() === 'not specified') {
    return null;
  }

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.append('q', address);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', '1');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'BrickOurHouseApp/1.0'
      }
    });

    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
};
