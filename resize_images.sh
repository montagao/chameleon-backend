#!/bin/bash

# Base directory for the output
BASE_OUTPUT_DIR="assets-512"

# Find and loop over all png files in the current directory and its subdirectories
find ./assets -name "*.png" -type f | while read -r file
do
    # Get directory of the current file
    FILE_DIR=$(dirname "${file}")

    # Create corresponding directory in $BASE_OUTPUT_DIR
    OUTPUT_DIR="${BASE_OUTPUT_DIR}/${FILE_DIR}"
    mkdir -p "${OUTPUT_DIR}"

    # Get the base name of the file
    FILE_BASE_NAME=$(basename "${file}")

    # Output file path
    OUTPUT_FILE_PATH="${OUTPUT_DIR}/${FILE_BASE_NAME}"

    # Convert the file to 512x512
    convert "${file}" -resize 512x512 "${OUTPUT_FILE_PATH}"
done

