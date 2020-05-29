/* 
*   
* File description:
*  This js file to process the events from booking.html and pass the requests to serverDatabase.php,
*  then after the processing from server, the result will be returned and value will be passed to relevant <div> on booking.html. 
*
* Function descriptions:
* 1. createRequest() - to create xmlHttpRequest
* 2. validateInput(input,output,regex) - Invoke this method after the input onblur event on booking.html. 
                                         If the input does not meet regex, the output <p> warning will change from hidden to display.

* 3. passData(dataSource, divID) - Method to pass dataSource and values to server and return the result from server to divID in HTML.

* 4. checkIfAllInputAreCorrect() - check if all the input in booking.html are not empty and are meaningful. 
                                   Return true, if all the input are validated.
                                   Return false, if any of the input is invalid.

* 5. formattedTime (dateTime) - change the js dateTime format to YYYY-MM-DD HH:MM:SS, so that we could add into Mysql database directly as datetime.

* 6. validatePickuptime() - Compare the pickup time with the current time. 
                            Return false, if pick up time is earlier than the current time.
                            Return true, if pick up time is later than the current time. 

* 7. clearInput() - Clear all the input fields if the booking is successful passed.
* 8. getInputValue () - Assign all the input values in booking.html to the variables in booking.js
* 9. handleClick(addressgroup) - Method to handle the radio button group (addressgroup).
                                 The user can either use google map auto-complete field or manually enter address details.

*/



//Below are global variables.

var date;
var hour;
var minutes;
var currentTime;
var unitnumber;
var streetnumber;
var streetname;
var pickupsuburb;
var pickuplocation;
var manualAddress;
var pickupTime;
var obj;
var url;
var xhr;
var pickupaddress;
var aName;
var aPhone;
var aDestination;
/*Above are global variables.
*------------------------------------------------------------------------------------------------------------------
*------------------------------------------------------------------------------------------------------------------
*Below are functions
*/

/*This function is invoked for onblur events on booking.html input fields.
*if the input is empty or does not meet the regex, the hidden <p> warning will appear.
*if the input is valid, then <p> warning will stay hidden or become hidden.
*/
function validateInput(input, output, regex) {

    var inputElement = document.getElementById(input);

    //fetch the regex from parameter.
    var regex_name = regex;

    //Trim() to avoid spaces at the beginning and the end of the input.
    var valueForValidation = inputElement.value.trim();

    //As Unit Number is optional, the user does not have to fill in that fields. So we create a special condition filter
    //for Unit Number
    if (input == 'unitnumber') {

        if (!regex_name.test(valueForValidation)) {
            document.getElementById(output).style.display = "block";
        }
        else {
            document.getElementById(output).style.display = "none";
        }
    }//end if

    //apart from unitnumber
    else {
        if (!regex_name.test(valueForValidation) || (!valueForValidation)) {
            document.getElementById(output).style.display = "block";
        }
        else {
            document.getElementById(output).style.display = "none";
        }
    }
}

//create xmlHttpRequest
function createRequest() {
    xhr = false;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xhr;
}


//method to pass date to server
function passData(dataSource, divID) {

    if (checkIfAllInputAreCorrect()) {
        var xhr = createRequest();
        if (xhr) {
            obj = document.getElementById(divID);

            //get all the inputs
            getInputValue();

            //at the time the client clicked book now, if the selected pickup address is through google map search,
            //then assign the google map auto complete value to final pickupaddress
            //else, assign manual entry value to final pickupaddress.
            if (document.getElementById('selectGoogle').checked) {
                pickupaddress = pickuplocation;
            }
            else {
                pickupaddress = manualAddress;
            }

            //pass name, destination, phone to global variables
            url = dataSource + "?name=" + aName
                + "&phone=" + aPhone
                + "&address=" + pickupaddress
                + "&destination=" + aDestination
                + "&pickupTime=" + formattedTime(pickupTime) //formatted to YYYY-MM-DD HH:MM:00
                + "&currentTime=" + formattedTime(currentTime);//formatted to YYYY-MM-DD HH:MM:00

            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {

                if (xhr.readyState == 4 && xhr.status == 200) {

                    obj.innerHTML = xhr.responseText;
                    document.getElementById("result").style.display="block";
                    //clear all the current inputs;
                    clearInput();
                } // end if
            } // end anonymous call-back function
            xhr.send(null);
        } // end if
    }

} // end function passData() 



//this function is to format datetime to 'YYYY-MM-DD HH:MM:00' string.
function formattedTime(dateTime) {

    //toLocaleString('en-ZA') can return the datetime in 2020/05/27, 17:36:00
    let fullTime = dateTime.toLocaleString('en-ZA');

    //change to format as 2020/05/27 17:36:00
    let temp = fullTime.replace(",", "");

    //return value in a format 2020-05-27 17:36:00
    return temp.replace(/[/]/g, "-");
}


/*This function is to final check if any <p> warnings still appear on the booking.HTML
*If so, that means the user has not fixed input invalidation.
*Return true, if all <P> warnings are hidden, means no input invalidation, and the value can be passed to PHP
*Return false, if any <p> warning is displayed, means input invalidation exists, and the value cannot be passed.
*/
function checkIfAllInputAreCorrect() {

    //get all the input
    getInputValue();


    //List of input IDs
    var inputIdList = ['cname', 'phone', 'destination', 'date', 'hour', 'minutes']


    //This is used to prevent user to hit book now buttons without any inital inputs
    //Check no empty inputs exist.

    for (let element = 0; element < inputIdList.length; element++) {

        var inputs = document.getElementById(inputIdList[element]).value;
        if (inputs == '') {
            alert("Please complete all of your details");
            return false;
        }
    }

    //list of all the IDs of <p> warning.
    var errorIdList = ['clientNameError', 'clientNameError', 'googlemapError', 'unitnumberError',
        'streetnumberError', 'streetnameError', 'streetsuburbError',
        'clientDestinationError', 'dateError', 'hourError', 'minuteError'];

    /*This loop function is to check if any of <p> warnings is not hidden
    *If any <p> is not hidden, that means input invalidation occurs, return false.
    */
    for (let element of errorIdList) {

        var test = document.getElementById(element).style.display;

        if (document.getElementById(element).style.display != "none") {
            alert("Please fix all of your input errors");
            return false;
        }
    }

    //for the check box, the input under current selection cannot be empty.
    //Google map auto complete input cannot be empty if select 'Use Google Map Autocomplete'. Visa versa.
    if (document.getElementById('selectGoogle').checked && pickuplocation == "") {
        alert("Please complete pickup address via google map");
        return false;
    }
    if (document.getElementById('selectManual').checked && (streetnumber==""||streetname==""||pickupsuburb=="")) {
        alert("Please manually complete your pickup address");
        return false;
    }

    //Two method cannot input nothing at the same time.
    if (manualAddress.split("/").join("") == "" && pickuplocation == "") {
        alert("Please complete your pickup address");
        return false;
    }

    //Check pickuptime, pickuptime cannot be earlier than current time.
    //If the pickup time is ealier than current time, input invalidation occurs, return false.
    if (!validatePickuptime()) {
        alert("Pick up time cannot be earlier than current time");
        return false;
    }

    return true;

}

//this function is to check if the pick up time is earlier than current time.accordion
//Return false, if the pick up time is not earlier
//Return true, if the pick up time is earlier, which means invalid
function validatePickuptime() {

    //fetch the user input.
    getInputValue();

    //Convert to new Date (YYYY,MM,DD,HH,MM)
    //JS will automatically +1 for the month if put in new Date(). Therefore, we need to -1.
    pickupTime = new Date(date.split("-")[2], date.split("-")[1] - 1, date.split("-")[0], hour, minutes);
    currentTime = new Date();

    //As pickupTime and currentTime are all objects of Date, they can compare. 
    if (currentTime > pickupTime) {
        return false;
    }

    return true;

}


//this function is to handle the radio button selection for address.
function handleClick(addressgroup) {

    manualAddress = "";
    //get the user input.
    getInputValue();

    //If the user checked google search radio button
    if (addressgroup.value == 1) {

        //google search appears, mnnual enter disappears.
        document.getElementById('mannualselect').style.display = "none";
        document.getElementById('googleselect').style.display = "block";

        //set up error messages <p> for manual entry as invisible and clear all the input for manual entry;
        document.getElementById('unitnumberError').style.display = "none";
        document.getElementById('streetnumberError').style.display = "none";
        document.getElementById('streetnameError').style.display = "none";
        document.getElementById('streetsuburbError').style.display = "none";

        document.getElementById('unitnumber').value = "";
        document.getElementById('streetnumber').value = "";
        document.getElementById('streetname').value = "";
        document.getElementById('pickupsuburb').value = "";


    }

    //selected to use mannual enter
    else if (addressgroup.value == 2) {

        //google search disappears, mnnual enter appears.
        document.getElementById('googleselect').style.display = "none";
        document.getElementById('mannualselect').style.display = "block";

        //set up error message <p> for google map search as invisible and clear google map input
        document.getElementById('googlemapError').style.display = "none";
        document.getElementById('pickuplocation').value = "";

    }
}

function getInputValue() {
    unitnumber = document.getElementById("unitnumber").value;
    streetnumber = document.getElementById("streetnumber").value;
    streetname = document.getElementById("streetname").value;
    pickupsuburb = document.getElementById("pickupsuburb").value;
    manualAddress = unitnumber + "/" + streetnumber + "/" + streetname + "/" + pickupsuburb; //concat mannually entered address. 
    pickuplocation = document.getElementById("pickuplocation").value;//google map addres
    aName = document.getElementById("cname").value;
    aPhone = document.getElementById("phone").value;
    aDestination = document.getElementById("destination").value;
    date = document.getElementById("date").value;
    hour = document.getElementById("hour").value;
    minutes = document.getElementById("minutes").value;
}


function clearInput() {

    document.getElementById("unitnumber").value = "";
    document.getElementById("streetnumber").value = "";
    document.getElementById("streetname").value = "";
    document.getElementById("pickupsuburb").value = "";
    document.getElementById("pickuplocation").value = "";//google map addres
    document.getElementById("cname").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("destination").value = "";
    date = document.getElementById("date").value = "";
    hour = document.getElementById("hour").value = "";
    minutes = document.getElementById("minutes").value = "";
    manualAddress = ""
}


