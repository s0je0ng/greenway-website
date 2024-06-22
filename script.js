let map;
let directionsService;
let directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 52.3676, lng: 4.9041 },
        zoom: 13
    });
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

function generateRoute() {
    const selectedLocations = [];
    const checkboxes = document.querySelectorAll('.location-checkbox:checked');

    checkboxes.forEach(checkbox => {
        const location = checkbox.parentElement.getAttribute('data-location');
        selectedLocations.push(location);
    });

    if (selectedLocations.length < 2) {
        alert('Please select at least a start and end location.');
        return;
    }

    const start = selectedLocations[0];
    const end = selectedLocations[selectedLocations.length - 1];
    const waypoints = selectedLocations.slice(1, -1).map(location => ({ location, stopover: true }));

    const request = {
        origin: start,
        destination: end,
        waypoints: waypoints,
        travelMode: 'BICYCLING',
        optimizeWaypoints: true
    };

    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
        } else {
            alert('Directions request failed due to ' + status);
        }
    });
}

