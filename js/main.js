$(document).ready(function () {
  $('select').formSelect();
});
// Initialize Firebase

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA-yBlTzATI4ka-1UBCTn_dHYWTBV3g3e4" ,
  authDomain: "awk-board-93e81.firebaseapp.com",
  databaseURL: "https://awk-board-93e81.firebaseio.com",
  projectId: "awk-board-93e81",
  storageBucket: "awk-board-93e81.appspot.com",
  messagingSenderId: "290454024389",
  appId: "1:290454024389:web:3105b617a373f845"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

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

