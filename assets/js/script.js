
var appid = 'f5cf5cc638b6ea3d999d0a5599e54ea5'
var maybe = 'b1b15e88fa797225412429c1c50c122a1r';
var isMain = false;
var mockAPI5 = './assets/js/mock_data5.json'
var mockAPI1 = './assets/js/mock_data1.json'

var lat = 41.8338;
var lon = -88.0616;
var webAPI5 = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&appid='+appid+'&units=metric'
var webAPI1 = 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid='+appid+'&units=metric'

//console.log(webAPI1);

var k = -273.15;
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

// localStorage.clear();
var Selected_city_name ;
var autocomlete_city = [];
var historyCity = [];
var city_list = [];
var Selected_city_info = {};
var Selected_city_today = {};
var Selected_city_5day = [];

var btn_array;

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

function call_API1(web) {
    data = fetch(web)
    .then(response => response.json())
    .then(obj =>{
        data = JSON.parse(JSON.stringify(obj));
        todayCast(data);
    });
} 
function call_API5(web){
    data = fetch(web)
    .then(response => response.json())
    .then(obj =>{
        data = JSON.parse(JSON.stringify(obj));
        //console.log(data.list);
        Five_dayCast(data.list);
    });
}
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
function search_fetch(input_data){
    
    const index =  autocomlete_city.indexOf(input_data);
    
    Selected_city_info = {
            name:city_list[index].city_ascii,
            lat:city_list[index].lat, 
            lng: city_list[index].lng,
            country: city_list[index].iso2
        };        
    console.log(historyCity.indexOf(input_data));
    if(historyCity.indexOf(input_data)==(-1)){
        historyCity.push(input_data);
        console.log(historyCity);
        localStorage.setItem('CityHistory', JSON.stringify(historyCity));

        console.log(Selected_city_info);   
            
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
    
}
function search_weather_info(city_info){

    webAPI5 = 'https://api.openweathermap.org/data/2.5/forecast?lat='+city_info.lat+'&lon='+city_info.lng+'&appid='+appid+'&units=metric'
    webAPI1 = 'https://api.openweathermap.org/data/2.5/weather?lat='+city_info.lat+'&lon='+city_info.lng+'&appid='+appid+'&units=metric'

    // console.log(webAPI1);
    // console.log(webAPI5);
    
    call_API1(webAPI1);
    call_API5(webAPI5);
}

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
            console.log(event.target.innerText);
            search_fetch(event.target.innerText);
        });

    }

}

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
function render_today(){
    doc_today_city.textContent = Selected_city_info.name+', '+Selected_city_info.country+' ('+Selected_city_today.date+')';
    doc_today_icon.setAttribute('src',''+Selected_city_today.icon);
    doc_today_icon.setAttribute('alt',''+Selected_city_today.desc);
    doc_today_temp.textContent = 'Temp: '+Selected_city_today.temp+' °C';
    doc_today_wind.textContent = 'Wind: '+Selected_city_today.wind+' Km/h';
    doc_today_humd.textContent = 'Humidity: '+Selected_city_today.humd+'%';

}

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

