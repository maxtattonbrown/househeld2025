#!/bin/bash

# Change to the househeld directory
cd "$(dirname "$0")"

# Check if we have nodemailer installed
if ! npm list | grep -q nodemailer; then
  echo "Installing nodemailer..."
  npm install nodemailer
fi

# Run the email sender script
echo "Generating maintenance email..."
SEND_EMAIL=true node email_sender.js

echo "Done."
