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
        <div class="carousel-item ${activeClass}">
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

document.addEventListener('DOMContentLoaded', function() {
  renderDeals();
  renderPopularSearches();
});