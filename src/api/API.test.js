const fetchComplaintData = require('./fetchComplaintData');

// Mock the fetch function globally
global.fetch = jest.fn();

describe('fetchComplaintData', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('should return simplified data on successful fetch', async () => {
        const mockData = [
            {
                "descriptor": "Smoking Violation"
            }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        const result = await fetchComplaintData('209 AVENUE P');
        expect(result).toEqual([{ "descriptor": "Smoking Violation" }]);
        expect(fetch).toHaveBeenCalledWith('https://data.cityofnewyork.us/resource/jrb2-thup.json?incident_address=209%20AVENUE%20P');
    });

    it('should handle non-200 responses', async () => {
        fetch.mockResolvedValueOnce({
            ok: false
        });

        const result = await fetchComplaintData('209 AVENUE P');
        expect(result).toBeNull();
        expect(fetch).toHaveBeenCalledWith('https://data.cityofnewyork.us/resource/jrb2-thup.json?incident_address=209%20AVENUE%20P');
    });

    it('should handle fetch errors', async () => {
        fetch.mockRejectedValueOnce(new Error('Network Error'));

        const result = await fetchComplaintData('209 AVENUE P');
        expect(result).toBeNull();
        expect(fetch).toHaveBeenCalledWith('https://data.cityofnewyork.us/resource/jrb2-thup.json?incident_address=209%20AVENUE%20P');
    });
});