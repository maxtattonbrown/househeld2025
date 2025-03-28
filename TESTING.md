# HouseHeld Testing Guide

## Quick Start

1. Make sure you have Node.js installed on your system

2. Install dependencies:
   ```
   npm install
   ```

3. Edit the configuration in `email_sender.js`:
   - Change `recipientEmail` to your email address
   - For testing, create a free test account at https://ethereal.email/
   - Copy the generated credentials to the `smtp` section

4. Preview the email (without sending):
   ```
   npm start
   ```
   This will generate an `email_preview.html` file you can open in your browser

5. Send a test email:
   ```
   npm run send-email
   ```

## What's Included

This MVP demonstrates:

1. **Invisible UI approach** - The entire product lives in the user's inbox
2. **Personalized maintenance** - Tasks are filtered based on the home profile
3. **Seasonal scheduling** - Tasks appear at the optimal time of year
4. **Tradesperson recommendations** - Each job includes suggested providers

## Next Steps

After testing this email-first MVP, we can consider:

1. Setup a server to send these emails monthly
2. Add a simple web form for the initial home profile setup
3. Create a "complete this task" feedback mechanism in emails
4. Implement tracking to see which tasks users complete

## Notes on the Implementation

- The current implementation uses placeholder SMTP settings
- For production, you would need a proper email service (SendGrid, Mailgun, etc.)
- Local email preview works without any external services
