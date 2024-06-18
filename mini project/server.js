const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = 'mongodb://localhost:27017'; // Replace 'localhost' and '27017' with your MongoDB server details
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectDB();

async function onRequest(req, res) {
    const path = url.parse(req.url).pathname;
    console.log('Request for ' + path + ' received');

    if (req.method === 'POST' && path === '/submit') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const formData = querystring.parse(body);
            await insertData(req, res, formData);
        });
    } else if (req.method === 'POST' && path === '/cancel') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const formData = querystring.parse(body);
            await cancelBooking(req, res, formData);
        });
    } else if (req.method === 'POST' && path === '/update') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const formData = querystring.parse(body);
            await updateBooking(req, res, formData);
        });
    } else if (path === '/display') {
        await displayTable(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
}

async function insertData(req, res, formData) {
    try {
        const database = client.db('hotel');
        const collection = database.collection('reservation');

        const reservation = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            date: formData.date,
            time: formData.time,
            guests: formData.guests
        };

        const result = await collection.insertOne(reservation);
        console.log('${result.insertedCount} document inserted');

        // HTML content for displaying the message in a table
        const htmlResponse = `
            <html>
                <head>
                    <title>Reservation Details</title>
                    <style>
                        table {
                            font-family: Arial, sans-serif;
                            border-collapse: collapse;
                            width: 50%;
                            margin: 20px auto;
                        }
                        td, th {
                            border: 1px solid #dddddd;
                            text-align: left;
                            padding: 8px;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <h2>Reservation Details</h2>
                    <table>
                        <tr>
                            <th>Field</th>
                            <th>Value</th>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td>${reservation.name}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>${reservation.email}</td>
                        </tr>
                        <tr>
                            <td>Phone</td>
                            <td>${reservation.phone}</td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td>${reservation.date}</td>
                        </tr>
                        <tr>
                            <td>Time</td>
                            <td>${reservation.time}</td>
                        </tr>
                        <tr>
                            <td>Number of Guests</td>
                            <td>${reservation.guests}</td>
                        </tr>
                    </table>
                    <a href="/display">View All Reservations</a>
                </body>
            </html>
        `;

        // Write the HTML response
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(htmlResponse);
        res.end();
    } catch (error) {
        console.error('Error inserting data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function cancelBooking(req, res, formData) {
    try {
        const database = client.db('hotel');
        const collection = database.collection('reservation');

        const filter = { email: formData.email };
        const result = await collection.deleteOne(filter);
        console.log('${result.deletedCount} document deleted');

        // Respond with appropriate message
        if (result.deletedCount === 1) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Booking cancelled successfully');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Booking not found');
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function updateBooking(req, res, formData) {
    try {
        const database = client.db('hotel');
        const collection = database.collection('reservation');

        const filter = { email: formData.email };
        const updateDoc = {
            $set: { time: formData.time }
        };

        const result = await collection.updateOne(filter, updateDoc);
        console.log('${result.modifiedCount} document updated');

        // Respond with appropriate message
        if (result.modifiedCount === 1) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Booking updated successfully');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Booking not found');
        }
    } catch (error) {
        console.error('Error updating booking:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function displayTable(req, res) {
    try {
        const database = client.db('hotel');
        const collection = database.collection('reservation');

        const cursor = collection.find({});
        const reservations = await cursor.toArray();

        // Generate HTML table dynamically based on retrieved documents
        let tableHtml = `
            <html>
                <head>
                    <title>Reservation Details</title>
                    <style>
                        table {
                            font-family: Arial, sans-serif;
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            border: 1px solid #dddddd;
                            text-align: left;
                            padding: 8px;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <h2>Reservation Details</h2>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Number of Guests</th>
                        </tr>
        `;
        reservations.forEach(reservation => {
            tableHtml += `
                <tr>
                    <td>${reservation.name}</td>
                    <td>${reservation.email}</td>
                    <td>${reservation.phone}</td>
                    <td>${reservation.date}</td>
                    <td>${reservation.time}</td>
                    <td>${reservation.guests}</td>
                </tr>
            `;
        });
        tableHtml += `
                    </table>
                </body>
            </html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(tableHtml);
        res.end();
    } catch (error) {
        console.error('Error displaying table:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

// Create HTTP server
http.createServer(onRequest).listen(7050);
console.log('Server is running on port 7050');