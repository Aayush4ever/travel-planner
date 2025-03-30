import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBKdv6VdVknPJ2sR6JEvLFktSlVn1fG_QY",
  authDomain: "travelitinery-245d5.firebaseapp.com",
  projectId: "travelitinery-245d5",
  storageBucket: "travelitinery-245d5.firebasestorage.app",
  messagingSenderId: "252523839514",
  appId: "1:252523839514:web:9cc790b146ae70459451a3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const cardTitle = card.querySelector("h3").textContent.toLowerCase();

      let modalId = "";
      if (cardTitle.includes("flight")) {
        modalId = "flightModal";
      } else if (cardTitle.includes("hotel")) {
        modalId = "hotelModal";
      } else if (cardTitle.includes("trip")) {
        modalId = "tripModal";
      }

      openModal(modalId);
    });
  });

  window.addEventListener("click", (e) => {
    const modals = document.querySelectorAll(".form-modal");
    modals.forEach((modal) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchFlightDetails(user.uid);
      fetchHotelDetails(user.uid);
      fetchTripDetails(user.uid);
    }
  });
});

//  Function to Open Modals
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
  } else {
    console.error(`Modal with ID '${modalId}' not found.`);
  }
}
window.openModal = openModal;

// Function to Close Modals
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  } else {
    console.error(`Modal with ID '${modalId}' not found.`);
  }
}
window.closeModal = closeModal;

//  Fetch and Display Flight Details from Firebase
function fetchFlightDetails(userId) {
  const flightList = document.getElementById("flight-list");
  flightList.innerHTML = ""; 

  const userFlightsRef = ref(db, `flights/${userId}`);

  onValue(userFlightsRef, (snapshot) => {
    flightList.innerHTML = ""; 

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const flight = childSnapshot.val();

        const li = document.createElement("li");
        li.innerHTML = `
                    <strong>PNR:</strong> ${flight.pnr} | 
                    <strong>From:</strong> ${flight.from} → 
                    <strong>To:</strong> ${flight.to} | 
                    <strong>Date:</strong> ${flight.date} | 
                    <strong>Arrival:</strong> ${flight.arrivalTime} | 
                    <strong>Departure:</strong> ${flight.departureTime}
                `;
        flightList.appendChild(li);
      });
    } else {
      flightList.innerHTML = "<li>No flight details found.</li>";
    }
  });
}

// Fetch and Display Hotel Details from Firebase
function fetchHotelDetails(userId) {
  const hotelList = document.getElementById("hotel-list");
  hotelList.innerHTML = ""; 

  const userHotelsRef = ref(db, `hotels/${userId}`);

  onValue(userHotelsRef, (snapshot) => {
    hotelList.innerHTML = "";

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const hotel = childSnapshot.val();

        const li = document.createElement("li");
        li.innerHTML = `
                    <strong>Hotel:</strong> ${hotel.name} | 
                    <strong>Location:</strong> ${hotel.location} | 
                    <strong>Check-in:</strong> ${hotel.checkIn} | 
                    <strong>Check-out:</strong> ${hotel.checkOut} | 
                    <strong>Booking Ref:</strong> ${hotel.bookingRef}
                `;
        hotelList.appendChild(li);
      });
    } else {
      hotelList.innerHTML = "<li>No hotel details found.</li>";
    }
  });
}

function fetchTripDetails(userId) {
  const tripList = document.getElementById("trip-list");
  tripList.innerHTML = ""; 

  const userTripsRef = ref(db, `trips/${userId}`);

  onValue(userTripsRef, (snapshot) => {
    tripList.innerHTML = ""; 

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const trip = childSnapshot.val();

        const li = document.createElement("li");
        li.innerHTML = `
                    <strong>Trip:</strong> ${trip.name} | 
                    <strong>Destination:</strong> ${trip.destination} | 
                    <strong>Start:</strong> ${trip.startDate} | 
                    <strong>End:</strong> ${trip.endDate} | 
                    <strong>Notes:</strong> ${trip.notes || "N/A"}
                `;
        tripList.appendChild(li);
      });
    } else {
      tripList.innerHTML = "<li>No trip details found.</li>";
    }
  });
}
