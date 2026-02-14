export const Client = jest.fn().mockImplementation(() => ({
  elevation: jest.fn().mockResolvedValue({ data: { results: [] } }),
  timezone: jest.fn().mockResolvedValue({ data: { timeZoneId: 'UTC' } }),
  geolocate: jest.fn().mockResolvedValue({ data: { location: { lat: 0, lng: 0 } } }),
  reverseGeocode: jest.fn().mockResolvedValue({ data: { results: [] } }),
  placeDetails: jest.fn().mockResolvedValue({ data: { result: {} } }),
}));
