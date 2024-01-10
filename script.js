function calculateLeave() {
    const latestPayDate = new Date(document.getElementById('latestPayDate').value);
    const annualLeaveStartDate = new Date(document.getElementById('annualLeaveStartDate').value);
    const annualLeaveAccrual = parseFloat(document.getElementById('annualLeaveAccrual').value) || 0;
    const annualLeaveEntitlement = parseFloat(document.getElementById('annualLeaveEntitlement').value) || 0;
    const shiftLeaveHours = parseFloat(document.getElementById('shiftLeaveHours').value) || 0;
    const alternateDays = parseFloat(document.getElementById('alternateDays').value) || 0;

    // Calculate the difference in days
    const differenceDays = Math.floor((annualLeaveStartDate - latestPayDate) / (1000 * 60 * 60 * 24));

    // Calculate the number of fortnights
    const fortnights = Math.floor(differenceDays / 14);

    // Calculate the total hours of annual leave
    const totalAnnualLeaveHours = fortnights * 6.2;

    // Multiply by 40 hours for annualLeaveAccrual and annualLeaveEntitlement
    const totalAnnualLeaveHoursWithEntitlement = totalAnnualLeaveHours + (annualLeaveEntitlement * 40) + (annualLeaveAccrual * 40) + shiftLeaveHours + (alternateDays * 8);

    // Display the total annual leave in hours
    document.getElementById('calculatedResultHours').value = totalAnnualLeaveHoursWithEntitlement.toFixed(2);

    // Calculate the annual leave in days (working days only)
    const totalAnnualLeaveDaysWorking = Math.floor(totalAnnualLeaveHoursWithEntitlement / 8);

    // Display the result in the appropriate input box
    document.getElementById('calculatedResultDaysWorking').value = totalAnnualLeaveDaysWorking;
}

function toggleNegative() {
    const entitlementInput = document.getElementById('annualLeaveEntitlement');
    const negativeCheckbox = document.getElementById('negativeCheckbox');

    if (negativeCheckbox.checked) {
        entitlementInput.value = -Math.abs(entitlementInput.value);
    } else {
        entitlementInput.value = Math.abs(entitlementInput.value);
    }
}
// Function to set default value for "Latest Pay Date" to today
function setDefaultLatestPayDate() {
    const today = new Date();
    const offset = today.getTimezoneOffset(); // Get the timezone offset in minutes

    // Adjust the date based on the timezone offset
    today.setMinutes(today.getMinutes() - offset);

    const formattedDate = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    document.getElementById('latestPayDate').value = formattedDate; // Set the value
}

// Call the function to set default value on window load
window.onload = function() {
    setDefaultLatestPayDate();
};
