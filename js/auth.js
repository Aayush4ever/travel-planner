import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

import {
  ref,
  push,
  set,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

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
  const flightForm = document.querySelector("#flightModal form");
  const hotelForm = document.querySelector("#hotelModal form");
  const tripForm = document.querySelector("#tripModal form");

  flightForm.addEventListener("submit", (e) => {
    e.preventDefault(); 

    // Get user authentication status
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;

        const pnr = flightForm.querySelector(
          "input[placeholder='Enter PNR']"
        ).value;
        const arrivalTime =
          flightForm.querySelector("input[type='time']").value;
        const departureTime =
          flightForm.querySelectorAll("input[type='time']")[1].value;
        const date = flightForm.querySelector("input[type='date']").value;
        const from = flightForm.querySelector(
          "input[placeholder='Enter Departure City']"
        ).value;
        const to = flightForm.querySelector(
          "input[placeholder='Enter Destination City']"
        ).value;

        const flightRef = push(ref(db, `flights/${userId}`));

        set(flightRef, {
          pnr,
          arrivalTime,
          departureTime,
          date,
          from,
          to,
        })
          .then(() => {
            alert("Flight details saved successfully!");
            flightForm.reset(); 
            closeModal("flightModal");
          })
          .catch((error) => {
            console.error("Error saving flight details: ", error);
            alert("Failed to save flight details. Try again.");
          });
      } else {
        alert("You must be logged in to save flight details.");
      }
    });
  });

  hotelForm.addEventListener("submit", (e) => {
    e.preventDefault(); 

    // Get user authentication status
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;

        const name = hotelForm.querySelector(
          "input[placeholder='Enter Hotel Name']"
        ).value;
        const checkIn = hotelForm.querySelector("input[type='date']").value;
        const checkOut =
          hotelForm.querySelectorAll("input[type='date']")[1].value;
        const location = hotelForm.querySelector(
          "input[placeholder='Enter Location']"
        ).value;
        const bookingRef = hotelForm.querySelector(
          "input[placeholder='Enter Booking Reference']"
        ).value;

        const hotelRef = push(ref(db, `hotels/${userId}`));

        set(hotelRef, {
          name,
          checkIn,
          checkOut,
          location,
          bookingRef,
        })
          .then(() => {
            alert("Hotel details saved successfully!");
            hotelForm.reset(); 
            closeModal("hotelModal"); 
          })
          .catch((error) => {
            console.error("Error saving hotel details: ", error);
            alert("Failed to save hotel details. Try again.");
          });
      } else {
        alert("You must be logged in to save hotel details.");
      }
    });
  });

  tripForm.addEventListener("submit", (e) => {
    e.preventDefault(); 

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;

        // Capture trip details
        const name = tripForm.querySelector(
          "input[placeholder='Enter Trip Name']"
        ).value;
        const startDate = tripForm.querySelector("input[type='date']").value;
        const endDate =
          tripForm.querySelectorAll("input[type='date']")[1].value;
        const destination = tripForm.querySelector(
          "input[placeholder='Enter Destination']"
        ).value;
        const notes = tripForm.querySelector("textarea").value;

        const tripRef = push(ref(db, `trips/${userId}`));

        set(tripRef, {
          name,
          startDate,
          endDate,
          destination,
          notes,
        })
          .then(() => {
            alert("Trip details saved successfully!");
            tripForm.reset(); 
            closeModal("tripModal"); 
          })
          .catch((error) => {
            console.error("Error saving trip details: ", error);
            alert("Failed to save trip details. Try again.");
          });
      } else {
        alert("You must be logged in to save trip details.");
      }
    });
  });
});

// Signup Function
window.signup = () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("User registered successfully!");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      document.getElementById("error-message").innerText = error.message;
    });
};

// Login Function
window.login = () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful!");
      window.location.href = "dashboard.html"; 
    })
    .catch((error) => {
      document.getElementById("error-message").innerText = error.message;
    });
};

window.logout = () => {
  signOut(auth).then(() => {
    alert("User logged out!");
    window.location.href = "index.html";
  });
};
