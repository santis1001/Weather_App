
//API key
var appid = 'f5cf5cc638b6ea3d999d0a5599e54ea5'

//API call mock data
var mockAPI5 = './assets/js/mock_data5.json'
var mockAPI1 = './assets/js/mock_data1.json'
//API call address
//var webAPI5 = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&appid='+appid+'&units=metric'
//var webAPI1 = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid='+appid+'&units=metric'

//Initialize HTML elements variables
var search_btn = document.getElementById('search_btn');
var search_bar = document.getElementById('search_bar');
$('#search_btn').on('click', function(event){search_param(event, 'btn') });
$('#search_bar').on('click', function(event){search_param(event, 'bar') });

var doc_btn_list = document.getElementById('buttonCity_list');

var doc_today_cast = document.getElementById('today_cast');
var doc_5day_cast = document.getElementById('5day_cast');

var doc_today_city = document.getElementById('City');
var doc_today_icon = document.getElementById('Main_icon');
var doc_today_temp = document.getElementById('temp');
var doc_today_wind = document.getElementById('wind');
var doc_today_humd = document.getElementById('humd');

//Initialize Local Global variables
var Selected_city_name ;
var autocomlete_city = [];
var historyCity = [];
var city_list = [];
var Selected_city_info = {};
var Selected_city_today = {};
var Selected_city_5day = [];

var btn_array;
//fill arrays with their information
//btn_array contains the object with necessary information to use the webAPI
//historyCiti contains the name of previously searched cities
btn_array = JSON.parse(localStorage.getItem('OBJHistory'));
historyCity =JSON.parse(localStorage.getItem('CityHistory'));
if(historyCity==null){
    historyCity=[];
}    console.log(historyCity);

if(btn_array==null){
    btn_array = [];    
}else{
    Selected_city_info = {
        name:btn_array[0].name,
        lat:btn_array[0].lat, 
        lng: btn_array[0].lng,
        country: btn_array[0].country
    };
    console.log(btn_array);
    search_weather_info(Selected_city_info);

    render_btn();
}
//This function fetch and stores the world cities into an large array
//which will be used for the autocomplete function for the search input
$(
    function(){
        fetch('./assets/js/worldcities.csv')
        .then(response => response.text())
        .then(data => {
            const parsedData = Papa.parse(data, { header: true });
            const dataArray = parsedData.data;
            //console.log(dataArray);
            autocomlete_city = [];
                dataArray.forEach(element => {
                autocomlete_city.push(element.city_ascii+', '+element.iso2);
            });
            city_list = dataArray;
            //console.log(autocomlete_city);
            $('#search_bar').autocomplete({
                source: function( request, response ) {
                    var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
                    response( $.grep( autocomlete_city, function( item ){
                        return matcher.test( item );
                    }) );
                }
            });
        })
        .catch(error => console.log(error));
    }
);
//this functino is calles from the `search_weather_info` function and 
//will retrieve data for the main dashboard information using the `todayCast` function
//which will render the information in the HTML
function call_API1(web) {
    data = fetch(web)
    .then(response => response.json())
    .then(obj =>{
        data = JSON.parse(JSON.stringify(obj));
        todayCast(data);
    });
} 
//this functino is calles from the `search_weather_info` function and 
//will retrieve data for the 5 day forecast information cards using `Five_dayCast` function
//which will render the information in the HTML
function call_API5(web){
    data = fetch(web)
    .then(response => response.json())
    .then(obj =>{
        data = JSON.parse(JSON.stringify(obj));
        //console.log(data.list);
        Five_dayCast(data.list);
    });
}
//this function is triggered from the search input and button
//it will recieve the event and a string pointing which made the click
function search_param (src_data, src){
    //console.log(src_data.type +' '+src);
    var value_search = document.getElementById('search_bar');
    if(src_data.type == 'click' && src=='btn'){ 
        //console.log('entro');
        if(value_search!= null){
            search_fetch(value_search.value);
            search_btn.setAttribute('value', '');
            value_search.value = '';
        }        
        search_btn.setAttribute('class', 'mt-2 w-100 btn btn-primary disabled');
    }else if(src_data.type == 'click' && src=='bar'){
        search_btn.setAttribute('class', 'mt-2 w-100 btn btn-primary');
    }
}
//if the event trigger was the button this function will be called and sent 
//data from the input value
//this functions is called from the history buttons aswell
//this function compares the data recieved and the autocomplete so there isnt 
//a input that doesnt exist.
//if exist it will save the data in the btn_array and historyCity and save it 
//in the LocalStorage then render the history button which will include the new
//one the render the information for the dashboard
function search_fetch(input_data){
    
    const index =  autocomlete_city.indexOf(input_data);
    try{
        Selected_city_info = {
                name:city_list[index].city_ascii,
                lat:city_list[index].lat, 
                lng: city_list[index].lng,
                country: city_list[index].iso2
            };        
    //console.log(historyCity.indexOf(input_data));
    if(historyCity.indexOf(input_data)==(-1)){
        historyCity.push(input_data);
        console.log(historyCity);
        localStorage.setItem('CityHistory', JSON.stringify(historyCity));
        //console.log(Selected_city_info);   
            
        btn_array = JSON.parse(localStorage.getItem('OBJHistory'));
        if(btn_array==null){        
            btn_array=[];
        }
        btn_array.push(Selected_city_info);
        console.log(btn_array);
        localStorage.setItem('OBJHistory', JSON.stringify(btn_array));
        
        render_btn();
    }
    search_weather_info(Selected_city_info);   
    }catch{
        console.error();
    }  
}
//this function is call every time the information must update when changing the city
//there are the API calls and the function method that will fetch the data
function search_weather_info(city_info){

    webAPI5 = 'https://api.openweathermap.org/data/2.5/forecast?lat='+city_info.lat+'&lon='+city_info.lng+'&appid='+appid+'&units=metric';
    webAPI1 = 'https://api.openweathermap.org/data/2.5/weather?lat='+city_info.lat+'&lon='+city_info.lng+'&appid='+appid+'&units=metric';

    // console.log(webAPI1);
    // console.log(webAPI5);
    
    call_API1(webAPI1);
    call_API5(webAPI5);
}

//this function resets the button list so then it would get fill with the btn_array
//data it add the click event aswell
function render_btn(){
    doc_btn_list.innerHTML = '';

    for(var i =0;i<btn_array.length;i++){
        var btn = document.createElement('button');
        btn.setAttribute('class','btn btn-secondary');
        btn.setAttribute('type', 'button');
        btn.setAttribute('id',''+btn_array[i].name+'-'+btn_array[i].country);
        btn.textContent = ''+btn_array[i].name+', '+btn_array[i].country;
        doc_btn_list.appendChild(btn);
        $('#'+btn_array[i].name+'-'+btn_array[i].country).on('click', function(event){
            event.preventDefault();
            console.log(event.target.innerText);
            search_fetch(event.target.innerText);
        });

    }

}
//retrieves the necessary data from the object passed down into the function 
//it will get the data and format it into our wanted format
//at the end it calls the function `render_today` which will show the info in
//screen
function todayCast(data){
    Selected_city_today = {
        date: dayjs.unix(data.dt).format('MM/D/YYYY'),
        icon: 'https://openweathermap.org/img/wn/'+data.weather[0].icon+'@2x.png',
        desc: data.weather[0].description,
        temp: data.main.temp,
        wind: data.wind.speed,
        humd: data.main.humidity
    };
    
    render_today();
    
}
//Renders todays data information into the upped daschboard using the global
//variable used for the selected city data
function render_today(){
    doc_today_city.textContent = Selected_city_info.name+', '+Selected_city_info.country+' ('+Selected_city_today.date+')';
    doc_today_icon.setAttribute('src',''+Selected_city_today.icon);
    doc_today_icon.setAttribute('alt',''+Selected_city_today.desc);
    doc_today_temp.textContent = 'Temp: '+Selected_city_today.temp+' °C';
    doc_today_wind.textContent = 'Wind: '+Selected_city_today.wind+' Km/h';
    doc_today_humd.textContent = 'Humidity: '+Selected_city_today.humd+'%';

}
//retrieves the necessary data from the object passed down into the function 
//the data outputs 6 object per day, so it retieve the wanted data from selected
//object and formated into out wanted format and store on a 5 object array
//at the end it calls the function `render_5day` which will show the info in
//screen
function Five_dayCast(data){
    Selected_city_5day = [];
    data.forEach(element => {
        if(dayjs.unix(element.dt).format('H') == 12){
            //console.log(element.dt);
            // console.log(element);
            var Selected_city_week = {
                date: dayjs.unix(element.dt).format('MM/D/YYYY'),
                icon: 'https://openweathermap.org/img/wn/'+element.weather[0].icon+'@2x.png',
                desc: element.weather[0].description,
                temp: element.main.temp,
                wind: element.wind.speed,
                humd: element.main.humidity
            };
            Selected_city_5day.push(Selected_city_week);
        }
    });
    
    //console.log(Selected_city_5day);
    render_5day();
}
//Renders the five day forecast data information into the information cards 
//using the global variable used for the `Selected_city_5day` array
function render_5day(){
    doc_5day_cast.innerHTML = '';

    for(var i = 0;i<Selected_city_5day.length;i++){
        
        var cardContainer = document.createElement('div');
        cardContainer.setAttribute('class', 'col m-1 bg-weather');

        var date = document.createElement('h5');
        date.setAttribute('class','fw-bold');
        date.textContent = Selected_city_5day[i].date;
        
        var icon = document.createElement('img');
        icon.setAttribute('class','ms-3');
        icon.setAttribute('style','height: 75px; width: 75px;');
        icon.setAttribute('src',''+Selected_city_5day[i].icon);
        icon.setAttribute('alt',''+Selected_city_5day[i].desc);

        var temp = document.createElement('h6');
        temp.textContent = 'Temp: '+Selected_city_5day[i].temp+' °C';
        
        var wind = document.createElement('h6');
        wind.textContent = 'Wind: '+Selected_city_5day[i].wind+' Km/h';
        
        var humd = document.createElement('h6');
        humd.textContent = 'Humidity: '+Selected_city_5day[i].humd+'%';
        
        cardContainer.appendChild(date);
        cardContainer.appendChild(icon);
        cardContainer.appendChild(temp);
        cardContainer.appendChild(wind);
        cardContainer.appendChild(humd);

        doc_5day_cast.appendChild(cardContainer);

    }


}

