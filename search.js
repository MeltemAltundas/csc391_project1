document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById('search-form');
    const resultsContainer = document.getElementById('search-results-container');
    const searchInput = document.getElementById('site-search');
    const checkinInput = document.getElementById('checkin-date');
    const checkoutInput = document.getElementById('checkout-date');
    const guestsInput = document.getElementById('guests');

    // Load all hotels by default (1 night, 1 guest) when the page loads
    fetchAndDisplayHotels("", 1, 1);

    // Event listener for the search form submission
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault(); 
        
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        // Calculate the number of nights based on check-in and check-out dates
        let numberOfNights = 1;
        if (checkinInput.value && checkoutInput.value) {
            const checkinDate = new Date(checkinInput.value);
            const checkoutDate = new Date(checkoutInput.value);
            
            const timeDifference = checkoutDate.getTime() - checkinDate.getTime();
            const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
            
            if (dayDifference > 0) {
                numberOfNights = dayDifference;
            } else {
                alert("Checkout date must be after checkin date!");
                return;
            }
        }

        // Retrieve and validate the number of guests
        let numberOfGuests = parseInt(guestsInput.value);
        if (isNaN(numberOfGuests) || numberOfGuests < 1) {
            numberOfGuests = 1;
        }
        
        // Fetch and display results based on user inputs
        fetchAndDisplayHotels(searchTerm, numberOfNights, numberOfGuests);
    });

    function fetchAndDisplayHotels(searchTerm, nights, guests) {
        resultsContainer.innerHTML = '';

        fetch('hotels-data.json')
            .then(response => response.json())
            .then(data => {
                let hotels = data.hotels || [];

                // 1. FILTERING: Match search term with hotel name or city
                if (searchTerm !== "") {
                    hotels = hotels.filter(hotel => {
                        const hotelName = hotel.name ? hotel.name.toLowerCase() : "";
                        const hotelCity = hotel.city ? hotel.city.toLowerCase() : "";
                        return hotelName.includes(searchTerm) || hotelCity.includes(searchTerm);
                    });
                }

                // 2. SORTING: Alphabetical order (A-Z) by hotel name
                hotels.sort((a, b) => {
                    const nameA = a.name ? a.name.toLowerCase() : '';
                    const nameB = b.name ? b.name.toLowerCase() : '';
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                });

                // Handle case where no results match the search query
                if (hotels.length === 0) {
                    resultsContainer.innerHTML = `
                        <div class="col-12 mt-4 text-center w-100">
                            <h5 class="text-muted">No hotels found matching your search. Please try another keyword.</h5>
                        </div>
                    `;
                    return; 
                }

                // 3. RENDER CARDS: Create and append HTML elements for each hotel
                hotels.forEach(hotel => {
                    const col = document.createElement('div');
                    col.className = 'col'; 
                    
                    // Format image URL handling relative and absolute paths
                    let imageUrl = 'https://placehold.co/300x200?text=Hotel+Image';
                    if (hotel.thumbNailUrl) {
                        imageUrl = hotel.thumbNailUrl.startsWith('http') 
                                    ? hotel.thumbNailUrl 
                                    : `https://www.travelnow.com${hotel.thumbNailUrl}`;
                    }

                    // DYNAMIC PRICE CALCULATION: Base Rate * Nights * Guests
                    const baseRate = hotel.lowRate || 0;
                    const calculatedTotal = baseRate * nights * guests;

                    const cardHtml = `
                        <div class="card h-100 shadow-sm hotel-card" style="cursor: pointer; transition: transform 0.2s;">
                            <img src="${imageUrl}" class="card-img-top object-fit-cover" height="150" alt="${hotel.name}" onerror="this.src='https://placehold.co/300x200?text=Image+Not+Found'">
                            <div class="card-body d-flex flex-column">
                                <h6 class="card-title fw-bold">${hotel.name}</h6>
                                <p class="card-text mb-1 text-muted small">🏙️ ${hotel.city || 'Location Unknown'}</p>
                                <p class="card-text small mb-2">⭐ ${hotel.hotelRating || 'Unrated'} Stars</p>
                                <div class="mt-auto bg-light p-2 rounded">
                                    <p class="card-text mb-0 small text-muted">Base Rate: $${baseRate} / night</p>
                                    <p class="card-text fw-bold mb-0 text-primary fs-5">$${calculatedTotal}</p>
                                    <p class="card-text mb-0" style="font-size: 0.7rem;">Total for ${nights} night(s) & ${guests} guest(s)</p>
                                </div>
                            </div>
                        </div>
                    `;
                    col.innerHTML = cardHtml;

                    // 4. CLICK EVENT: Redirect to hotel details page with mapped data
                    const cardElement = col.querySelector('.hotel-card');
                    cardElement.addEventListener('click', function () {
                        
                        // Map the fetched data strictly to the variable names expected by hotelDetails.js
                        const hotelDataToSave = {
                            ...hotel,
                            
                            // Map names (satisfies: selectedHotel.hotel_name || selectedHotel.name)
                            hotel_name: hotel.name, 
                            name: hotel.name,
                            
                            // Map addresses (satisfies: selectedHotel.addressline1 || selectedHotel.address1)
                            addressline1: hotel.address1, 
                            address1: hotel.address1,
                            
                            // Map locations (satisfies: selectedHotel.city, selectedHotel.country)
                            city: hotel.city,
                            country: hotel.countryCode,
                            countryCode: hotel.countryCode,
                            
                            // Map descriptions (satisfies: selectedHotel.overview || selectedHotel.shortDescription)
                            overview: hotel.locationDescription || "Welcome to our beautiful hotel in the heart of the city.",
                            shortDescription: hotel.locationDescription,

                            // Map images 
                            photo1: imageUrl, 
                            hotelImage: imageUrl, 
                            
                            // Pass calculated user search data for future use (e.g., payment page)
                            selectedNights: nights,
                            selectedGuests: guests,
                            calculatedPrice: calculatedTotal
                        };

                        // Save the properly formatted object to sessionStorage and redirect
                        sessionStorage.setItem('selectedHotel', JSON.stringify(hotelDataToSave));
                        window.location.href = 'hotelDetails.html';
                    });

                    resultsContainer.appendChild(col);
                });
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                resultsContainer.innerHTML = `<p class="text-danger fw-bold mt-4">Failed to load search results. Please check the console.</p>`;
            });
    }
});