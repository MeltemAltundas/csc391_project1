document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById('search-form');
    const resultsContainer = document.getElementById('search-results-container');
    const searchInput = document.getElementById('site-search');
    const checkinInput = document.getElementById('checkin-date');
    const checkoutInput = document.getElementById('checkout-date');
    const guestsInput = document.getElementById('guests');

    const urlParams = new URLSearchParams(window.location.search);
    const queryQ = urlParams.get('q') || "";
    const queryCheckin = urlParams.get('checkin') || "";
    const queryCheckout = urlParams.get('checkout') || "";
    const queryGuests = urlParams.get('guests') || "1";

    if (queryQ) searchInput.value = queryQ;
    if (queryCheckin) checkinInput.value = queryCheckin;
    if (queryCheckout) checkoutInput.value = queryCheckout;
    
    let parsedGuests = parseInt(queryGuests);
    if (isNaN(parsedGuests) || parsedGuests < 1) parsedGuests = 1;
    guestsInput.value = parsedGuests;

    let initialNights = 1;
    if (queryCheckin && queryCheckout) {
        const checkinDate = new Date(queryCheckin);
        const checkoutDate = new Date(queryCheckout);
        const dayDifference = Math.ceil((checkoutDate - checkinDate) / (1000 * 3600 * 24));
        if (dayDifference > 0) initialNights = dayDifference;
    }

    fetchAndDisplayHotels(queryQ.toLowerCase(), initialNights, parsedGuests);

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault(); 
        
        const searchTerm = searchInput.value.trim().toLowerCase();
        
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

        let numberOfGuests = parseInt(guestsInput.value);
        if (isNaN(numberOfGuests) || numberOfGuests < 1) {
            numberOfGuests = 1;
        }
        
        fetchAndDisplayHotels(searchTerm, numberOfNights, numberOfGuests);
    });

    function fetchAndDisplayHotels(searchTerm, nights, guests) {
        resultsContainer.innerHTML = '';

        try {

            let hotels = hotelsData.hotels || [];

            // FILTERING: Match search term with hotel name or city
            if (searchTerm !== "") {
                hotels = hotels.filter(hotel => {
                    const hotelName = hotel.name ? hotel.name.toLowerCase() : "";
                    const hotelCity = hotel.city ? hotel.city.toLowerCase() : "";
                    return hotelName.includes(searchTerm) || hotelCity.includes(searchTerm);
                });
            }

            hotels.sort((a, b) => {
                const nameA = a.name ? a.name.toLowerCase() : '';
                const nameB = b.name ? b.name.toLowerCase() : '';
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });

            if (hotels.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="col-12 mt-4 text-center w-100">
                        <h5 class="text-muted">No hotels found matching your search. Please try another keyword.</h5>
                    </div>
                `;
                return; 
            }
            
            hotels.forEach(hotel => {
                const col = document.createElement('div');
                col.className = 'col'; 
                
                let imageUrl = 'https://placehold.co/300x200?text=Hotel+Image';
                if (hotel.thumbNailUrl) {
                    imageUrl = hotel.thumbNailUrl.startsWith('http') 
                                ? hotel.thumbNailUrl 
                                : `https://www.travelnow.com${hotel.thumbNailUrl}`;
                }

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

                const cardElement = col.querySelector('.hotel-card');
                cardElement.addEventListener('click', function () {
                    const hotelDataToSave = {
                        ...hotel,
                        hotel_name: hotel.name, 
                        name: hotel.name,
                        addressline1: hotel.address1, 
                        address1: hotel.address1,
                        city: hotel.city,
                        country: hotel.countryCode,
                        countryCode: hotel.countryCode,
                        overview: hotel.locationDescription || "Welcome to our beautiful hotel in the heart of the city.",
                        shortDescription: hotel.locationDescription,
                        photo1: imageUrl, 
                        hotelImage: imageUrl, 
                        selectedNights: nights,
                        selectedGuests: guests,
                        calculatedPrice: calculatedTotal
                    };

                    sessionStorage.setItem('selectedHotel', JSON.stringify(hotelDataToSave));
                    window.location.href = 'hotelDetails.html';
                });

                resultsContainer.appendChild(col);
            });
            
        } catch (error) {
            console.error("Error loading data:", error);
            resultsContainer.innerHTML = `<p class="text-danger fw-bold mt-4">Failed to load search results. Please check the console.</p>`;
        }
    }
});