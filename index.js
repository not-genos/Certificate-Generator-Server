const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db');
const certificateRoute = require('./routes/certificate');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: 'false' }));

connectDB();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api', certificateRoute);

app.get('/', (req, res) => {
    res.send('Server Working');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})