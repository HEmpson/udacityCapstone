async function handleSubmit(event) {
    event.preventDefault();

    // check what text was put into the form field
    const data = {
        destination: document.getElementById('destination').value,
        departDate: document.getElementById('departDate').value
    }


    // swap the days and months around in the date
    const splitted = data.departDate.split('-');
    const swapped = [splitted[1], splitted[2], splitted[0]]
    const swappedDate = new Date(swapped);

    // set the difference between days
    let diff = setCountdown(swappedDate);

    
    let geoNameRes = await postData('/getGeoNames', data);
    let weatherRes = await postData('/getWeather', { data: geoNameRes, forecast: diff });
    let pixaRes = await postData('/getPhoto', data);

    

    updateUI(data, geoNameRes, weatherRes, diff, pixaRes);

   
}


// function to post the data to the server
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    try {

        const res = await response.json();
        return res;

    } catch (error) {
        console.log('error', error);
    }
}



// gets the difference between todays date and the depart date
const setCountdown = (departDate) => {
    const today = new Date();
    const msPerDay = 1000*60*60*24
    var month = today.getMonth() + 1;
    var day = today.getDate()
    var year = today.getFullYear();

    let standardizedDate = `${month}/${day}/${year}`

    let d1 = new Date(standardizedDate);
    let d2 = new Date(departDate);

    return Math.floor((d2 - d1) / msPerDay);
}


// updates the front end UI
const updateUI = (data, geoNameRes, weatherRes, diff, pixaRes) => {

    // reset all UI each submit
    document.getElementById("text").innerHTML = "";
    document.getElementById("now").innerHTML = "";
    document.getElementById("wind").innerHTML = "";
    document.getElementById("high").innerHTML = "";
    document.getElementById("low").innerHTML = "";

    if (!data.departDate) {
        document.getElementById("text").innerHTML = "Please enter a depart date";
        return;
    }

    // if user enters an invalid location
    if (geoNameRes.geonames.length == 0) {
        document.getElementById("text").innerHTML = "Please enter a valid location";
        return;
    }

    // get the weather now
    if (0 < diff && diff < 7) {
        document.getElementById("text").innerHTML = "Right now:";
        document.getElementById("now").innerHTML = `Temp: ${weatherRes.data[0].temp} celcius`;
        document.getElementById("wind").innerHTML = `Winds: ${weatherRes.data[0].wind_spd} m/s`;

        // if the departDay is before
    } else if (diff < 0) {
        document.getElementById("text").innerHTML = "You've missed your trip!";
    }

    // if we are forecasting the weather
    else {
        document.getElementById("text").innerHTML = `Estimated temp for ${diff} days time:`;
        if (diff < 17) {
            document.getElementById("high").innerHTML = `High: ${weatherRes.data[diff - 1].app_max_temp}`;
            document.getElementById("low").innerHTML = `Low: ${weatherRes.data[diff - 1].app_min_temp}`;
        } else {
            document.getElementById("high").innerHTML = `High: ${weatherRes.data[15].app_max_temp}`;
            document.getElementById("low").innerHTML = `Low: ${weatherRes.data[15].app_min_temp}`;
        }
        
    }

    document.getElementById("results").style.cssText = 'border-radius: 20px; box-shadow: 0 2px 8px grey; padding: 5px;margin-top: 15px;';
    document.getElementById("daysAway").innerHTML = `${data.destination} is ${diff} days away`;
    document.getElementById("photo").src = pixaRes.hits[0].largeImageURL;
}

export { handleSubmit }
