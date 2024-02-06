// Retrieve saved data from local storage
let savedData = JSON.parse(localStorage.getItem('cryptoData')) || [];

// Display saved data
const tableBody = document.getElementById('savingsTableBody');
savedData.forEach(data => {
    const row = tableBody.insertRow();
    const cryptoCell = row.insertCell(0);
    const amountCell = row.insertCell(1);
    const convertedAmountEuroCell = row.insertCell(2);
    const convertedAmountUAHCell = row.insertCell(3);

    cryptoCell.textContent = data.crypto.toUpperCase();
    amountCell.textContent = data.amount.toFixed(2);
    convertedAmountEuroCell.textContent = (data.convertedAmountEuro || '').toFixed(2);
    convertedAmountUAHCell.textContent = (data.convertedAmountUAH || '').toFixed(2);
});

// Autocomplete cryptocurrencies
const cryptocurrencies = ['btc', 'eth', 'sol', 'matic', 'usdc', 'xpr', 'sweat', 'trx', 'mnt', 'wkn', '1inch', '1sol', '3p', '5ire', 'aave', 'acs', 'afg', 'agiv', 'aidoge', 'aki', 'doge', 'grape', 'mavia', 'fire', 'jup', 'arty', 'mxm'];
const newCryptoInput = document.getElementById('newCrypto');
newCryptoInput.addEventListener('input', function () {
    const userInput = this.value.toLowerCase();
    const suggestions = cryptocurrencies.filter(crypto => crypto.startsWith(userInput));
    if (userInput.length === 0) {
        newCryptoInput.removeAttribute('list');
    } else {
        const datalist = document.createElement('datalist');
        datalist.id = 'cryptoSuggestions';
        suggestions.forEach(suggestion => {
            const option = document.createElement('option');
            option.value = suggestion;
            datalist.appendChild(option);
        });
        document.body.appendChild(datalist);
        newCryptoInput.setAttribute('list', 'cryptoSuggestions');
    }
});

async function addNewCrypto() {
    const newCrypto = document.getElementById('newCrypto').value.trim().toLowerCase();
    const newAmount = parseFloat(document.getElementById('newAmount').value);

    // Fetch rate from CoinGecko API based on selected cryptocurrency
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${newCrypto}&vs_currencies=usd,eur,uah`);
    const data = await response.json();

    if (!data[newCrypto]) {
        alert('Unable to find data for the selected cryptocurrency. Please try again.');
        return;
    }

    const rateUSD = data[newCrypto].usd;
    const rateEUR = data[newCrypto].eur;
    const rateUAH = data[newCrypto].uah;

    // Calculate converted amounts
    const convertedAmountUSD = newAmount;
    const convertedAmountEuro = newAmount / rateUSD * rateEUR;
    const convertedAmountUAH = newAmount / rateUSD * rateUAH;

    // Add new data to savedData array
    savedData.push({
        crypto: newCrypto,
        amount: newAmount,
        convertedAmountEuro: convertedAmountEuro,
        convertedAmountUAH: convertedAmountUAH
    });

    // Save updated data to local storage
    localStorage.setItem('cryptoData', JSON.stringify(savedData));

    // Reload the page to reflect changes
    location.reload();
}

function clearSavings() {
    localStorage.removeItem('cryptoData');
    location.reload(); // Reload the page to reflect changes
}

async function convertCurrency() {
    const amount = parseFloat(document.getElementById('conversionAmount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    // Fetch rate from CoinGecko API based on selected currencies
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=${toCurrency}`);
    const data = await response.json();

    if (!data[fromCurrency] || !data[fromCurrency][toCurrency]) {
        alert('Unable to convert currency. Please try again.');
        return;
    }

    const rate = data[fromCurrency][toCurrency];

    // Calculate converted amount
    const convertedAmount = amount * rate;

    alert(`${amount} ${fromCurrency.toUpperCase()} is equal to ${convertedAmount.toFixed(2)} ${toCurrency.toUpperCase()}`);
}