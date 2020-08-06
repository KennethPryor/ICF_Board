var trackingBoardRef = database.ref('tracking_board');

let current_date = moment().date();
let days_in_month = moment().daysInMonth();

// day of the month/days in the month

// /amount of cars sold

// =tracking number 
    trackingBoardRef.once("value", function (snapshot) {
    // Tracking New
        let dayDividedByMonth = current_date/days_in_month;
        let tracking_new_math = snapshot.val().new/dayDividedByMonth;
        // Tracking Used
        let tracking_used_math = snapshot.val().used/dayDividedByMonth;
        // Tracking Total
        let tracking_total_math = Math.round(tracking_new_math) + Math.round(tracking_used_math);
        // Sold Total
        let total_sold_math = snapshot.val().new + snapshot.val().used;

        trackingBoardRef.set({
            tracking_new: Math.round(tracking_new_math),
            tracking_used: Math.round(tracking_used_math),
            tracking_total: tracking_total_math,
            new: snapshot.val().new,
            used: snapshot.val().used,
            total_sold: total_sold_math,
        });
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    })

trackingBoardRef.on("value", function (snapshot) {
        $("#new-display").text(snapshot.val().new);
        $("#tracking_new-display").text(snapshot.val().tracking_new);
        $("#used-display").text(snapshot.val().used);
        $("#tracking_used-display").text(snapshot.val().tracking_used);
        $("#total_sold-display").text(snapshot.val().total_sold);
        $("#tracking_total-display").text(snapshot.val().tracking_total);
});        
