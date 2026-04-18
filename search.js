document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById('search-form');
    const resultsContainer = document.getElementById('search-results-container');

    // Load results initially when the page opens
    fetchAndDisplayHotels();

    // Prevent default form submission and regenerate results
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault(); 
        
        // to filter results here. For now, it just dynamically regenerates the list.
        fetchAndDisplayHotels();
    });

    function fetchAndDisplayHotels() {
        // Clear out existing results for a fresh dynamic load
        resultsContainer.innerHTML = '';

        // Fetching the provided JSON file
        fetch('hotels-data.json')
            .then(response => response.json())
            .then(data => {
                let hotels = data.hotels || [];

                // 1. Sort Alphabetically by Hotel Name Ascending
                hotels.sort((a, b) => {
                    const nameA = a.name ? a.name.toLowerCase() : '';
                    const nameB = b.name ? b.name.toLowerCase() : '';
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                });

                // 2. Map the data into Bootstrap Cards
                hotels.forEach(hotel => {
                    // col-md-3 ensures 4 items per row on medium screens and larger
                    const col = document.createElement('div');
                    col.className = 'col-md-3 mb-4'; 
                    
                    // Fallback to picsum if the hotel image is missing
                    const imageUrl = hotel.thumbNailUrl ? `https://www.travelnow.com${hotel.thumbNailUrl}` : 'https://picsum.photos/300/200';

                    // Build the Card HTML string safely
                    const cardHtml = `
                        <div class="card h-100 shadow-sm hotel-card" style="cursor: pointer; transition: transform 0.2s;">
                            <img src="${imageUrl}" class="card-img-top object-fit-cover" height="150" alt="${hotel.name}" onerror="this.src='https://picsum.photos/300/200'">
                            <div class="card-body d-flex flex-column">
                                <h6 class="card-title fw-bold">${hotel.name}</h6>
                                <p class="card-text mb-1 text-muted small"><i class="bi bi-geo-alt"></i> ${hotel.city}</p>
                                <p class="card-text small mb-2">⭐ ${hotel.hotelRating} Stars</p>
                                <p class="card-text fw-bold mt-auto text-primary">$${hotel.lowRate} / night</p>
                            </div>
                        </div>
                    `;
                    col.innerHTML = cardHtml;

                    // 3. Add Event Listener to Card
                    const cardElement = col.querySelector('.hotel-card');
                    cardElement.addEventListener('click', function () {
                        // Save hotel data stringified to session storage
                        sessionStorage.setItem('selectedHotel', JSON.stringify(hotel));
                        
                        // Redirect without using a framework router
                        window.location.href = 'hotelDetails.html';
                    });

                    resultsContainer.appendChild(col);
                });
            })
            .catch(error => {
                console.error("Error fetching hotel data:", error);
                resultsContainer.innerHTML = `<p class="text-danger fw-bold">Failed to load search results.</p>`;
            });
    }
});