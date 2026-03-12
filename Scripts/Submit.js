function calculatePricing() {
	let subtotal = 0;

	const table = document.getElementById('orderTable');
	rows = table.rows;

    for(let i = 1; i < rows.length; i++) {
        const priceCell = rows[i].cells[3];
        const priceText = priceCell.textContent.replace('$', '');
        const price = parseFloat(priceText);
        subtotal += price;
    }

    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    }
    if (document.getElementById('tax')) {
        document.getElementById('tax').textContent = `Tax: $${tax.toFixed(2)}`;
    }
    if (document.getElementById('total')) {
        document.getElementById('total').textContent = `Total: $${total.toFixed(2)}`;
    }

    return { subtotal, tax, total };
}

document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('orderTable');
    if (table.rows.length > 1) {
        const { subtotal, tax, total } = calculatePricing();

        document.getElementById('subtotal').textContent = `Subtotal: $${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `Tax: $${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `Total: $${total.toFixed(2)}`;
    }
});


function submitOrder() {
    const name = document.getElementById('Name').value.trim();
    const phone = document.getElementById('Phone').value.trim();
    const email = document.getElementById('Email').value.trim();
    const address = document.getElementById('Address').value.trim();
    const cardNumber = document.getElementById('payment').value.trim();
    const expDate = document.getElementById('expDate').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    if (!(
        validName(name) &&
        validPhone(phone) &&
        validEmail(email) &&
        validAddress(address) &&
        validCardNumber(cardNumber) &&
        validExpDate(expDate) &&
        validCVV(cvv)
    )) {
        alert('Submitted info invalid. Please correct the highlighted fields and try again.');
        return;
    }

    const customer = {
        name,
        phone,
        email,
        address
    };

    const payment = {
        cardNumber,
        expDate,
        cvv
    };

    const order = [];
    const table = document.getElementById('orderTable');
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];

        const item = row.cells[0]?.textContent || '';
        
        let quantity = 1;
        const qtyCell = row.cells[1];
        if (qtyCell) {
            const qtySpan = qtyCell.querySelector('.qty-value');
            if (qtySpan) quantity = parseInt(qtySpan.textContent, 10) || 1;
        }
        
        let addons = {};
        const addonCell = row.cells[2];
        if (addonCell) {

            const mealAddon = addonCell.querySelector('#mealAddon');
            const drinkAddon = addonCell.querySelector('#drinkAddon');
            if (mealAddon && mealAddon.value !== 'Side') addons.meal = mealAddon.value;
            if (drinkAddon && drinkAddon.value !== 'Drink') addons.drink = drinkAddon.value;

            const modDivs = addonCell.querySelectorAll('.addon-modifiers, .modifiers-container > div');
            modDivs.forEach(div => {
                const spans = div.querySelectorAll('span');
                for (let n = 0; n < spans.length; n += 3) {
                    const modName = spans[n]?.textContent;
                    const modQty = spans[n+2]?.textContent;
                    if (modName && modQty) addons[modName.toLowerCase()] = parseInt(modQty, 10) || 0;
                }
            });
        }
        if (item) {
            order.push({ item, quantity, addons });
        }
    }
    const orderData = { customer, payment, order };
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    alert('Order submitted!');
}

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('placeOrderBtn');
    if (btn) btn.onclick = submitOrder;
});