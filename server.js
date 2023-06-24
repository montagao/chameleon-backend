const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Image Generation Service',
            version: '1.0.0',
            description: 'A simple Express server for generating images'
        },
        servers: [
            {
                url: 'http://localhost:3001'
            }
        ]
    },
    apis: ['server.js'] // point to your app file where swagger can find the doc comments
};

const specs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @openapi
 * /generate:
 *   post:
 *     summary: Generates images based on provided elements
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               head:
 *                 type: array
 *                 items:
 *                   type: string
 *               body:
 *                 type: array
 *                 items:
 *                   type: string
 *               glasses:
 *                 type: array
 *                 items:
 *                   type: string
 *               accessories:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: URLs of the generated images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: string
 */
app.post('/generate', async (req, res) => {
    const { head, body, glasses, accessories } = req.body;

    // Placeholder for URLs of generated images
    let urls = [];

    // Assume that 'generateImage' is a function that generates an image
    // based on the provided attribute and descriptor, and 'uploadImageToStorage' 
    // uploads the image to cloud storage and returns the URL

    for (let descriptor of head) {
        let image = await generateImage('head', descriptor);
        let url = await uploadImageToStorage(image);
        urls.push(url);
    }

    for (let descriptor of body) {
        let image = await generateImage('body', descriptor);
        let url = await uploadImageToStorage(image);
        urls.push(url);
    }

    // Similarly for 'glasses' and 'accessories'

    res.json({ urls });
});


app.listen(3001, () => {
    console.log('Server is listening on port 3001');
});
