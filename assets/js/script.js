
var appid = 'f5cf5cc638b6ea3d999d0a5599e54ea5'
var webAPI = 'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid='+appid;
var mockAPI = './assets/json/mock_data.json'
var isMain = false;

fetch(isMain ? webAPI :mockAPI)
    .then(response => response.json())
    .then(data => {
    // Use the loaded JSON data here
    console.log(data);
    })
    .catch(error => console.error('Error loading JSON file:', error));