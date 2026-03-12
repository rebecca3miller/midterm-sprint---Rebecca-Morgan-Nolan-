function loadMenuItems(callback) {
    fetch('../JSON/Menu.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load menu');
            return response.json();
        })
        .then(data => {
            menuItems = data.map(item => new menuItem(item.name, item.price, item.category));
            if (callback) callback();
        })
        .catch(error => {
            console.error('Error loading menu:', error);
        });
}

function menuItem(name, price, category) {
    this.name = name;
    this.price = price;
    this.category = category;
}


function Table() {
    const table = document.getElementById('orderTable');
    if (!document.getElementById('menuDropdown')) {
        const dropdownRow = document.createElement('tr');
        const dropdownCell = document.createElement('td');
        const dropdown = document.createElement('select');
        dropdown.id = 'menuDropdown';

        const defaultOption = document.createElement('option');
        defaultOption.text = 'Select an item';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        dropdown.add(defaultOption);

        menuItems.forEach(item => {
            const option = document.createElement('option');
            option.text = item.name;
            dropdown.add(option);
        });

        dropdownCell.appendChild(dropdown);
        dropdownRow.appendChild(dropdownCell);
        table.appendChild(dropdownRow);

        dropdown.addEventListener('change', function() {
            const orderRows = Array.from(table.rows).filter(row => !row.contains(dropdown));
            if (orderRows.length >= 25) {
                alert('Maximum of 25 orders reached.');
                dropdown.value = 'Select an item';
                return;
            }
            if (dropdown.value !== 'Select an item') {
                addOrderRow(dropdown.value);
                dropdown.value = 'Select an item';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadMenuItems(Table);
});


function adjustQuantity(onChange) {
    let itemQuantity = 1;
    let addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.textContent = '+';
    addBtn.className = 'qty-btn';
    let numSpan = document.createElement('span');
    numSpan.className = 'qty-value';
    numSpan.textContent = itemQuantity;
    let subtractBtn = document.createElement('button');
    subtractBtn.type = 'button';
    subtractBtn.textContent = '-';
    subtractBtn.className = 'qty-btn';

    function updateQuantity(newQty) {
        itemQuantity = newQty;
        numSpan.textContent = itemQuantity;
        if (onChange) onChange(itemQuantity);
    }

    addBtn.addEventListener('click', function() {
        updateQuantity(itemQuantity + 1);
    });
    subtractBtn.addEventListener('click', function() {
        if (itemQuantity > 0) {
            updateQuantity(itemQuantity - 1);
            if (itemQuantity === 0) {
                const row = subtractBtn.closest('tr');
                if (row) row.remove();
            }
        }
    });
    let quantityCell = document.createElement('td');
    quantityCell.appendChild(subtractBtn);
    quantityCell.appendChild(numSpan);
    quantityCell.appendChild(addBtn);
    return quantityCell;
}

function addonDropdown(category, updateAddonPrice) {
    const addonCell = document.createElement('td');
    let mealAddonSelected = false;
    let drinkAddonSelected = false;
    if (category === 'Meal') {
        const mealDropdown = document.createElement('select');
        mealDropdown.id = 'addonDropdownMeal';
        const mealDefault = document.createElement('option');
        mealDefault.text = 'Side';
        mealDefault.disabled = true;
        mealDefault.selected = true;
        mealDropdown.add(mealDefault);
        ['Fries', 'Salad', 'Soup'].forEach(addon => {
            const option = document.createElement('option');
            option.text = addon;
            mealDropdown.add(option);
        });

        const drinkDropdown = document.createElement('select');
        drinkDropdown.id = 'addonDropdownDrink';
        const drinkDefault = document.createElement('option');
        drinkDefault.text = 'Drink';
        drinkDefault.disabled = true;
        drinkDefault.selected = true;
        drinkDropdown.add(drinkDefault);
        ['Coffee', 'Tea', 'Juice'].forEach(addon => {
            const option = document.createElement('option');
            option.text = addon;
            drinkDropdown.add(option);
        });

        const modifiersContainer = document.createElement('div');
        modifiersContainer.className = 'modifiers-container';

        mealDropdown.addEventListener('change', function() {
            mealAddonSelected = mealDropdown.value !== 'Side';
            updateAddonPrice(mealAddonSelected, drinkAddonSelected);
        });
        drinkDropdown.addEventListener('change', function() {
            drinkAddonSelected = drinkDropdown.value !== 'Drink';
            updateAddonPrice(mealAddonSelected, drinkAddonSelected);
            
            modifiersContainer.innerHTML = '';
            if (drinkDropdown.value !== 'Drink') {
                const { dropdown } = addonModifiers();
                modifiersContainer.appendChild(dropdown);
            }
        });

        mealDropdown.id = 'mealAddon';
        drinkDropdown.id = 'drinkAddon';

        addonCell.appendChild(mealDropdown);
        addonCell.appendChild(drinkDropdown);
        addonCell.appendChild(modifiersContainer);
        return addonCell;
    } else if (category === 'Drink') {
        const { dropdown } = addonModifiers();
        dropdown.classList.add('addon-modifiers');
        addonCell.appendChild(dropdown);
        return addonCell;
    } else {
        addonCell.textContent = 'No add-ons';
        addonCell.style.color = '#888';
        addonCell.style.fontStyle = 'italic';
        return addonCell;
    }
}


function addonModifiers(modifiers = ["Milk", "Sugar"]) {
    const dropdown = document.createElement('div');
    const modOption = [];
    modifiers.forEach(modName => {
        let qty = 0;
        const label = document.createElement('span');
        label.textContent = modName;
        label.style.marginRight = '8px';

        const minus = document.createElement('button');
        minus.textContent = '-';
        minus.className = 'modifier-btn';
        minus.style.marginRight = '4px';

        const qtySpan = document.createElement('span');
        qtySpan.className = 'modifier-value';
        qtySpan.textContent = qty;
        qtySpan.style.marginRight = '4px';

        const plus = document.createElement('button');
        plus.textContent = '+';
        plus.className = 'modifier-btn';
        plus.style.marginRight = '12px';

        minus.addEventListener('click', function() {
            if (qty > 0) {
                qty--;
                qtySpan.textContent = qty;
            }
        });
        plus.addEventListener('click', function() {
            if (qty < 9) {
                qty++;
                qtySpan.textContent = qty;
            }
        });

        dropdown.appendChild(label);
        dropdown.appendChild(minus);
        dropdown.appendChild(qtySpan);
        dropdown.appendChild(plus);
    });
    return { dropdown, modOption };
}

function addOrderRow(itemName) {
    const table = document.getElementById('orderTable');
    const item = menuItems.find(item => item.name === itemName);
    if (!item) return;
    const row = document.createElement('tr');

    const itemCell = document.createElement('td');
    itemCell.textContent = itemName;

    const priceCell = document.createElement('td');
    priceCell.style.textAlign = 'left';
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'X';
    removeBtn.onclick = () => {
        row.remove();
        if (typeof calculatePricing === 'function') calculatePricing();
    };
    removeBtn.style.marginLeft = '16px';
    removeBtn.style.float = 'right';
    priceCell.appendChild(removeBtn);

    let quantity = 1;
    let mealAddonSelected = false;
    let drinkAddonSelected = false;

    function updatePrice(qty) {
        quantity = qty;
        let addonTotal = 0;
        if (mealAddonSelected) addonTotal += 2;
        if (drinkAddonSelected) addonTotal += 2;
        priceCell.innerHTML = `$${((item.price + addonTotal) * quantity).toFixed(2)}`;
        priceCell.appendChild(removeBtn);
        if (typeof calculatePricing === 'function') calculatePricing();
    }

    priceCell.innerHTML = `$${item.price.toFixed(2)}`;
    priceCell.appendChild(removeBtn);

    const quantityCell = adjustQuantity(updatePrice);

    function updateAddonPrice(mealSelected, drinkSelected) {
        mealAddonSelected = mealSelected;
        drinkAddonSelected = drinkSelected;
        updatePrice(quantity);
        if (typeof calculatePricing === 'function') calculatePricing();
    }

    const addonCell = addonDropdown(item.category, updateAddonPrice);

    row.appendChild(itemCell);
    row.appendChild(quantityCell);
    row.appendChild(addonCell);
    row.appendChild(priceCell);

    table.appendChild(row);
    if (typeof calculatePricing === 'function') calculatePricing();
}

