import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getDatabase, ref, push, set, get, remove } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBKdv6VdVknPJ2sR6JEvLFktSlVn1fG_QY",
    authDomain: "travelitinery-245d5.firebaseapp.com",
    databaseURL: "https://travelitinery-245d5-default-rtdb.firebaseio.com/", 
    projectId: "travelitinery-245d5",
    storageBucket: "travelitinery-245d5.firebasestorage.app",
    messagingSenderId: "252523839514",
    appId: "1:252523839514:web:9cc790b146ae70459451a3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user.uid);
        loadExpenses(user.uid);
    } else {
        console.log("No user logged in");
        window.location.href = "index.html"; 
    }
});

// Add Expense
document.getElementById("add-expense").addEventListener("click", () => {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to add expenses.");
        return;
    }

    const userId = user.uid;
    const type = document.getElementById("expense-type").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);

    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const expenseRef = push(ref(db, `expenses/${userId}`));

    set(expenseRef, {
        type: type,
        amount: amount,
        timestamp: new Date().toISOString()
    })
    .then(() => {
        console.log("Expense added successfully!");
        document.getElementById("expense-amount").value = ""; 
        loadExpenses(userId); 
    })
    .catch((error) => {
        console.error("Error adding expense:", error);
    });
});

function loadExpenses(userId) {
    const expensesRef = ref(db, `expenses/${userId}`);

    get(expensesRef).then((snapshot) => {
        const expenseTableBody = document.getElementById("expense-table-body");
        const totalExpenseRow = document.getElementById("total-expense-row");

        expenseTableBody.innerHTML = ""; 
        let total = 0;

        if (snapshot.exists()) {
            const expenses = snapshot.val();

            Object.keys(expenses).forEach((key) => {
                const expense = expenses[key];
                total += expense.amount; 

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${expense.type}</td>
                    <td>$${expense.amount.toFixed(2)}</td>
                    <td><button class="delete-btn" onclick="deleteExpense('${userId}', '${key}')">Delete</button></td>
                `;

                expenseTableBody.appendChild(row);
            });
        } else {
            expenseTableBody.innerHTML = "<tr><td colspan='3' style='text-align:center;'>No expenses found.</td></tr>";
        }

        totalExpenseRow.innerHTML = `
            <td><strong>Total</strong></td>
            <td><strong>$${total.toFixed(2)}</strong></td>
            <td></td>
        `;
    })
    .catch((error) => {
        console.error("Error loading expenses:", error);
    });
}


function deleteExpense(userId, expenseId) {
    const expenseRef = ref(db, `expenses/${userId}/${expenseId}`);

    remove(expenseRef)
    .then(() => {
        console.log("Expense deleted successfully!");
        loadExpenses(userId); 
    })
    .catch((error) => {
        console.error("Error deleting expense:", error);
    });
}
window.deleteExpense = deleteExpense;
