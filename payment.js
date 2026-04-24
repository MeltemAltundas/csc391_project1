const selectedHotel = JSON.parse(sessionStorage.getItem('selectedHotel'));

const paymentForm = document.getElementById('paymentForm');
const bookingSummary = document.getElementById('bookingSummary');
const summaryRoomType = document.getElementById('summaryRoomType');
const summaryRoomCount = document.getElementById('summaryRoomCount');
const summaryPricePerNight = document.getElementById('summaryPricePerNight');
const summaryTotal = document.getElementById('summaryTotal');
const summaryHotelName = document.getElementById('summaryHotelName');

if (selectedHotel) {
    bookingSummary.classList.remove('d-none');
    summaryHotelName.textContent = selectedHotel.hotel_name || selectedHotel.name;
    summaryRoomType.textContent = selectedHotel.roomType || 'N/A';
    summaryRoomCount.textContent = selectedHotel.roomCount || 1;
    summaryPricePerNight.textContent = selectedHotel.pricePerNight || 0;
    summaryTotal.textContent = selectedHotel.totalPrice || 0;
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
            name: selectedHotel ? (selectedHotel.hotel_name || selectedHotel.name) : 'Unknown Hotel',
            address: selectedHotel ? (selectedHotel.addressline1 || selectedHotel.address1 || selectedHotel.city || '') : 'Unknown Address'
        },
        reservationData: {
            roomCount: selectedHotel ? selectedHotel.roomCount : 1,
            guestCount: selectedHotel ? selectedHotel.selectedGuests : 1,
            roomType: selectedHotel ? selectedHotel.roomType : 'Standard',
            checkInDate: selectedHotel.checkInDate || sessionStorage.getItem('checkInDate') || '',
            checkOutDate: selectedHotel.checkOutDate || sessionStorage.getItem('checkOutDate') || '',
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
            totalAmount: selectedHotel ? selectedHotel.totalPrice : 0
        }
    };

    sessionStorage.setItem('reservation', JSON.stringify(reservation));

    paymentForm.reset();
    alert('Booking completed successfully! Your reservation has been saved.');
});