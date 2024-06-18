const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Body parser middleware to handle form data
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB (replace 'your_connection_string' with your actual MongoDB connection string)
mongoose.connect('your_connection_string', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for reservations
const reservationSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    date: Date,
    time: String,
    guests: Number,
    foodItems: [String]  // Array to hold multiple food items
});

// Create a model based on the schema
const Reservation = mongoose.model('Reservation', reservationSchema);

// Handle form submission
app.post('/submit', (req, res) => {
    // Capture form data
    const { name, email, phone, date, time, guests } = req.body;
    const foodItems = req.body['food-items']; // This will be an array of selected food items

    // Create a new reservation document
    const newReservation = new Reservation({
        name,
        email,
        phone,
        date,
        time,
        guests,
        foodItems: Array.isArray(foodItems) ? foodItems : [foodItems] // Ensure it's always an array
    });

    // Save the reservation to the database
    newReservation.save()
        .then(() => res.send('Reservation saved successfully'))
        .catch(err => res.status(500).send('Error saving reservation: ' + err));
});

// Start the server
app.listen(7050, () => {
    console.log('Server is running on port 7050');
});
