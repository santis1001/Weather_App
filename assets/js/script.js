
var appid = 'f5cf5cc638b6ea3d999d0a5599e54ea5'
var maybe = 'b1b15e88fa797225412429c1c50c122a1r';
var isMain = false;
var mockAPI5 = './assets/js/mock_data5.json'
var mockAPI1 = './assets/js/mock_data1.json'

var lat = 41.8338;
var lon = -88.0616;
var webAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&appid='+appid+'&units=metric'
var webAPI = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&appid='+appid+'&units=metric'

console.log(webAPI);

/*fetch(webAPI)
    .then(response => response.json())
    .then(data => {
        console.log(JSON.stringify(data));
    })
    .catch(error => console.error('Error loading JSON file:', error)); 
    */
// var data;

$( function () {
    data = fetch(mockAPI1)
    .then(response => response.json())
    .then(obj =>{
        data = JSON.parse(JSON.stringify(obj));
        console.log(data);
    });
});

$( function () {
    data = fetch(mockAPI5)
    .then(response => response.json())
    .then(obj =>{
        data = JSON.parse(JSON.stringify(obj));
        console.log(data.list);
        Five_dayCast(data.list);
    });
});

var search_btn = document.getElementById('search_btn');
var search_bar = document.getElementById('search_bar');
$('#search_btn').on('click', function(event){search_param(event, 'btn') });
$('#search_bar').on('click', function(event){search_param(event, 'bar') });

var doc_5day_cast = document.getElementById('5day_cast');

var Selected_city_name ;
var autocomlete_city = [];
var city_list = [];
var Selected_city_info = {};
var Selected_city_today = {};
var Selected_city_5day = [];

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
        contry: city_list[index].iso2
    };
    console.log(Selected_city_info);


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

function Five_dayCast(data){

    Selected_city_5day = [];
    data.forEach(element => {
        if(dayjs.unix(element.dt).format('H') == 12){

            // console.log(dayjs.unix(element.dt).format('MM/D/YYYY hh:mm:ss a '));
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
    
    console.log(Selected_city_5day);
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
        temp.textContent = 'Temp: '+Selected_city_5day[i].temp;
        
        var wind = document.createElement('h6');
        wind.textContent = 'Wind: '+Selected_city_5day[i].wind;
        
        var humd = document.createElement('h6');
        humd.textContent = 'Humidity: '+Selected_city_5day[i].humd;
        
        cardContainer.appendChild(date);
        cardContainer.appendChild(icon);
        cardContainer.appendChild(temp);
        cardContainer.appendChild(wind);
        cardContainer.appendChild(humd);

        doc_5day_cast.appendChild(cardContainer);

    }


}

