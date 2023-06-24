const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Define the /generate_image endpoint
app.post('/generate', (req, res) => {
  const { string, batch_size } = req.body;
  
  // Here, you can use the provided string and batch_size to generate an image
  // Replace the placeholder code with your actual image generation logic
  
  // For demonstration purposes, we're just returning a sample response
  const image = `Generated image for string "${string}" with batch size ${batch_size}`;
  res.json({ image });
});

// Start the server
app.listen(3001, () => {
  console.log('Server is listening on port 3001');
});


