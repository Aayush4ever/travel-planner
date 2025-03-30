import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getDatabase, ref, push, set, get } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

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

function loadFeedback() {
    const feedbackList = document.getElementById("feedback-list");
    if (!feedbackList) return;

    const feedbackRef = ref(db, "feedback");

    get(feedbackRef)
        .then((snapshot) => {
            feedbackList.innerHTML = "";
            if (snapshot.exists()) {
                const feedbackData = snapshot.val();
                Object.values(feedbackData).forEach((feedback) => {
                    const feedbackElement = document.createElement("div");
                    feedbackElement.classList.add("feedback-card");

                    const formattedDate = new Date(feedback.timestamp).toLocaleString();

                    feedbackElement.innerHTML = `
                        <p class="feedback-name"><strong>${feedback.name}</strong></p>
                        <p class="feedback-date">${formattedDate}</p>
                        <p class="feedback-text">${feedback.feedback}</p>
                    `;

                    feedbackList.appendChild(feedbackElement);
                });
            } else {
                feedbackList.innerHTML = "<p>No reviews yet.</p>";
            }
        })
        .catch((error) => {
            console.error("Error loading feedback:", error);
        });
}

loadFeedback(); 

const feedbackForm = document.getElementById("feedback-form");
if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            alert("You need to log in to submit feedback.");
            return;
        }

        const feedbackText = document.getElementById("feedback-text").value;
        const feedbackName = document.getElementById("feedback-name").value;

        if (!feedbackName.trim()) {
            alert("Please enter your name.");
            return;
        }

        const feedbackRef = push(ref(db, "feedback"));
        set(feedbackRef, {
            userId: user.uid,
            name: feedbackName,
            feedback: feedbackText,
            timestamp: new Date().toISOString(),
        })
            .then(() => {
                feedbackForm.reset();
                alert("Thank you for your feedback!");
                loadFeedback();
            })
            .catch((error) => {
                console.error("Error submitting feedback:", error);
            });
    });
}
