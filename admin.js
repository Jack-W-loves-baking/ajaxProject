/* 
*   
* File description:
*  This js file to process the events from admin.html and pass the requests to either adminFetchAll.php or adminAssignTaxi.php
*  depends on whether the admin wants to fetch all the record or change the booking status. 
*  Then after the processing from server, the result will be returned and value will be passed to relevant <div> on admin.html. 
*
* Function descriptions:
* 1. createRequest() - to create xmlHttpRequest
* 2. fetchAll(dataSource, divID) - Method to pass dataSource to server and return the result from server to divID in HTML
* 3. changeStatus(dataSource,divID,input) - Method to pass dataSource and input to server and return the result from server to divID in HTML
*/



//Below are global variables.
var reference;
/*Above are global variables.
*------------------------------------------------------------------------------------------------------------------
*------------------------------------------------------------------------------------------------------------------
*Below are functions
*/
//create xmlHttpRequest
function createRequest() {
    var xhr = false;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xhr;
}

//method to pass date to server
function fetchAll(dataSource, divID) {
    
    var xhr = createRequest();
    if (xhr) {
        var obj = document.getElementById(divID);

        //Dont need to pass anything, the database can extract bookings within 2hours and unassign status
        var url=dataSource;

        //true means asyncronized, means the admin can also assign the booking to taxi at the same time
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {

                obj.innerHTML = xhr.responseText;
            } // end if
        } // end anonymous call-back function
        xhr.send(null);
    } // end if
  
} // end function passData() 


function changeStatus(dataSource,divID,input) {
    
    reference = document.getElementById(input).value;
    if (reference!=""){
    var xhr = createRequest();
    if (xhr) {
        var obj = document.getElementById(divID);

        var url=dataSource + "?reference=" +reference;

        //true means asyncronized, means the admin can also assign the booking to taxi at the same time
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {

                obj.innerHTML = xhr.responseText;
            } // end if
        } // end anonymous call-back function
        xhr.send(null);
    } // end if
}

else{
    alert("Please enter the reference number.")
}
  
} // end function passData() 