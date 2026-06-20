import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { geocodeAddress } from './geocode.js';

describe('geocodeAddress', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    mock.method(console, 'error', () => {});
  });

  afterEach(() => {
    global.fetch = originalFetch;
    mock.restoreAll();
  });

  it('should return null for empty or invalid addresses', async () => {
    assert.equal(await geocodeAddress(null), null);
    assert.equal(await geocodeAddress(''), null);
    assert.equal(await geocodeAddress('   '), null);
    assert.equal(await geocodeAddress('not specified'), null);
    assert.equal(await geocodeAddress('Not Specified'), null);
  });

  it('should return lat and lng for a valid address', async () => {
    const mockResponse = [{ lat: '40.7128', lon: '-74.0060' }];
    global.fetch = mock.fn(async () => {
      return {
        json: async () => mockResponse
      };
    });

    const result = await geocodeAddress('New York');
    assert.deepEqual(result, { lat: 40.7128, lng: -74.0060 });

    assert.equal(global.fetch.mock.calls.length, 1);
    const [url, options] = global.fetch.mock.calls[0].arguments;
    assert.ok(url.includes('q=New+York'));
    assert.ok(url.includes('format=json'));
    assert.ok(url.includes('limit=1'));
    assert.equal(options.headers['User-Agent'], 'BrickOurHouseApp/1.0');
  });

  it('should return null when no results are found', async () => {
    global.fetch = mock.fn(async () => {
      return {
        json: async () => []
      };
    });

    const result = await geocodeAddress('Nonexistent Place 123');
    assert.equal(result, null);
  });

  it('should catch errors and return null', async () => {
    global.fetch = mock.fn(async () => {
      throw new Error('Network error');
    });

    const result = await geocodeAddress('Error Place');
    assert.equal(result, null);

    assert.equal(console.error.mock.calls.length, 1);
    assert.equal(console.error.mock.calls[0].arguments[0], 'Geocoding error:');
    assert.equal(console.error.mock.calls[0].arguments[1], 'Network error');
  });
});
