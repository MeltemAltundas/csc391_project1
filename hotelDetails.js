const topBookBtn = document.getElementById('topBookBtn');
const roomSection = document.getElementById('roomSelectionSection');
const roomsContainer = document.getElementById('roomsContainer');
const hotelCarouselInner = document.getElementById('hotelCarouselInner');

const selectedHotel = JSON.parse(sessionStorage.getItem('selectedHotel'));
console.log("Loaded Hotel Data:", selectedHotel);

const hotelName = document.getElementById('hotelName');
const hotelLocation = document.getElementById('hotelLocation');
const hotelDescription = document.getElementById('hotelDescription');
const hotelLocationText = document.getElementById('hotelLocationText');

if (selectedHotel) {
    if (hotelLocationText) {
        hotelLocationText.textContent = selectedHotel.addressline1 || selectedHotel.address1 || selectedHotel.city || 'Location information not available.';
    }

    if (hotelName) {
        hotelName.textContent = selectedHotel.hotel_name || selectedHotel.name || 'Hotel Name';
    }

    if (hotelLocation) {
        hotelLocation.innerHTML = (selectedHotel.city || '') + ', ' + (selectedHotel.country || selectedHotel.countryCode || '') + ' <a href="#">Show on Map</a>';
    }

    if (hotelDescription) {
        hotelDescription.textContent = selectedHotel.overview || selectedHotel.shortDescription || 'No description available.';
    }

    if (hotelCarouselInner) {
        const mainImage = selectedHotel.hotelImage || selectedHotel.photo1 || selectedHotel.thumbNailUrl || 'https://placehold.co/800x400?text=Hotel+Image';
        const carouselImages = [
            mainImage,
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=400&fit=crop", 
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=400&fit=crop"  
        ];

        let carouselHTML = '';
        carouselImages.forEach((img, index) => {
            const activeClass = index === 0 ? "active" : "";
            carouselHTML += `
                <div class="carousel-item ${activeClass}">
                    <img src="${img}" class="d-block w-100 object-fit-cover" style="height: 400px;" alt="Hotel Photo ${index + 1}">
                </div>
            `;
        });
        hotelCarouselInner.innerHTML = carouselHTML;
    }
}

let roomsRendered = false;

topBookBtn.addEventListener('click', function () {
    roomSection.classList.remove('d-none');


    roomSection.scrollIntoView({ behavior: 'smooth' });

    if (!roomsRendered) {
        const baseRate = selectedHotel && selectedHotel.lowRate ? selectedHotel.lowRate : 120;
        const deluxeRate = Math.round(baseRate * 1.5); // Deluxe is 50% more expensive
        const selectedNights = selectedHotel && selectedHotel.selectedNights ? selectedHotel.selectedNights : 1;

        roomsContainer.innerHTML = `
      <div class="room-card row align-items-center border rounded p-3 mb-3">
        <div class="col-md-3">
          <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop"
               class="img-fluid rounded room-img" alt="Standard Room">
        </div>

        <div class="col-md-3">
          <h4 class="mb-2">Standard Room</h4>
          <p class="mb-1">2 guests</p>
          <p class="mb-1">1 double bed</p>
          <p class="mb-0 text-success">Free cancellation</p>
        </div>

        <div class="col-md-2">
          <p class="mb-1"><strong>Breakfast</strong></p>
          <p class="mb-0">Included</p>
        </div>

        <div class="col-md-2">
          <label for="roomCount1" class="form-label">Rooms</label>
          <select id="roomCount1" class="form-select">
            <option value="">Choose</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        <div class="col-md-2 text-md-end mt-3 mt-md-0">
          <p class="mb-2"><strong>$${baseRate} / night</strong></p>
          <button class="btn btn-primary room-book-btn"
                  data-room-type="Standard Room"
                  data-price="${baseRate}"
                  data-select-id="roomCount1">
            Book now
          </button>
        </div>
      </div>

      <div class="room-card row align-items-center border rounded p-3 mb-3">
        <div class="col-md-3">
          <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&h=200&fit=crop"
               class="img-fluid rounded room-img" alt="Deluxe Room">
        </div>

        <div class="col-md-3">
          <h4 class="mb-2">Deluxe Room</h4>
          <p class="mb-1">3 guests</p>
          <p class="mb-1">1 king bed</p>
          <p class="mb-0 text-success">Pay later option</p>
        </div>

        <div class="col-md-2">
          <p class="mb-1"><strong>Breakfast</strong></p>
          <p class="mb-0">Included</p>
        </div>

        <div class="col-md-2">
          <label for="roomCount2" class="form-label">Rooms</label>
          <select id="roomCount2" class="form-select">
            <option value="">Choose</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>

        <div class="col-md-2 text-md-end mt-3 mt-md-0">
          <p class="mb-2"><strong>$${deluxeRate} / night</strong></p>
          <button class="btn btn-primary room-book-btn"
                  data-room-type="Deluxe Room"
                  data-price="${deluxeRate}"
                  data-select-id="roomCount2">
            Book now
          </button>
        </div>
      </div>
    `;

        roomsRendered = true;
    }
});

roomsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('room-book-btn')) {
        const button = event.target;
        const roomType = button.dataset.roomType;
        const pricePerNight = Number(button.dataset.price);
        const selectId = button.dataset.selectId;

        const roomCountSelect = document.getElementById(selectId);
        const roomCount = Number(roomCountSelect.value);

        if (!roomCount) {
            alert('Please select room count first.');
            return;
        }

        const selectedNights = selectedHotel && selectedHotel.selectedNights ? selectedHotel.selectedNights : 1;
        const total = pricePerNight * roomCount * selectedNights;

        const selectedRoomData = {
            roomType: roomType,
            roomCount: roomCount,
            pricePerNight: pricePerNight,
            totalPerNight: total
        };

        sessionStorage.setItem('selectedRoom', JSON.stringify(selectedRoomData));

        window.location.href = 'payment.html';
    }
});