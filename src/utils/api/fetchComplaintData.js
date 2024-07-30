// const endpoint = 'https://data.cityofnewyork.us/resource/jrb2-thup.json?incident_address=';
export const endpoint = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=';

export default async function fetchComplaintData(address, zipcode) {
    try {
        const url = endpoint + encodeURIComponent(address) + "&incident_zip=" + zipcode;
        const response = await fetch(url);

        if (!response.ok) {
            console.log("NYC open data response was not ok");
            throw new Error('Network response was not ok');
        }

        console.log("4. NYC open data connection was ok, about to return json response");

        const data = await response.json();
        const complaintsCount = countComplaintType(data);
        // const simplifiedData = data.map(complaint => ({ descriptor: complaint.descriptor, date: complaint.created_date }));
        console.log("complaints data returned by fetchComplaintData: ", complaintsCount);
        return [complaintsCount, url];
    } catch (error) {
        console.error('There was a problem with fetching from NYC open data: ', error);
        return null; // or handle the error in a way appropriate for your application
    }
}

const countComplaintType = (data) => {
    let noiseCount = 0, rodentCount = 0, waterCount = 0, parkingCount = 0, hygieneCount = 0, othersCount = 0;
    data.forEach(entry => {
      const complaintType = entry.complaint_type.toLowerCase();
    //   console.log("complaint type: ", complaintType);
  
      if (complaintType.includes('noise')) {
        noiseCount++;
      } else if (complaintType.includes('rodent')) {
        rodentCount++;
      } else if (complaintType.includes('water')) {
        waterCount++;
      } else if (complaintType.includes('parking')) {
        parkingCount++; 
      } else if (['dirty', 'sewer', 'unsanitary'].some(substring => complaintType.includes(substring))) {
        hygieneCount++;
      } else {
        othersCount++;
      }
    });
  
    return {
      noiseCount: noiseCount,
      rodentCount: rodentCount,
      waterCount: waterCount,
      hygieneCount: hygieneCount,
      parkingCount: parkingCount,
      othersCount: othersCount
  };
  }