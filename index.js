// From https://www.linkedin.com/learning/building-restful-apis-with-node-js-and-express-16069959/ with Emmanuel Henri
// Created on new repository by Eric Waldbaum on 3-12-2024 using Tutorial and pointing to localhost endpoint
// Updated by Eric Waldbaum 3-13-2024 with a lot of validation and updating date and version

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './src/routes/crmRoutes';

const app = express();
const PORT = 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/CRMdb',{
    useNewUrlParser: true
});

//bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serving static files
app.use(express.static('public'))

routes(app);

app.get('/', (req, res) => 
    res.send(`Node and express server is running on port ${PORT}`)
);

app.listen(PORT, () => 
    console.log(`Your server is running on port ${PORT}`)
);
