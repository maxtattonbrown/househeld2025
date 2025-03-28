// Simple email generator for HouseHeld MVP
// This script processes the maintenance schedule and sends a focused email
// with only the current month's priority tasks

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer'); // You'll need to npm install this

// Configuration - CHANGE THESE VALUES
const config = {
  recipientEmail: 'your-email@example.com', // CHANGE THIS to your actual email
  fromEmail: 'househeld@example.com', // Will need to be configured with your email provider
  emailSubject: 'Your Home Maintenance Tasks This Month',
  // For testing, we'll use Ethereal (fake SMTP service)
  // For production, replace with your actual SMTP settings
  smtp: {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'YOUR_ETHEREAL_USERNAME', // Get from ethereal.email
      pass: 'YOUR_ETHEREAL_PASSWORD'  // Get from ethereal.email
    }
  }
};

// Load data
const homeProfile = JSON.parse(fs.readFileSync(path.join(__dirname, 'home_profile.json'), 'utf8'));
const jobsDatabase = JSON.parse(fs.readFileSync(path.join(__dirname, 'jobs.json'), 'utf8'));
const tradespeopleData = JSON.parse(fs.readFileSync(path.join(__dirname, 'tradespeople.json'), 'utf8'));

// Month mapping for season-based scheduling
const seasonToMonths = {
  "Spring": [3, 4, 5],
  "Summer": [6, 7, 8],
  "Autumn": [9, 10, 11],
  "Winter": [12, 1, 2],
  "Spring/Summer": [4, 5, 6, 7],
  "Autumn/Winter": [10, 11, 12, 1],
  "Spring and Autumn": [4, 10],
  "Any": [3, 6, 9, 12], // quarterly
  "Autumn/Early Winter": [10, 11]
};

// Parse complex seasons
function getMonthsForSeason(season) {
  // Handle direct matches first
  if (seasonToMonths[season]) {
    return seasonToMonths[season];
  }
  
  // Handle more complex descriptions
  if (season.includes("Summer") && season.includes("Autumn")) {
    return [8, 9]; // Late summer/early autumn
  }
  
  // Default
  console.log(`Couldn't parse season: ${season}`);
  return [6];
}

// Match jobs to this home profile
function matchJobs(homeProfile, jobsDatabase) {
  const matchedJobs = [];
  
  jobsDatabase.forEach(job => {
    // Skip jobs that don't apply to this property age
    if (!job.applicablePropertyAges.includes(homeProfile.property.age)) {
      return;
    }
    
    // Skip jobs for features this home doesn't have
    if (
      (job.name.includes("Solar") && !homeProfile.exterior.hasSolarPanels) ||
      (job.name.includes("Battery") && !homeProfile.services.hasBattery) ||
      (job.name.includes("Septic") && !homeProfile.services.water.hasSepticTank) ||
      (job.name.includes("Oil") && homeProfile.services.heating.primaryType !== "Oil boiler") ||
      (job.name.includes("Chimney") && !homeProfile.exterior.roof.hasChimney) ||
      (job.name.includes("Conservatory") && !homeProfile.exterior.hasConservatory) ||
      (job.name.includes("Heat Pump") && !homeProfile.services.heating.primaryType.includes("Heat pump"))
    ) {
      return;
    }
    
    // Handle specific driveway types
    if (job.name.includes("Driveway")) {
      // Skip if it's a specific driveway job that doesn't match this home's driveway
      if (job.name.toLowerCase().includes("gravel") && homeProfile.grounds.drivewayType !== "Gravel") {
        return;
      }
      if (job.name.toLowerCase().includes("block paving") && homeProfile.grounds.drivewayType !== "Block Paving") {
        return;
      }
      if (job.name.toLowerCase().includes("tarmac") && homeProfile.grounds.drivewayType !== "Tarmac") {
        return;
      }
    }
    
    // This job applies - add it to matched jobs
    matchedJobs.push(job);
  });
  
  return matchedJobs;
}

// Schedule jobs across the year based on their recommended season
function scheduleJobs(matchedJobs) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based
  
  const scheduledJobs = [];
  
  matchedJobs.forEach(job => {
    // Get appropriate months for this job
    const months = getMonthsForSeason(job.season);
    
    // For the MVP, just pick the first available month that hasn't passed yet this year
    let scheduledMonth = months[0];
    for (const month of months) {
      if (month >= currentMonth) {
        scheduledMonth = month;
        break;
      }
    }
    
    // If all recommended months have passed, schedule for next year's first recommended month
    if (scheduledMonth < currentMonth) {
      scheduledJobs.push({
        ...job,
        scheduledMonth,
        scheduledYear: currentYear + 1
      });
    } else {
      scheduledJobs.push({
        ...job,
        scheduledMonth,
        scheduledYear: currentYear
      });
    }
  });
  
  // Sort jobs by scheduled date
  return scheduledJobs.sort((a, b) => {
    if (a.scheduledYear !== b.scheduledYear) {
      return a.scheduledYear - b.scheduledYear;
    }
    return a.scheduledMonth - b.scheduledMonth;
  });
}

// Find relevant tradespeople for a job
function findRelevantTradespeople(job, tradespeopleData) {
  const relevantTrades = [];
  
  tradespeopleData.trades.forEach(trade => {
    // Check if trade's category matches job's area
    const tradeCategory = tradespeopleData.categories.find(cat => cat.id === trade.category);
    if (tradeCategory && tradeCategory.areas.includes(job.area)) {
      // Check if trade's tags match job keywords
      const jobKeywords = job.name.toLowerCase().split(' ');
      const hasMatchingTag = trade.tags.some(tag => {
        const tagData = tradespeopleData.tagList.find(t => t.name === tag);
        return tagData && tagData.keywords.some(keyword => 
          jobKeywords.includes(keyword.toLowerCase())
        );
      });
      
      if (hasMatchingTag) {
        relevantTrades.push(trade);
      }
    }
  });
  
  return relevantTrades;
}

// Filter jobs for the current month only
function getCurrentMonthJobs(scheduledJobs) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  return scheduledJobs.filter(job => 
    job.scheduledMonth === currentMonth && 
    job.scheduledYear === currentYear
  );
}

// Generate the HTML email content
function generateEmailHtml(currentMonthJobs, homeProfile, tradespeopleData) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const now = new Date();
  const currentMonthName = months[now.getMonth()];
  
  let html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Your Home Maintenance Tasks for ${currentMonthName}</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
      }
      .header {
        background-color: #3498db;
        color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
      }
      .job {
        margin-bottom: 25px;
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .job.high {
        border-left: 4px solid #e74c3c;
      }
      .job.medium-high {
        border-left: 4px solid #f39c12;
      }
      .job.medium {
        border-left: 4px solid #3498db;
      }
      .job h3 {
        margin-top: 0;
        color: #2c3e50;
      }
      .job-meta {
        font-size: 14px;
        margin-bottom: 10px;
        color: #7f8c8d;
      }
      .job-description {
        margin-bottom: 15px;
      }
      .tradesperson {
        background-color: #f9f9f9;
        padding: 10px;
        margin-top: 10px;
        border-radius: 3px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #7f8c8d;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>HouseHeld</h1>
      <h2>Home Maintenance for ${currentMonthName}</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Here are your recommended home maintenance tasks for ${currentMonthName}:</p>
  `;
  
  if (currentMonthJobs.length === 0) {
    html += `
      <p style="font-size: 18px; text-align: center; margin: 30px 0;">
        Good news! No maintenance tasks are scheduled for this month.
      </p>
      <p>Your next scheduled tasks will appear in the coming months. We'll send you a reminder when it's time.</p>
    `;
  } else {
    currentMonthJobs.forEach(job => {
      const priorityClass = job.priority.toLowerCase().replace(' ', '-');
      const relevantTrades = findRelevantTradespeople(job, tradespeopleData);
      
      html += `
        <div class="job ${priorityClass}">
          <h3>${job.name}</h3>
          <div class="job-meta">
            <strong>Priority:</strong> ${job.priority} | 
            <strong>Cost:</strong> ${job.costEstimate}
          </div>
          <div class="job-description">${job.description}</div>
      `;
      
      if (relevantTrades.length > 0) {
        html += `<div><strong>Recommended Tradespeople:</strong></div>`;
        
        relevantTrades.forEach(trade => {
          html += `
            <div class="tradesperson">
              <strong>${trade.company || trade.name}</strong><br>
              ${trade.phone ? `Tel: ${trade.phone}<br>` : ''}
              ${trade.email ? `Email: ${trade.email}<br>` : ''}
              ${trade.website ? `Web: <a href="${trade.website}">${trade.website}</a><br>` : ''}
              ${trade.notes ? `<em>${trade.notes}</em>` : ''}
            </div>
          `;
        });
      }
      
      html += `</div>`;
    });
  }
  
  html += `
      <p>We'll send you reminders for your upcoming tasks each month.</p>
      <p>Best regards,<br>The HouseHeld Team</p>
    </div>
    <div class="footer">
      <p>© 2024 HouseHeld | Your home, maintained effortlessly</p>
    </div>
  </body>
  </html>
  `;
  
  return html;
}

// Send the email
async function sendEmail(emailHtml) {
  // Create reusable transporter
  let transporter = nodemailer.createTransport(config.smtp);
  
  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"HouseHeld" <${config.fromEmail}>`,
    to: config.recipientEmail,
    subject: config.emailSubject,
    html: emailHtml
  });
  
  console.log(`Message sent: ${info.messageId}`);
  
  // Preview URL (only for ethereal emails)
  if (config.smtp.host.includes('ethereal')) {
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }
  
  return info;
}

// Main function
async function main() {
  try {
    // Process the data
    const matchedJobs = matchJobs(homeProfile, jobsDatabase);
    console.log(`Found ${matchedJobs.length} matching jobs for this property`);
    
    const scheduledJobs = scheduleJobs(matchedJobs);
    
    // Get only current month's jobs
    const currentMonthJobs = getCurrentMonthJobs(scheduledJobs);
    console.log(`Found ${currentMonthJobs.length} jobs for the current month`);
    
    // Generate email HTML
    const emailHtml = generateEmailHtml(currentMonthJobs, homeProfile, tradespeopleData);
    
    // For testing: save the HTML email to a file
    fs.writeFileSync(path.join(__dirname, 'email_preview.html'), emailHtml);
    console.log('Email preview saved to email_preview.html');
    
    // Send the email
    if (process.env.SEND_EMAIL === 'true') {
      await sendEmail(emailHtml);
      console.log('Email sent successfully!');
    } else {
      console.log('Email sending skipped (set SEND_EMAIL=true to send)');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main();
