const express = require("express");
const app = express();

// Assuming dbconfig is used within your app
const dbconfig = require('./db');

// Update the import path for roomsRoutes
const roomsRoute = require('./routes/roomsRoutes');
const usersRoute = require('./routes/usersRoutes')
app.use(express.json())
app.use('/api/rooms', roomsRoute);
app.use('/api/users', usersRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
