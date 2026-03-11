function validName(name) {
    const inputName = document.getElementById('Name');
    const nameRegex = /^[a-zA-Z\s]+$/;
    const valid = nameRegex.test(name);

    if (!valid) {
        inputName.setCustomValidity('Please enter a valid name (letters and spaces only).');
    } else {
        inputName.setCustomValidity('');
    }
    return valid;
}

function validPhone(phone) {
    const inputPhone = document.getElementById('Phone');
    const phoneRegex = /^\d{10}$/;
    const valid = phoneRegex.test(phone);

    if (!valid) {
        inputPhone.setCustomValidity('Please enter a valid phone number (10 digits only).');
    } else {
        inputPhone.setCustomValidity('');
    }
    return valid;
}

function validEmail(email) {
    const inputEmail = document.getElementById('Email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(email);
    if (!valid) {
        inputEmail.setCustomValidity('Please enter a valid email address.');
    } else {
        inputEmail.setCustomValidity('');
    }
    return valid;
}

function validAddress(address) {
    const inputAddress = document.getElementById('Address');
    const valid = address.trim() !== '';
    if (!valid) {
        inputAddress.setCustomValidity('Please enter a valid address.');
    } else {
        inputAddress.setCustomValidity('');
    }
    return valid;
}


function validCardNumber(cardNumber) {
    const inputCard = document.getElementById('payment');

    const cardRegex = /^\d{13,19}$/;
    const sanitized = cardNumber.replace(/\s+/g, '');
    const valid = cardRegex.test(sanitized);
    if (!valid) {
        inputCard.setCustomValidity('Please enter a valid card number (13-19 digits).');
    } else {
        inputCard.setCustomValidity('');
    }
    return valid;
}

function validExpDate(expDate) {
    const inputExp = document.getElementById('expDate');

    const expRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
    const match = expDate.match(expRegex);
    let valid = false;
    if (match) {
        const month = parseInt(match[1], 10);
        const year = parseInt(match[2], 10);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        valid = (year > currentYear) || (year === currentYear && month >= currentMonth);
    }
    if (!valid) {
        inputExp.setCustomValidity('Please enter a valid expiration date (MM/YY, not expired).');
    } else {
        inputExp.setCustomValidity('');
    }
    return valid;
}

function validCVV(cvv) {
    const inputCVV = document.getElementById('cvv');

    const cvvRegex = /^\d{3}$/;
    const valid = cvvRegex.test(cvv);
    if (!valid) {
        inputCVV.setCustomValidity('Please enter a valid CVV (3 digits).');
    } else {
        inputCVV.setCustomValidity('');
    }
    return valid;
}