const selectedRoom = JSON.parse(sessionStorage.getItem('selectedRoom'));
const selectedHotel = JSON.parse(sessionStorage.getItem('selectedHotel'));
console.log(selectedRoom);
console.log(selectedHotel);

if (!selectedRoom) {
    console.log('No selected room data found.');
}

const paymentForm = document.getElementById('paymentForm');

const bookingSummary = document.getElementById('bookingSummary');
const summaryRoomType = document.getElementById('summaryRoomType');
const summaryRoomCount = document.getElementById('summaryRoomCount');
const summaryPricePerNight = document.getElementById('summaryPricePerNight');
const summaryTotal = document.getElementById('summaryTotal');
const summaryHotelName = document.getElementById('summaryHotelName');

if (selectedRoom) {
    bookingSummary.classList.remove('d-none');
    summaryRoomType.textContent = selectedRoom.roomType;
    summaryRoomCount.textContent = selectedRoom.roomCount;
    summaryPricePerNight.textContent = selectedRoom.pricePerNight;
    summaryTotal.textContent = selectedRoom.totalPerNight;
    if (selectedHotel) {
        summaryHotelName.textContent = selectedHotel.hotel_name || selectedHotel.name;
    }
}

paymentForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const cardName = document.getElementById('cname').value;
    const cardNumber = document.getElementById('cnumber').value;
    const expiryDate = document.getElementById('expadate').value;
    const cvc = document.getElementById('cvc').value;

    const approve1 = document.getElementById('approve1').checked;
    const approve2 = document.getElementById('approve2').checked;
    const approve3 = document.getElementById('approve3').checked;

    if (!approve1 || !approve2 || !approve3) {
        alert('Please approve all required checkboxes.');
        return;
    }

    const reservation = {
        hotel: {
            name: selectedHotel ? (selectedHotel.hotel_name || selectedHotel.name) : null,
            address: selectedHotel
                ? (selectedHotel.addressline1 || selectedHotel.address1 || selectedHotel.city || '')
                : null
        },
        reservationData: {
            roomCount: selectedRoom ? selectedRoom.roomCount : null,
            roomType: selectedRoom ? selectedRoom.roomType : null,
            totalPerNight: selectedRoom ? selectedRoom.totalPerNight : null,
            pricePerNight: selectedRoom ? selectedRoom.pricePerNight : null,
        },
        guestData: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone
        },
        paymentInformation: {
            cardInfo: {
                cardNumber: cardNumber,
                cardHolder: cardName,
                expiryDate: expiryDate,
                cvv: cvc
            },
            paymentMethod: 'Credit Card',
            totalAmount: selectedRoom ? selectedRoom.totalPerNight : null
        }
    };

    sessionStorage.setItem('reservation', JSON.stringify(reservation));

    console.log(reservation);

    paymentForm.reset();

    alert('Booking completed successfully.');
});