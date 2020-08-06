$(document).ready(function () {
  $('select').formSelect();
});

const firebaseConfig = {
  apiKey: "AIzaSyAeFoQZJe8Ah1813JC7J0ey5ODUwDUk3dU",
  authDomain: "icf-board.firebaseapp.com",
  databaseURL: "https://icf-board.firebaseio.com",
  projectId: "icf-board",
  storageBucket: "icf-board.appspot.com",
  messagingSenderId: "312850015698",
  appId: "1:312850015698:web:93e74a73634a629402140b",
  measurementId: "G-MKGGWQNM6B"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Initial Values
var name = "";
var cars_sold = "";

var trackingBoardRef = database.ref('tracking_board');
var trackingBoardNewRef = database.ref('tracking_board/new');
var salespersonRef = database.ref('Salespersons');
var dailyBoardRef = database.ref('daily_board');


var salesBySold = salespersonRef.orderByChild('cars_sold');

salesBySold.on('value', function (snapshot) {
  snapshot.forEach(function (childSnapshot) {
    var childData = childSnapshot.val();

    $('#salesperson_tbody').append(`
        <tr>
            <td>${childData.name}</td>
            <td>${childData.cars_sold}</td>
        </tr>
    `);
  });
});

dailyBoardRef.on('value', function (snapshot) {
  snapshot.forEach(function (childSnapshot) {
    var childData = childSnapshot.val();
    $('#daily_board-tbody').append(`
        <tr>
            <td>${childData.salesperson}</td>
            <td>${childData.customer}</td>
            <td>${childData.stock_num}</td>
            <td>${childData.trade}</td>
        </tr>
    `);
  });
});

// Firebase watcher + initial loader HINT: .on("value")
salespersonRef.on("value", function (snapshot) {

  // Change the HTML to reflect
  $("#name-display").text(snapshot.val().name);
  $("#cars_sold-display").text(snapshot.val().cars_sold);

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

