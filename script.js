document.addEventListener('DOMContentLoaded', () => {
    const ul1Items = document.querySelectorAll('.ul1 li');
    const ul2Items = document.querySelectorAll('.ul2 li');
    const fromAmountInput = document.getElementById('fromAmount');
    const toAmountInput = document.getElementById('toAmount');
    const rate1 = document.querySelector('.rate1');
    const rate2 = document.querySelector('.rate2');
    let exchangeRate;

    let fromCurrency = 'RUB';
    let toCurrency = 'USD';

    fromAmountInput.value = '1';

    ul1Items.forEach(item => {
        item.addEventListener('click', function () {
            fromCurrency = item.textContent.trim();
            fetchExchangeRate();
            toggleSelectedClass(ul1Items, item);
        });
    });

    ul2Items.forEach(item => {
        item.addEventListener('click', function () {
            toCurrency = item.textContent.trim();
            fetchExchangeRate();
            toggleSelectedClass(ul2Items, item);
        });
    });

    fromAmountInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^\d.]/g, ''); 
        updateToAmount();
    });

    toAmountInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^\d.]/g, ''); 
        updateFromAmount();

        
        if (parseFloat(this.value) === 0) {
            this.value = '';
        }
    });

    fromAmountInput.addEventListener('focus', function () {
        if (this.value === '1') {
            this.value = '';
        }
    });

    toAmountInput.addEventListener('focus', function () {
        if (this.value === '0.0000') {
            this.value = '';
        }
    });

    function toggleSelectedClass(items, selectedItem) {
        items.forEach(item => {
            item.classList.remove("selected");
        });

        selectedItem.classList.add("selected");
    }

    async function fetchExchangeRate() {
        if (fromCurrency && toCurrency) {
            const accessKey = '5a73454c7960f4bfacc5f29b';
            const url = `https://v6.exchangerate-api.com/v6/${accessKey}/latest/${fromCurrency}`;

            try {
                const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();

                    if (data && data.conversion_rates && data.conversion_rates[toCurrency] !== undefined) {
                        exchangeRate = data.conversion_rates[toCurrency];
                        updateToAmount();
                        updateRates();
                    } else {
                        console.error('Invalid response or currency code.');
                    }
                } else {
                    console.error(`Error: ${response.status} - ${response.statusText}`);
                }
            } catch (err) {
                console.error(err);
            }
        }
    }

    function updateToAmount() {
        if (Number(fromAmountInput.value) >= 0 && exchangeRate) {
            toAmountInput.value = (fromAmountInput.value * exchangeRate).toFixed(4);
        }
    }

    function updateFromAmount() {
        if (Number(toAmountInput.value) >= 0 && exchangeRate) {
            fromAmountInput.value = (toAmountInput.value / exchangeRate).toFixed(4);
        }
    }

    function updateRates() {
        rate1.textContent = `1 ${fromCurrency} = ${exchangeRate.toFixed(4)} ${toCurrency}`;
        rate2.textContent = `1 ${toCurrency} = ${(1 / exchangeRate).toFixed(4)} ${fromCurrency}`;
    }

    function handleOnline() {
        const noInternetMessage = document.getElementById('noInternetMessage');
        noInternetMessage.style.display = 'none';

        fetchExchangeRate().then(() => {
            updateRates();
        });
    }
    function handleOffline() {
        const noInternetMessage = document.getElementById('noInternetMessage');
        noInternetMessage.style.display = 'block';
    }

    if (navigator.onLine) {
        handleOnline();
    } else {
        handleOffline();
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
});