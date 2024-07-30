# NYC Apartment Hunter
### Description
NYC Apartment Hunter is a Chrome extension that helps users gather and analyze information about various addresses in New York City. Users can add addresses to see past 311 complaints, ethnicity composition, and commute times to a specified destination.

### Features
- Add and view addresses along with associated complaints data and ethnicity composition of the block group (the ~6 blocks that are immediately adjacent to your block).  
- Set a destination and calculate commute times from addresses to the destination. Once a new destination is set, all data associated with individual addresses will be cleared. The default address is NYU Tandon, 6 Metrotech Center, located in the heart of downtown Brooklyn.  

### Installation
Currently, this extension has yet to be published to the Chrome Store. You can still follow the steps below to use the tool. Publication coming soon!  
1. Clone or download the repository: `git clone https://github.com/your-username/nyc-apartment-hunter.git`  
2. Open Chrome and navigate to the Extensions page.   
3. Enable Developer mode by toggling the switch in the top right corner.   
4. Click on the "Load unpacked" button and select the `src` directory in the cloned repository.   

### Usage
1. Open the extension popup by clicking the NYC Apartment Hunter icon in the Chrome toolbar.  
2. Set a destination: Enter the address of your destination in the input field under "Enter commute destination" and click "Add Destination." You can input an losely structured address if the information is sufficiently identifying, for instance, `NYU Bobst Library`. For addresses that may contain ambiguity, for instance, `123 45th Street` (there may be a Brooklyn version and a Manhattan version), include the district name or the zipcode. 
3. Add addresses: Enter an address in the input field under "Enter address" and click "Add Address."
The extension will fetch and display complaints, ethnicity composition, and commute time for the added address.
4. Caution! If you enter a new destination, all the currently stored addresses will be gone, since commute time needs to be re-calculated. 

### File Structure
nyc-apartment-hunter/  
|-- src/  
|   |-- background/  
|   |   |-- background.js   
|   |   |-- contextMenu.js  
|   |-- popup/  
|   |   |-- popup.html  
|   |   |-- popup.js 
|   |   |-- popup.css 
|   |-- utils/  
|   |   |-- utils.js
|   |   |-- api/
|   |       |-- fetchComplaintData.js
|   |       |-- geocode.js
|   |       |-- getCommuteDuration.js
|   |       |-- getDecennial.js
|   |       |-- getGEOID.js
|   |       |-- nearbySubway.js
|   |-- content.js  
|   |-- config.js
|   |-- manifest.json  
|-- package.json  
|-- README.md  


### Default Settings
1. Commute departure time is set to 10:00 am next day. 
