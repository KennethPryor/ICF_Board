/* The problem is due to something called event delegation.
https://learn.jquery.com/events/event-delegation/
https://stackoverflow.com/questions/1687296/what-is-dom-event-delegation
https://stackoverflow.com/questions/34896106/attach-event-to-dynamic-elements-in-javascript

My first solution is not necessarily the best solution and has not been tested thoroughly.
https://api.jquery.com/jQuery.holdReady/

I used the $.holdReady method to hold and release jQuery's ready event at 15 and 50.
*/
$(document).ready(function () {
    $("select").formSelect();
    $(".tooltipped").tooltip();
});
/* $.holdReady method set to true here. */
$.holdReady(true);

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyA-yBlTzATI4ka-1UBCTn_dHYWTBV3g3e4",
    authDomain: "awk-board-93e81.firebaseapp.com",
    databaseURL: "https://awk-board-93e81.firebaseio.com",
    projectId: "awk-board-93e81",
    storageBucket: "awk-board-93e81.appspot.com",
    messagingSenderId: "290454024389",
    appId: "1:290454024389:web:3105b617a373f845"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

console.log("This was made by Kenneth Pryor and assisted by Jesse Schimmel.");

var database = firebase.database();

var trackingBoardRef = database.ref("tracking_board");
var trackingBoardNewRef = database.ref("tracking_board/new");
var salespersonRef = database.ref("Salespersons");
var dailyBoardRef = database.ref("daily_board");


var salesBySold = salespersonRef.orderByChild("cars_sold");

salesBySold.on("value", function (snapshot) {

    snapshot.forEach(function (childSnapshot) {

        var key = childSnapshot.key;

        var childData = childSnapshot.val();

        /* I added a function to encapsulate appending options to #salesperson-select named createOptions() here. */
        createOptions(key, childData);
        /* The $.holdReady method is set to false here. */
        $.holdReady(false);
        /* Defined createOptions() here. */
        function createOptions(key , childData) {
            $(".salesperson-select").append(
                $("<option></option>")
                    .attr("value", key)
                    .text(childData.name)
            );
        }

    });
});

salesBySold.on("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();

        let dayDividedByMonth = current_date / days_in_month;
        let tracking_sold_math = childData.cars_sold / dayDividedByMonth;
        var cls = "";
        if (tracking_sold_math < childData.goal) {
            cls = "red-text";
        } else {
            cls = "green-text";
        }

        $("#sp_admin_tbody").append(`
          <tr>
              <td>${childData.name}</td>
              <td id='cars_sold' class="${cls}">${childData.cars_sold}</td>
              <td>${childData.goal}<td>
          </tr>
      `);

        console.log(childData.name + " is Tracking: " + tracking_sold_math);
    });
});


// I need this to only run once and not crash my server and just keep adding 1
// function updateSalesperson() {
        
//     var salespersonRefSelect = database.ref("Salespersons/" + salesperson);

//     salespersonRefSelect.on('value', function (snapshot) {
//         var salespersonData = snapshot.val();

//         let cars_sold_update = parseInt(salespersonData.cars_sold) + 1;

//         salespersonRefSelect.update({
//             cars_sold: cars_sold_update,
//         });        
//     })
// };

$("#add-daily_board").one("click", function (event) {
    event.preventDefault();

    salesperson = $("#salesperson-select-daily option:selected").text();
    customer = $("#customer_name-input")
        .val()
        .trim();
    new_or_used = $("#new_or_used-input option:selected").text();
    stock_num = $("#stock_num-input")
        .val()
        .trim();
    trade = $("#trade_in-input")
        .val()
        .trim();

    dailyBoardRef.push({
        salesperson: salesperson,
        customer: customer,
        stock_num: stock_num,
        trade: trade
    });

    // updateSalesperson()
});


$("#add-user").on("click", function (event) {
    event.preventDefault();

    name = $("#name-input")
        .val()
        .trim();

    salespersonRef.push({
        name: name,
        cars_sold: 0,
        goal: 5,
    });
});

$("#update-sold-counter").one("click", function (event) {
    event.preventDefault();

    name = $("#salesperson-select-sold")
        .val();
    cars_sold_update = $("#salesperson_sold-update")
        .val()
        .trim();

    salespersonRef.child(name).update({
        cars_sold: cars_sold_update,
    });
});    

$("#update-goal-counter").on("click", function (event) {
    event.preventDefault();

    // Grabbed values from text-boxes
    name = $("#salesperson-select-goal")
        .val();
    goal_update = $("#salesperson_goal-update")
        .val()
        .trim();

    salespersonRef.child(name).update({
        goal: goal_update,
    });
});

$("#reset-sold-counter").on("click", function (event) {
    event.preventDefault();
    if (window.confirm('This will Reset all Salesman back to 0. Are you sure you want to Reset? ')) {
        salesBySold.on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var key = childSnapshot.key;

                salespersonRef.child(key).update({
                    cars_sold: 0,
                });
            });
        });
    };
});

$("#update_new-counter").one("click", function (event) {
    event.preventDefault();

    let updated_new_counter = parseInt(
        $("#new_sold-update")
            .val()
            .trim()
    );

    trackingBoardRef.once("value", function (snapshot) {
        if (updated_new_counter == "") {
            console.log("New Cars remained the same.");
        } else {
            trackingBoardRef.update({
                new: updated_new_counter
            });
        }
    });
});

$("#update_used-counter").one("click", function (event) {
    event.preventDefault();

    let updated_used_counter = parseInt(
        $("#used_sold-update")
            .val()
            .trim()
    );

    if (updated_used_counter == "") {
        console.log(updated_used_counter);
    } else {
        trackingBoardRef.update({
            used: updated_used_counter
        });
    }
});

$("#reset_sales_board").on("click", function (event) {
    event.preventDefault();

    placeholder = "**Do NOT Delete**";

    dailyBoardRef.set({
        placeholder: placeholder
    });
});
