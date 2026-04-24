const dealsAndDiscounts = [
    {
        title: "Earn 3K Bonus Points",
        details: "Earn 3K Bonus Points for every 3 nights you stay with us.",
        imageUrl: "https://picsum.photos/id/1015/300/200" 
    },
    {
        title: "Earn 1 Free Night",
        details: "Stay at selected hotels for 10 days and receive 1 complimentary night for your extended stay.",
        imageUrl: "https://picsum.photos/id/1039/300/200" 
    },
    {
        title: "Weekend Getaway 20% Off",
        details: "Book your weekend getaway now and save 20% on all of our luxury suites.",
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop" 
    },
    {
        title: "Free Breakfast Included",
        details: "Start your morning right! Enjoy a complimentary gourmet breakfast every day of your stay.",
        imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=300&h=200&fit=crop" 
    }
];
const popularSearches = [
    {
        title: "Antalya",
        averagePrice: "5454₺",
        numberOfHotels: "8280",
        minPrice: "2000₺",
        maxPrice: "15000₺",
        imageUrl: "https://picsum.photos/id/1016/300/200" 
    },
    {
        title: "Muğla",
        averagePrice: "7041₺",
        numberOfHotels: "7275",
        minPrice: "2500₺",
        maxPrice: "20000₺",
        imageUrl: "https://picsum.photos/id/1018/300/200" 
    },
    {
        title: "Kappadokien",
        averagePrice: "7402₺",
        numberOfHotels: "1386",
        minPrice: "3000₺",
        maxPrice: "18000₺",
        imageUrl: "https://picsum.photos/id/1036/300/200" 
    },
    {
        title: "Kuzey Kıbrıs",
        averagePrice: "7613₺",
        numberOfHotels: "592",
        minPrice: "3500₺",
        maxPrice: "25000₺",
        imageUrl: "https://picsum.photos/id/1043/300/200" 
    }
]

function renderDeals() {
    const container = document.getElementById('deals-container');
    container.innerHTML = "";
    
    dealsAndDiscounts.forEach(function(deal) {
        const cardHTML = `
            <div class="col-md-3 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${deal.imageUrl}" class="card-img-top" alt="${deal.title}">
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title fw-bold text-center">${deal.title}</h6>
                        <p class="card-text text-center" style="font-size: 0.9rem;">${deal.details}</p>
                        <div class="mt-auto text-center">
                            <a href="#" class="text-decoration-none text-uppercase" style="font-size: 0.8rem;">Learn More &rarr;</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML
    });

}
function renderPopularSearches() {
    const container = document.getElementById('popular-container');
    container.innerHTML = "";

    let allCards= "";

    popularSearches.forEach(function(popular, index){
        const activeClass = index === 0 ? "active" : "";
        allCards += `
        <div class="carousel-item ${activeClass}" onclick="window.location.href='searchResults.html?q=${popular.title}'" style="cursor: pointer;">
            <div class="card mx-auto" style="width: 18rem;">
                <img src="${popular.imageUrl}" class="card-img-top" alt="${popular.title}" loading="lazy">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${popular.title}</h5>
                    <p class="card-text mb-1 text-muted" style="font-size: 0.9rem;">${popular.numberOfHotels} Hotels</p>
                    <p class="card-text fw-bold">${popular.averagePrice} Avg.</p>
                </div>
            </div>
        </div>
        `;
    });

    container.innerHTML = allCards;
}

function handleSearchSubmission() {
    const searchForm = document.querySelector('form[role="search"]');

    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const searchInput = document.getElementById('site-search').value.trim().toLowerCase();
            const dealsSection = document.getElementById('deals-section');

            let hotels = (typeof hotelsData !== 'undefined' && hotelsData.hotels) ? hotelsData.hotels : [];

            if (searchInput !== "") {
                hotels = hotels.filter(hotel => {
                    const hotelName = hotel.name ? hotel.name.toLowerCase() : "";
                    const hotelCity = hotel.city ? hotel.city.toLowerCase() : "";
                    const hotelDesc = hotel.locationDescription ? hotel.locationDescription.toLowerCase() : "";
                    return hotelName.includes(searchInput) || hotelCity.includes(searchInput) || hotelDesc.includes(searchInput);
                });
            }

            hotels.sort((a, b) => {
                const nameA = a.name ? a.name.toLowerCase() : '';
                const nameB = b.name ? b.name.toLowerCase() : '';
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });

            hotels = hotels.slice(0, 5);

            if (dealsSection) {
                dealsSection.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2>Search Results</h2>
                        <a href="searchResults.html?q=${searchInput}" class="text-primary text-decoration-none fw-bold">See more deals &rarr;</a>
                    </div>
                    <div id="search-results-carousel" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner" id="search-carousel-container">
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#search-results-carousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#search-results-carousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                `;

                const carouselContainer = document.getElementById('search-carousel-container');
                let searchCards = "";

                if (hotels.length === 0) {
                    carouselContainer.innerHTML = `<div class="carousel-item active"><p class="text-center">No hotels found matching "${searchInput}".</p></div>`;
                } else {
                    hotels.forEach((hotel, index) => {
                        const activeClass = index === 0 ? "active" : "";
                        let imageUrl = hotel.thumbNailUrl ? (hotel.thumbNailUrl.startsWith('http') ? hotel.thumbNailUrl : `https://www.travelnow.com${hotel.thumbNailUrl}`) : 'https://placehold.co/300x200?text=Hotel+Image';

                        searchCards += `
                        <div class="carousel-item ${activeClass}" onclick="window.location.href='searchResults.html?q=${hotel.name}'" style="cursor: pointer;">
                            <div class="card mx-auto" style="width: 18rem;">
                                <img src="${imageUrl}" class="card-img-top object-fit-cover" height="200" alt="${hotel.name}" onerror="this.src='https://placehold.co/300x200?text=Image+Not+Found'">
                                <div class="card-body text-center">
                                    <h5 class="card-title fw-bold">${hotel.name}</h5>
                                    <p class="card-text text-muted mb-1">🏙️ ${hotel.city || 'Location Unknown'}</p>
                                    <p class="card-text fw-bold text-primary mb-0">$${hotel.lowRate || 0} / night</p>
                                </div>
                            </div>
                        </div>
                        `;
                    });
                    carouselContainer.innerHTML = searchCards;
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
  renderDeals();
  renderPopularSearches();
  handleSearchSubmission();
});