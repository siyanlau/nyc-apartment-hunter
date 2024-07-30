# NYC Apartment Hunter
### Description
NYC Apartment Hunter is a Chrome extension that helps users gather and analyze information about various addresses in New York City. Users can add addresses to see complaints, ethnicity composition, and commute times to a specified destination.

### Features
- Add and view addresses along with associated complaints data and ethnicity composition of the block group (the ~6 blocks that are immediately adjacent to your block).  
- Set a destination and calculate commute times from addresses to the destination. Once a new destination is set, all data associated with individual addresses will be cleared. The default address is NYU Tandon, 6 Metrotech Center, located in the heart of downtown Brooklyn.  

### File Structure
nyc-apartment-hunter/  
├── src/  
│   ├── background/  
│   │   ├── background.js   
│   │   └── contextMenu.js  
│   ├── popup/  
│   │   ├── popup.html  
│   │   └── popup.js  
│   ├── api/  
│   │   ├── fetchComplaintData.js  
│   ├── content.js  
│   └── manifest.json  
├── package.json  
├── README.md  

### Default Settings
1. Commute departure time is set to 10:00 am next day. 
