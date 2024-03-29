let currentDateInfo=document.querySelector("#currentDate");
let searchCity=document.querySelector("#submitForm");
let celciumFormat=document.querySelector("#celciumMode");
let fahrenheitFormat=document.querySelector("#fahrenheitMode");
let tempCurrValue=document.querySelector("#currentTemp");
let cityInfoOnPage=document.querySelector("#searchedCity");
let weatherState=document.querySelector("#weatherState");
let humidityInfo=document.querySelector("#humidityInfo");
let windInfo=document.querySelector("#windInfo");
let btnCurrentPosition=document.querySelector("#btnCurrentPosition");
let stateIcons=document.querySelector("#stateIcons");
let page=document.querySelector(".container");
let followingDaysFilds=document.querySelectorAll("#followingDays");
let sectionForNextDays=document.querySelector(".further");
//
let weekDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
let todayIndex;
// info on page
let cityname="New York";

//api info
let apiKey = "2b4da377910efe4a9072eaa420c98eec";
let apiLink = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=${apiKey}`;

//working set
axios.get(apiLink).then(fillPage);

// event listeners
searchCity.addEventListener("submit", changeCity);
celciumFormat.addEventListener("click",tempToCelcium);
fahrenheitFormat.addEventListener("click",tempToFahrenheit);
btnCurrentPosition.addEventListener("click",()=>{navigator.geolocation.getCurrentPosition(getUserPosition)});

// functions
function getUserPosition(position){
    let lat = Math.round(position.coords.latitude);
    let long = Math.round(position.coords.longitude);
    let placeApiLink=apiLink.slice(0,apiLink.indexOf("q"))+`lat=${lat}&lon=${long}`+apiLink.slice(apiLink.indexOf("&"));
    axios.get(placeApiLink).then(fillPage);
}
function fillPage(response){
    const { data: {
        main: {
            temp,
            humidity
        },
        dt,
        name: cityname,
        weather: [
            { main }
        ],
        wind: {
            speed
        },
        coord
    }} = response;
    cityInfoOnPage.innerHTML=cityname;
    tempCurrValue.innerHTML=Math.round(temp);
    humidityInfo.innerHTML=humidity;
    windInfo.innerHTML=speed;

    currentDateInfo.innerHTML=formatDate(dt*1000);
    changingBackground(main);

    //deal with temp converting
    if(![...celciumFormat.classList].includes("activeTempMode")){
        celciumFormat.classList.add("activeTempMode");
        fahrenheitFormat.classList.remove("activeTempMode");
    }
    
    forecastForNextDays(coord);
}
function changeCity(event){
    event.preventDefault();
    let userInputCity=document.querySelector("#searchInput").value;
    let searchedCity=document.querySelector("#searchedCity");
    document.querySelector("#searchInput").value='';
    apiLink = `https://api.openweathermap.org/data/2.5/weather?q=${userInputCity}&units=metric&appid=${apiKey}`;

    axios.get(apiLink).then(fillPage);
}
function tempToCelcium(event){
    if(![...celciumFormat.classList].includes("activeTempMode")){
        let formatedTemp=Math.round((Number(tempCurrValue.innerHTML)-32)*5/9);
        tempCurrValue.innerHTML=`${formatedTemp}`;

        celciumFormat.classList.add("activeTempMode");
        fahrenheitFormat.classList.remove("activeTempMode");
    }
}
function tempToFahrenheit(event){
    if(![...fahrenheitFormat.classList].includes("activeTempMode")){
        let formatedTemp=Math.round(Number(tempCurrValue.innerHTML)*9/5+32);
        tempCurrValue.innerHTML=`${formatedTemp}`;

        fahrenheitFormat.classList.add("activeTempMode");
        celciumFormat.classList.remove("activeTempMode");
    }
}
function formatDate(time){
    let today=new Date(time);
    console.log(today);
    
    let minutes=today.getMinutes();
    if(minutes.toString().length<2){
        minutes=`0${minutes}`;
    }
    todayIndex=today.getDay()-1;
    let todayData=`${weekDays[todayIndex]} ${today.getHours()}:${minutes}`;
    return todayData;
}
function changingBackground(state){
    let states=["Atmosphere","Thunderstorm","Drizzle","Rain","Snow","Clear","Clouds"];
    let images=["https://images.pexels.com/photos/691031/pexels-photo-691031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                "https://images.pexels.com/photos/680940/pexels-photo-680940.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                "https://images.pexels.com/photos/7002973/pexels-photo-7002973.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                "https://images.pexels.com/photos/3617453/pexels-photo-3617453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                "https://images.pexels.com/photos/1717212/pexels-photo-1717212.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                "https://images.pexels.com/photos/2344227/pexels-photo-2344227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                "https://images.pexels.com/photos/2931915/pexels-photo-2931915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"];
    let id=states.indexOf(state);
    if(id==-1){
        id=0;
    }
    page.style.backgroundImage=`url(${images[id]})`;
}
function addingNextDaysForecast(response){
    sectionForNextDays.innerHTML='';
    console.log(response);
    //display next number of days
    for(let i=0;i<5;i++){
        const {
            temp:{
                max,
                min
            },
            weather:[
                {icon}
            ],
            dt
        }=response.data.daily[i];
        let newDate=new Date(dt*1000).getDay();
        let dayElement=`
            <div class="row second">
                <span id="followingDays">${weekDays[newDate]}</span>
                <span>
                    <span class="dayTemp">${Math.round(max)}</span>/<span id="nightTemp">${Math.round(min)}</span>°C
                    <img id="stateIcons" src="https://openweathermap.org/img/wn/${icon}@2x.png" />
                </span>
            </div>`
        ;
        sectionForNextDays.innerHTML+=dayElement;
    }

}
function forecastForNextDays(coords){
    const {
        lon,
        lat
    }=coords
    console.log(coords);
    let nextApiLink=`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=7746bdeabca928cfedcad71e52fd9d66&units=metric`;
    axios.get(nextApiLink).then(addingNextDaysForecast);
}