#!/bin/bash

# Base directory for the input and output
BASE_INPUT_DIR="assets"
BASE_OUTPUT_DIR="assets-masked"

# Find and loop over all png files in the $BASE_INPUT_DIR directory and its subdirectories
find "${BASE_INPUT_DIR}" -name "*.png" -type f | while read -r file
do
    # Get directory of the current file
    FILE_DIR=$(dirname "${file}")

    # Create corresponding directory in $BASE_OUTPUT_DIR
    OUTPUT_DIR="${BASE_OUTPUT_DIR}/${FILE_DIR#"$BASE_INPUT_DIR/"}"
    mkdir -p "${OUTPUT_DIR}"

    # Get the base name of the file
    FILE_BASE_NAME=$(basename "${file}" .png)

    # Output file path
    OUTPUT_FILE_PATH="${OUTPUT_DIR}/${FILE_BASE_NAME}.png"

    # Generate the mask for the file
    convert "${file}" -alpha extract "${OUTPUT_FILE_PATH}"
done

