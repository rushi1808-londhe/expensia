let transactions = [];
let rates = {};
let currentCurrency = "INR";

async function loadCurrencies() {
    let response = await fetch("https://open.er-api.com/v6/latest/USD");
    let data = await response.json();

    rates = data.rates;

    const currencySelect = document.getElementById("currencySelect");

    Object.keys(rates).forEach(curr => {
        const option = document.createElement("option");
        option.value = curr;
        option.innerText = curr;
        currencySelect.appendChild(option);
    });

    currencySelect.value = "INR";
    currentCurrency = "INR";

    currencySelect.addEventListener("change", () => {
        currentCurrency = currencySelect.value;
        render();
    });
}

function convertBetweenCurrencies(amount, from, to) {
    if (from === to) return amount;
    return (amount * (rates[to] / rates[from])).toFixed(2);
}

function render() {
    const historyBox = document.getElementById("historyBox");
    historyBox.innerHTML = "";

    let credit = 0;
    let debit = 0;

    transactions.forEach((t, index) => {
        const convertedAmount = convertBetweenCurrencies(t.amount, t.currency, currentCurrency);

        if (t.type === "credit") credit += Number(convertedAmount);
        else debit += Number(convertedAmount);

        const row = document.createElement("div");
        row.className = "d-flex justify-content-between p-2 border-bottom align-items-center transaction-row";

        row.innerHTML = `
            <p class="mb-0 w-25 text-center">${t.title}</p>
            <p class="mb-0 w-25 text-center">${convertedAmount} ${currentCurrency}</p>
            <p class="mb-0 w-25 text-center ${t.type === "credit" ? "text-success fw-bold" : "text-danger fw-bold"}">
                ${t.type === "credit" ? "+ Credit" : "- Debit"}
            </p>
            <p class="mb-0 w-25 text-center">${t.date}</p>
            <button class="delete-btn" onclick="deleteTransaction(${index})">
                <i class="bi bi-trash"></i>
            </button>
        `;

        historyBox.appendChild(row);
    });

    document.getElementById("creditAmount").innerText = "+" + credit.toFixed(2);
    document.getElementById("debitAmount").innerText = "-" + debit.toFixed(2);
    document.getElementById("balanceAmount").innerText = (credit - debit).toFixed(2);
}

function addTransaction() {
    const title = document.getElementById("titleInput").value;
    const amount = Number(document.getElementById("amountInput").value);
    
    const type = document.getElementById("typeInput").value; // UPDATED
    const date = document.getElementById("dateInput").value;

    if (!title || amount <= 0 || !type || !date) {
        alert("Fill all fields");
        return;
    }

    transactions.push({
        title,
        amount,
        type,
        date,
        currency: currentCurrency
    });

    document.getElementById("titleInput").value = "";
    document.getElementById("amountInput").value = "";
    document.getElementById("typeInput").value = "";   // UPDATED
    document.getElementById("dateInput").value = "";

    render();
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    render();
}

loadCurrencies();
