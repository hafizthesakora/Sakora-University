import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { readdirSync } from 'fs';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
const morgan = require('morgan');
require('dotenv').config();

const csrfProtection = csrf({ cookie: true });

// create express app
const app = express();

//db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  })
  .then(() => console.log('Db connected'))
  .catch((err) => console.log('Db connection Failed - ', err));

//apply middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// route
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

//csrf
app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
//port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}.`));
