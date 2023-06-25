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
const { PythonShell } = require('python-shell');

app.post('/generate', async (req, res) => {
    const { head, body, glasses, accessories } = req.body;

    let options = {
        mode: 'json',
        pythonOptions: ['-u'], // unbuffered to ensure real-time data flow
        args: [JSON.stringify(req.body)]
    };

    PythonShell.run('./sd.py', options, function(err, result) {
        if (err) throw err;
        // result is an array consisting of messages collected during execution
        console.log('result: ', result);
        res.json({ urls: result[0].urls });
    });
});


function generateImage(attribute, descriptor) {
    // Placeholder for generating an image
    // TODO

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('image');
        }, 1000);
    }
    );

}

function uploadImageToStorage(image) {
    // Placeholder for uploading an image to cloud storage


    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTFkN2Q1IiAvPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyMTAiIGZpbGw9IiMzNDMyMzUiIC8+PHJlY3Qgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjIyMCIgZmlsbD0iIzM0MzIzNSIgLz48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjMwIiBmaWxsPSIjMzQzMjM1IiAvPjxyZWN0IHdpZHRoPSIxNDAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyNDAiIGZpbGw9IiMzNDMyMzUiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjUwIiBmaWxsPSIjMzQzMjM1IiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjUwIiBmaWxsPSIjMzQzMjM1IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjI2MCIgZmlsbD0iIzM0MzIzNSIgLz48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjI2MCIgZmlsbD0iIzM0MzIzNSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIyNzAiIGZpbGw9IiMzNDMyMzUiIC8+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIyNzAiIGZpbGw9IiMzNDMyMzUiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjgwIiBmaWxsPSIjMzQzMjM1IiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMjgwIiBmaWxsPSIjMzQzMjM1IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjI5MCIgZmlsbD0iIzM0MzIzNSIgLz48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjI5MCIgZmlsbD0iIzM0MzIzNSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIzMDAiIGZpbGw9IiMzNDMyMzUiIC8+PHJlY3Qgd2lkdGg9IjExMCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIzMDAiIGZpbGw9IiMzNDMyMzUiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMzEwIiBmaWxsPSIjMzQzMjM1IiAvPjxyZWN0IHdpZHRoPSIxMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMzEwIiBmaWxsPSIjMzQzMjM1IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIyMjAiIGZpbGw9IiNlYWIxMTgiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjIzMCIgZmlsbD0iI2VhYjExOCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE2MCIgeT0iMjMwIiBmaWxsPSIjZGI4MzIzIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIyMzAiIGZpbGw9IiNlYWIxMTgiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjI0MCIgZmlsbD0iI2VhYjExOCIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMjUwIiBmaWxsPSIjZWFiMTE4IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyNjAiIGZpbGw9IiNlYWIxMTgiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjI2MCIgZmlsbD0iI2RiODMyMyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMjYwIiBmaWxsPSIjZWFiMTE4IiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyNzAiIGZpbGw9IiNlYWIxMTgiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjI3MCIgZmlsbD0iI2RiODMyMyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMjcwIiBmaWxsPSIjZWFiMTE4IiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTQwIiB5PSIyODAiIGZpbGw9IiNlYWIxMTgiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjI4MCIgZmlsbD0iI2RiODMyMyIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMjgwIiBmaWxsPSIjZWFiMTE4IiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIyOTAiIGZpbGw9IiNlYWIxMTgiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjIwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIyMCIgZmlsbD0iI2ZmYzExMCIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iMzAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjMwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTkwIiB5PSIzMCIgZmlsbD0iI2ZmYzExMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjcwIiB5PSI0MCIgZmlsbD0iI2ZmYzExMCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iNDAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjEwIiB4PSIxNjAiIHk9IjQwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjUwIiBmaWxsPSIjZmZjMTEwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjUwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSI1MCIgZmlsbD0iIzkwOWIwZSIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iNTAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI3MCIgeT0iNjAiIGZpbGw9IiNmZmMxMTAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iNjAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjYwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSI2MCIgZmlsbD0iIzkwOWIwZSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjcwIiB5PSI3MCIgZmlsbD0iIzkwOWIwZSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjExMCIgeT0iNzAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxNTAiIHk9IjcwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTkwIiB5PSI3MCIgZmlsbD0iIzZmNTk3YSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIzMCIgeT0iNzAiIGZpbGw9IiNmZmMxMTAiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI3MCIgeT0iODAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjgwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSI4MCIgZmlsbD0iIzkwOWIwZSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIyMCIgeT0iODAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyMzAiIHk9IjgwIiBmaWxsPSIjZmZjMTEwIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjkwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSI5MCIgZmlsbD0iIzkwOWIwZSIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjIyMCIgeT0iOTAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTAwIiBmaWxsPSIjNmY1OTdhIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjEwMCIgZmlsbD0iIzkwOWIwZSIgLz48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMTAwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIxMCIgeD0iMjMwIiB5PSIxMDAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSI1MCIgeT0iMTEwIiBmaWxsPSIjNmY1OTdhIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjExMCIgZmlsbD0iIzkwOWIwZSIgLz48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMTEwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjQwIiB5PSIxMTAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMCIgeD0iODAiIHk9IjEyMCIgZmlsbD0iIzkwOWIwZSIgLz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHg9IjIyMCIgeT0iMTIwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSIxNjAiIGhlaWdodD0iMTAiIHg9IjkwIiB5PSIxMzAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxMCIgeD0iOTAiIHk9IjE0MCIgZmlsbD0iIzkwOWIwZSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjI2MCIgeT0iMTQwIiBmaWxsPSIjNmY1OTdhIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNTAiIHk9IjE1MCIgZmlsbD0iIzZmNTk3YSIgLz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjE1MCIgZmlsbD0iIzkwOWIwZSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjI1MCIgeT0iMTUwIiBmaWxsPSIjNmY1OTdhIiAvPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIxNjAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI4MCIgeT0iMTcwIiBmaWxsPSIjNmY1OTdhIiAvPjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSIxMCIgeD0iMTIwIiB5PSIxNzAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjE4MCIgZmlsbD0iIzZmNTk3YSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjEyMCIgeT0iMTgwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIxODAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNDAiIHk9IjE4MCIgZmlsbD0iI2ZmYWUxYSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTgwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTYwIiB5PSIxODAiIGZpbGw9IiNmZmFlMWEiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE4MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMTgwIiBmaWxsPSIjOTA5YjBlIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxODAiIGZpbGw9IiM2ZjU5N2EiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyNDAiIHk9IjE4MCIgZmlsbD0iIzZmNTk3YSIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMTkwIiBmaWxsPSIjNmY1OTdhIiAvPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgeD0iMTMwIiB5PSIxOTAiIGZpbGw9IiM5MDliMGUiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxOTAiIHk9IjE5MCIgZmlsbD0iIzZmNTk3YSIgLz48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjEwIiB4PSI5MCIgeT0iMjAwIiBmaWxsPSIjNmY1OTdhIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIyMTAiIGZpbGw9IiM2ZjU5N2EiIC8+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjEwIiB4PSIxMjAiIHk9IjIxMCIgZmlsbD0iIzZmNTk3YSIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE3MCIgeT0iMjEwIiBmaWxsPSIjNmY1OTdhIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIyMTAiIGZpbGw9IiM2ZjU5N2EiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjIyMCIgZmlsbD0iIzZmNTk3YSIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIzMCIgeT0iMjIwIiBmaWxsPSIjNmY1OTdhIiAvPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIxMTAiIGZpbGw9IiNlODcwNWIiIC8+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjExMCIgZmlsbD0iI2U4NzA1YiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMTIwIiBmaWxsPSIjZTg3MDViIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxMjAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjEyMCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTIwIiBmaWxsPSIjZTg3MDViIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxMjAiIGZpbGw9IiNlODcwNWIiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjEyMCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTIwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjIwIiB5PSIxMjAiIGZpbGw9IiNlODcwNWIiIC8+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiB4PSI3MCIgeT0iMTMwIiBmaWxsPSIjZTg3MDViIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxMzAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjEzMCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTMwIiBmaWxsPSIjZTg3MDViIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTgwIiB5PSIxMzAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIyMDAiIHk9IjEzMCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjIyMCIgeT0iMTMwIiBmaWxsPSIjZTg3MDViIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iNzAiIHk9IjE0MCIgZmlsbD0iI2U4NzA1YiIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMTQwIiBmaWxsPSIjZTg3MDViIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMTEwIiB5PSIxNDAiIGZpbGw9IiNmZmZmZmYiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMzAiIHk9IjE0MCIgZmlsbD0iIzAwMDAwMCIgLz48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHg9IjE1MCIgeT0iMTQwIiBmaWxsPSIjZTg3MDViIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxNDAiIGZpbGw9IiNlODcwNWIiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxODAiIHk9IjE0MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjIwMCIgeT0iMTQwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMjIwIiB5PSIxNDAiIGZpbGw9IiNlODcwNWIiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSI3MCIgeT0iMTUwIiBmaWxsPSIjZTg3MDViIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTAwIiB5PSIxNTAiIGZpbGw9IiNlODcwNWIiIC8+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjEwIiB4PSIxMTAiIHk9IjE1MCIgZmlsbD0iI2ZmZmZmZiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjEzMCIgeT0iMTUwIiBmaWxsPSIjMDAwMDAwIiAvPjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgeD0iMTUwIiB5PSIxNTAiIGZpbGw9IiNlODcwNWIiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIxNzAiIHk9IjE1MCIgZmlsbD0iI2U4NzA1YiIgLz48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHg9IjE4MCIgeT0iMTUwIiBmaWxsPSIjZmZmZmZmIiAvPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCIgeD0iMjAwIiB5PSIxNTAiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiB4PSIyMjAiIHk9IjE1MCIgZmlsbD0iI2U4NzA1YiIgLz48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIHg9IjEwMCIgeT0iMTYwIiBmaWxsPSIjZTg3MDViIiAvPjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgeD0iMTcwIiB5PSIxNjAiIGZpbGw9IiNlODcwNWIiIC8+PC9zdmc+');
        }, 1000);
    }
    );
}


app.listen(3001, () => {
    console.log('Server is listening on port 3001');
});
