import {useEffect,useState} from "react";
//Navigator is a default api for getting user location
//Refer to https://developer.mozilla.org/en-US/docs/Web/API/Geolocation
//If you want to add something regarding user postition calculation just change this
//Make sure you also do return the eser location in [latitude,longitude]
function GetCurrentPos(){
    const [userPos,setUserPosition]=useState(null);
    useEffect(()=>{
        if(!navigator.geolocation){
            console.log("Browser does not support geolocation");
            return;
        }
        console.log("Browser supports geolocation");
        navigator.geolocation.getCurrentPosition(
            position=>{setUserPosition([position.coords.latitude,position.coords.longitude]);

            },
            error=>{
                console.error("Failed to get location:",error);
            }
        );
    },[]);

    return userPos;
}

export default GetCurrentPos;