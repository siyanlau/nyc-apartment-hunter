const endpoint = 'https://data.cityofnewyork.us/resource/jrb2-thup.json?incident_address=';

async function fetchComplaintData(address) {
    try {
      const response = await fetch(endpoint + encodeURIComponent(address));
      if (!response.ok) {
        console.log("NYC open data response was not ok");
      }
      else {
        console.log("NYC open data connection was ok");
      }
      const data = await response.json();
      const simplifiedData = data.map(complaint => ({ descriptor: complaint.descriptor }));
      return simplifiedData;
      // need to do more parsing / cleaning here
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return null;
    }
  }