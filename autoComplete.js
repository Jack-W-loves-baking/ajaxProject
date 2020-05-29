/*
*   
* File description:
*  This js file is to establish google map API.
*
* Function descriptions:
* 1. initAutocomplete() -  establish google map API and bind auto complete to 'pickuplocation' input field in booking.html.
*/


//this is for pick up google map location autocomplete box
function initAutocomplete() {
    var autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('pickuplocation'),
        {
            types: ['establishment'],
            //search result limit to NZ
            componentRestrictions: { 'country': ["NZ"] },
            //only need several info, do not want to waste free limits.
            fields: ['place_id', 'geometry', 'name']
        });
    
}
