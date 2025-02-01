function calculateLeave() {

    const latestPayDate = new Date(document.getElementById('latestPayDate').value);
    const annualLeaveStartDate = new Date(document.getElementById('annualLeaveStartDate').value);
    const annualLeaveAccrual = parseFloat(document.getElementById('annualLeaveAccrual').value) || 0;
    const annualLeaveEntitlement = parseFloat(document.getElementById('annualLeaveEntitlement').value) || 0;
    const shiftLeaveHours = parseFloat(document.getElementById('shiftLeaveHours').value) || 0;
    const alternateDays = parseFloat(document.getElementById('alternateDays').value) || 0;
    const normalWeeklyWorkHours = parseFloat(document.getElementById('normalWeeklyWorkHours').value) || 40;
    const dailyWorkHours = parseFloat("8");
    const annualLeaveEntitlementWeeks = parseFloat("4");
    const enableAdvanced = document.getElementById('enableAdvanced').checked;

    // Calculate the fortnightly annual leave hours depending on the number of hours worked
    const fortnightlyAnnualLeave = parseFloat((annualLeaveEntitlementWeeks * normalWeeklyWorkHours) / 26);

    // Calculate the difference in days
    const differenceDays = Math.floor((annualLeaveStartDate - latestPayDate) / (1000 * 60 * 60 * 24));

    // Calculate the number of fortnights
    const fortnights = Math.floor(differenceDays / 14);

    // Calculate the total hours of annual leave
    const totalAnnualLeaveHours = fortnights * fortnightlyAnnualLeave;

    // Use the value stored in alternateDays
    let totalAnnualLeaveHoursWithEntitlement = totalAnnualLeaveHours + (annualLeaveEntitlement * normalWeeklyWorkHours) + (annualLeaveAccrual * normalWeeklyWorkHours) + shiftLeaveHours + (alternateDays * 8);

    // Advanced calculator logic
    if (enableAdvanced) {
        const employmentStartDate = new Date(document.getElementById('employmentStartDate').value);

        // Calculate long service leave
        const longServiceLeaveDays = calculateLongServiceLeave(employmentStartDate, latestPayDate, annualLeaveStartDate, normalWeeklyWorkHours);
        document.getElementById('longServiceLeaveDays').value = longServiceLeaveDays.toFixed(2);

        // Calculate additional work weeks
        const additionalWorkWeeksDays = calculateAdditionalWorkWeeks(employmentStartDate, latestPayDate, annualLeaveStartDate, normalWeeklyWorkHours);
        document.getElementById('additionalWorkWeeksDays').value = additionalWorkWeeksDays.toFixed(2);

        // Add to total leave entitlement
        totalAnnualLeaveHoursWithEntitlement += (longServiceLeaveDays + additionalWorkWeeksDays) * dailyWorkHours;

        // Display other advanced results
        document.getElementById('shiftLeaveTotalHours').value = shiftLeaveHours.toFixed(2);
        document.getElementById('alternateDaysTotal').value = alternateDays.toFixed(2);
        document.getElementById('advancedResults').style.display = 'block';
    } else {
        document.getElementById('advancedResults').style.display = 'none';
    }

    // Display the total annual leave in hours
    document.getElementById('calculatedResultHours').value = totalAnnualLeaveHoursWithEntitlement.toFixed(2);

    // Calculate the annual leave in days (working days only)
    const totalAnnualLeaveDaysWorking = Math.floor(totalAnnualLeaveHoursWithEntitlement / dailyWorkHours);

    // Display the result in the appropriate input box
    document.getElementById('calculatedResultDaysWorking').value = totalAnnualLeaveDaysWorking;
}

// Function to toggle the negative checkbox
function toggleNegative() {
    const entitlementInput = document.getElementById('annualLeaveEntitlement');
    const negativeCheckbox = document.getElementById('negativeCheckbox');

    if (negativeCheckbox.checked) {
        entitlementInput.value = -Math.abs(entitlementInput.value);
    } else {
        entitlementInput.value = Math.abs(entitlementInput.value);
    }
}

// Function to toggle advanced calculator visibility
function toggleAdvancedCalculator() {
    const advancedCalculator = document.getElementById('advancedCalculator');
    const advancedResults = document.getElementById('advancedResults');
    const enableAdvanced = document.getElementById('enableAdvanced').checked;

    if (enableAdvanced) {
        advancedCalculator.style.display = 'block';
        advancedResults.style.display = 'block';
    } else {
        advancedCalculator.style.display = 'none';
        advancedResults.style.display = 'none';
    }
}

// Function to calculate long service leave
function calculateLongServiceLeave(employmentStartDate, latestPayDate, annualLeaveStartDate, normalWeeklyWorkHours) {
    const employmentDuration = (annualLeaveStartDate - employmentStartDate) / (1000 * 60 * 60 * 24 * 365);
    let longServiceLeaveDays = 0;

    if (employmentDuration >= 5) {
        const employmentAnniversary = new Date(employmentStartDate);
        for (let year = 5; year <= Math.floor(employmentDuration); year += 5) {
            employmentAnniversary.setFullYear(employmentStartDate.getFullYear() + year);

            // Reset all dates to midnight
            const anniversaryMidnight = new Date(employmentAnniversary.setHours(0, 0, 0, 0));
            const latestPayDateMidnight = new Date(latestPayDate.setHours(0, 0, 0, 0));
            const annualLeaveStartDateMidnight = new Date(annualLeaveStartDate.setHours(0, 0, 0, 0));
            // Compare dates
            if (anniversaryMidnight >= latestPayDateMidnight && anniversaryMidnight <= annualLeaveStartDateMidnight) {
                longServiceLeaveDays += normalWeeklyWorkHours / 8;
            }
        }
    }
    return longServiceLeaveDays;
}

// Function to calculate additional work weeks
function calculateAdditionalWorkWeeks(employmentStartDate, latestPayDate, annualLeaveStartDate, normalWeeklyWorkHours) {
    const employmentDuration = (annualLeaveStartDate - employmentStartDate) / (1000 * 60 * 60 * 24 * 365);
    let additionalWeeksDays = 0;

    if (employmentDuration >= 5) {
        const employmentAnniversary = new Date(employmentStartDate);
        for (let year = 5; year <= Math.floor(employmentDuration); year++) {
            employmentAnniversary.setFullYear(employmentStartDate.getFullYear() + year);

            // Reset all dates to midnight
            const anniversaryMidnight = new Date(employmentAnniversary.setHours(0, 0, 0, 0));
            const latestPayDateMidnight = new Date(latestPayDate.setHours(0, 0, 0, 0));
            const annualLeaveStartDateMidnight = new Date(annualLeaveStartDate.setHours(0, 0, 0, 0));

            // Compare dates
            if (anniversaryMidnight >= latestPayDateMidnight && anniversaryMidnight <= annualLeaveStartDateMidnight) {
                additionalWeeksDays += normalWeeklyWorkHours / 8; // Convert to days
            }
        }
    }
    return additionalWeeksDays;
}

// Function to set default value for "Latest Pay Date" to today
function setDefaultLatestPayDate() {
    const today = new Date();
    const offset = today.getTimezoneOffset(); // Get the timezone offset in minutes

    // Adjust the date based on the timezone offset
    today.setMinutes(today.getMinutes() - offset);

    const formattedDate = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    document.getElementById('latestPayDate').value = formattedDate; // Set the value
    document.getElementById('annualLeaveStartDate').value = formattedDate; // Set the value
}

// Function to toggle Readme visibility
function toggleReadme() {
    const readme = document.getElementById('readmeSection');
    readme.style.display = (readme.style.display === 'none') ? 'block' : 'none';
}

// Set default date values on load
window.onload = function() {
    setDefaultLatestPayDate();
};
