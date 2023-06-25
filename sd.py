import os
import random
import datetime
import webuiapi
from PIL import Image
import subprocess
import shutil
import itertools
import w3storage
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def generate_nft_assets(head, body, glasses, accessories):
    # Code remains mostly the same, replacing "request" with appropriate function parameters

    # Set up the request data
    request = {
        "head": head,
        "body": body,
        "glasses": glasses,
        "accessories": accessories
    }



# Now you can access the API_KEY
    api_key = os.environ.get('API_KEY')


# Connect to the w3storage
    w3 = w3storage.API(token=api_key)


# Setup API client
    api = webuiapi.WebUIApi(host='0.0.0.0', port=3000)

    glasses_mask_path = './glasses_mask.png'


# Set your assets root directory
    assets_root = './assets/'
    assets_root_masked = './assets-masked/'

    prompt_modifiers = ''

# Your received request
#request = {
            #    "head": ["fire", "metal"],
            #"body": ["earth", "water"],
            #"glasses": ["flame", "void"],
            #"accessories": ["aesthetic"]
            #}

# Map category names to corresponding directory numbers
    category_dir_map = {
        "head": "1_Heads",
        "body": "3_Bodies",
        "glasses": "2_Glasses",
        "accessories": "4_Accessories"
    }

# Define the order of the categories for layering
    layer_order = ['body', 'head', 'accessories', 'glasses']

# Get current timestamp
    timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')

# Create a new directory with the timestamp
    os.makedirs(timestamp, exist_ok=True)

# Layered images data
    layered_images = {}

    for category, traits in request.items():
        for trait in traits:
            # Get the corresponding directory for the category
            dir_name = category_dir_map[category]

            # Get full directory path
            dir_path = os.path.join(assets_root, dir_name)
            dir_path_masked = os.path.join(assets_root_masked, dir_name)

            # Get a list of all files in the directory
            files = [f for f in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, f))]

            # Select a random file
            selected_file = random.choice(files)

            # Open the selected file with PIL
            img = Image.open(os.path.join(dir_path, selected_file))

            # Skip API call for "2_Glasses"
            #if category != "glasses":
                # Create control net unit
                #unit1 = webuiapi.ControlNetUnit(input_image=img, module='canny', model='control_v11p_sd15_canny [d14c016b]')

                # Generate the image
                #r = api.txt2img(prompt=trait + prompt_modifiers, controlnet_units=[unit1])

                # Save the generated image in the timestamped directory
                #img_path = os.path.join(timestamp, f'{trait}_{selected_file}')
                #r.image.save(img_path)
            #else:
                # Directly copy the image from assets for "2_Glasses"
                #img_path = os.path.join(timestamp, f'{trait}_{selected_file}')
                #shutil.copy(os.path.join(dir_path, selected_file), img_path)

            # Create control net unit
            unit1 = webuiapi.ControlNetUnit(input_image=img, module='canny', model='control_v11p_sd15_canny [d14c016b]')

            # Generate the image
            r = api.txt2img(prompt=trait + prompt_modifiers, controlnet_units=[unit1])

            # Save the generated image in the timestamped directory
            img_path = os.path.join(timestamp, f'{trait}_{selected_file}')
            r.image.save(img_path)


            # Apply the mask using ImageMagick's CLI
            mask_path = os.path.join(dir_path_masked, selected_file)
            result_path = img_path
            subprocess.call(['convert', img_path, mask_path, '-compose', 'CopyOpacity', '-composite', result_path])

            # Add the image to the layered images
            if category not in layered_images:
                layered_images[category] = []
            layered_images[category].append(img_path)

# Create a list of all possible combinations without the background layer
    layer_combinations = list(itertools.product(*[layered_images[category] for category in layer_order if category != "0_Backgrounds"]))

# Create the final images
    image_counter = 0
    backgrounds_dir = os.path.join(assets_root, '0_Backgrounds')
    background_files = [f for f in os.listdir(backgrounds_dir) if os.path.isfile(os.path.join(backgrounds_dir, f))]

    # randomize the layer combinations
    random.shuffle(layer_combinations)

    for combination in layer_combinations:
        # Choose a random background
        background_file = random.choice(background_files)
        chosen_background = os.path.join(backgrounds_dir, background_file)
        traits_categories = {file.split('_')[0]: category for category, files in layered_images.items() for file in files}

        # Generate final image
        result_img = os.path.join(timestamp, f'final_{image_counter}.png')
        subprocess.call(['convert', chosen_background] + list(combination) + ['-flatten', result_img])

        image_counter += 1
        # Upload the selected images to IPFS and create metadata JSON files
        if image_counter >= 4:
            break
            

    uploaded_files = []

    for image_file in os.listdir(timestamp):
        if image_file.startswith("final_"):
            # Your existing code
            file_cid = w3.post_upload((image_file, open(os.path.join(timestamp, image_file), 'rb')))
            image_ipfs_url = f'https://dweb.link/ipfs/{file_cid}'


            # Add the traits as attributes in the metadata JSON
            attributes = []
            for file in combination:
                trait, category = file.split('_')[0], traits_categories[file.split('_')[0]]
                attributes.append({"trait_type": category, "value": trait})

            # Create a metadata JSON
            metadata = {
                "description": "Chameleon NFT, made with love at ETHWaterloo 2023", 
                "external_url": "https://chameleon.nft/", 
                "image": image_ipfs_url, 
                "name": "MyNft",
                "attributes": attributes
            }

            # Save the metadata JSON to a file
            json_file_name = f'{os.path.splitext(image_file)[0]}.json'
            with open(os.path.join(timestamp, json_file_name), 'w') as f:
                json.dump(metadata, f)

            # Upload the metadata JSON file to IPFS
            json_cid = w3.post_upload((json_file_name, open(os.path.join(timestamp, json_file_name), 'rb')))
            json_ipfs_url = f'https://dweb.link/ipfs/{json_cid}'
            uploaded_files.append(json_ipfs_url)
            #;print('Uploaded file URL: ' +  json_ipfs_url)

            # Instead of print(json_ipfs_url), store the urls in a list

# Log the uploaded file URL

# At the end of the script, print the list of urls as a JSON string
    return {"urls": uploaded_files}

# Flask imports
from flask import Flask, request, jsonify
from flasgger import Swagger, swag_from
from flask_cors import CORS

# Create Flask app and Swagger
app = Flask(__name__)
CORS(app)
swagger = Swagger(app)  # You can provide a template here as in the previous example


@app.route('/generate', methods=['POST'])
@swag_from({
    'tags': ['Image Generation'],
    'description': 'Generates images based on provided elements',
    'parameters': [
        {
            'name': 'Image Data',
            'in': 'body',
            'description': 'An object containing arrays of strings for head, body, glasses, and accessories',
            'required': True,
            'schema': {
                'id': 'Image_Data',
                'type': 'object',
                'properties': {
                    'head': {
                        'type': 'array',
                        'items': { 'type': 'string' }
                    },
                    'body': {
                        'type': 'array',
                        'items': { 'type': 'string' }
                    },
                    'glasses': {
                        'type': 'array',
                        'items': { 'type': 'string' }
                    },
                    'accessories': {
                        'type': 'array',
                        'items': { 'type': 'string' }
                    }
                },
            },
        }
    ],
    'responses': {
        '200': {
            'description': 'URLs of the generated images',
            'content': {
                'application/json': {
                    'schema': {
                        'type': 'object',
                        'properties': {
                            'urls': {
                                'type': 'array',
                                'items': { 'type': 'string' }
                            }
                        }
                    }
                }
            }
        }
    }
})
def generate():
    data = request.get_json()
    result = generate_nft_assets(data.get('head'), data.get('body'), data.get('glasses'), data.get('accessories'))

    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001)
