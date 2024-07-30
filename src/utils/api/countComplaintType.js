export const countComplaintType = (data) => {
    let noiseCount = 0, rodentCount = 0, waterCount = 0, parkingCount = 0, othersCount = 0;
    data.forEach(entry => {
      const complaintType = entry.complaint_type.toLowerCase();
      console.log("complaint type: ", complaintType);
  
      if (complaintType.includes('noise')) {
        noiseCount++;
      } else if (complaintType.includes('rodent')) {
        rodentCount++;
      } else if (complaintType.includes('water')) {
        waterCount++;
      } else if (complaintType.includes('parking')) {
        parkingCount++;
      }
      else {
        othersCount++;
      }
    });
  
    return {
      noiseCount: noiseCount,
      rodentCount: rodentCount,
      waterCount: waterCount,
      parkingCount: parkingCount,
      othersCount: othersCount
  };
  }