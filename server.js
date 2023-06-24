const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
    apis: ['app.js'] // point to your app file where swagger can find the doc comments
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
 *             type: array
 *             items:
 *               type: string
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
    const elements = req.body;

    let urls = [];
    // Loop over each element
    for (let element of elements) {
        // Generate an image based on the element
        // This is a placeholder - replace with your actual image generation logic
        let image = await generateImageFromElement(element);

        // Upload the image to cloud storage and get the URL
        // This is a placeholder - replace with your actual upload logic
        let url = await uploadImageToStorage(image);

        urls.push(url);
    }

    // Return the URLs for the generated images
    res.json({ urls });
});

