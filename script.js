let map;
let directionsService;
let directionsRenderer;

document.addEventListener('DOMContentLoaded', function() {
    // Function to handle route generation and redirection
    window.generateRoute = function() {
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

        // Store selected locations in localStorage to pass to mytrip.html
        localStorage.setItem('selectedLocations', JSON.stringify(selectedLocations));

        // Redirect to mytrip.html after generating route
        window.location.href = 'mytrip.html';
    }

    // Function to initialize the map
    window.initMap = function() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 52.3676, lng: 4.9041 }, // Default center (Amsterdam)
            zoom: 13
        });
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        // Generate route if on mytrip.html
        if (window.location.pathname.includes('mytrip.html')) {
            generateRouteOnMap();
        }
    }

    // Function to generate the route on the map in mytrip.html
    function generateRouteOnMap() {
        const selectedLocations = JSON.parse(localStorage.getItem('selectedLocations')) || [];
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
            travelMode: 'WALKING', // Change to 'BICYCLING' if needed
            optimizeWaypoints: true
        };

        directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(result);
                displayRouteDetails(result);
            } else {
                alert('Directions request failed due to ' + status);
            }
        });
    }

    function displayRouteDetails(directionsResult) {
        const route = directionsResult.routes[0];
        let routeDetailsHTML = `
            <div class="route-summary">
                <h2>Route Summary</h2>
                <p class="route-distance">Total Distance: ${(route.legs.reduce((acc, leg) => acc + leg.distance.value, 0) / 1000).toFixed(2)} km</p>
                <p class="route-duration">Total Duration: ${(route.legs.reduce((acc, leg) => acc + leg.duration.value, 0) / 60).toFixed(2)} minutes</p>
            </div>
            <div class="route-instructions">
                <h3>Instructions</h3>
                <ol>`;
    
        route.legs.forEach((leg, index) => {
            routeDetailsHTML += `<li>
                <p><strong>Leg ${index + 1}:</strong></p>
                <p>Start: ${leg.start_address}</p>
                <p>End: ${leg.end_address}</p>
                <p>Distance: ${leg.distance.text}</p>
                <p>Duration: ${leg.duration.text}</p>
                <p>Steps:</p>
                <ol>`;
    
            leg.steps.forEach(step => {
                routeDetailsHTML += `<li>${step.instructions}</li>`;
            });
    
            routeDetailsHTML += `</ol></li>`;
        });
    
        routeDetailsHTML += `</ol></div>`;
    
        document.getElementById('route-details').innerHTML = routeDetailsHTML;
    }
    
});
