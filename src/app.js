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

// info on page
let cityname="New York";
let today=new Date();
let weekDays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
let todayData=`${weekDays[today.getDay()-1]} ${today.getHours()}:${today.getMinutes()}`;
currentDateInfo.innerHTML=`${todayData}`;

//api info
let apiKey = "2b4da377910efe4a9072eaa420c98eec";
let apiLink = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=${apiKey}`;

//
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
    console.log(response);
    const { data: {
        main: {
            temp,
            humidity
        },
        name: cityname,
        weather: [
            { description }
        ],
        wind: {
            speed
        }
    }} = response;
    cityInfoOnPage.innerHTML=cityname;
    tempCurrValue.innerHTML=Math.round(temp);
    weatherState.innerHTML=description;
    humidityInfo.innerHTML=humidity;
    windInfo.innerHTML=speed;

    //deal with temp converting
    if(![...celciumFormat.classList].includes("activeTempMode")){
        celciumFormat.classList.add("activeTempMode");
        fahrenheitFormat.classList.remove("activeTempMode");
    }
}
function changeCity(event){
    event.preventDefault();
    let userInputCity=document.querySelector("#searchInput").value;
    let searchedCity=document.querySelector("#searchedCity");
    searchedCity.innerHTML=`${userInputCity}`;
    cityname=userInputCity;
    document.querySelector("#searchInput").value='';
    apiLink = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&units=metric&appid=${apiKey}`;

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