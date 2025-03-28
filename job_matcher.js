// Simple job matcher for HouseHeld MVP
const fs = require('fs');

// Load data
const homeProfile = JSON.parse(fs.readFileSync('./home_profile.json', 'utf8'));
const jobsDatabase = JSON.parse(fs.readFileSync('./jobs.json', 'utf8'));

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
  
  // Handle more complex descriptions like "Late Summer/Early Autumn"
  if (season.includes("Summer") && season.includes("Autumn")) {
    return [8, 9]; // Late summer/early autumn
  }
  
  // Default to middle of the year if we can't parse
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

// Run the matching and scheduling
const matchedJobs = matchJobs(homeProfile, jobsDatabase);
const scheduledJobs = scheduleJobs(matchedJobs);

// Update the home profile with the scheduled maintenance tasks
homeProfile.maintenanceSchedule = scheduledJobs;

// Save the updated profile
fs.writeFileSync(
  './home_profile_with_schedule.json', 
  JSON.stringify(homeProfile, null, 2)
);

// Create a simple HTML view of the schedule
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>HouseHeld Maintenance Schedule</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .month { margin-bottom: 30px; }
    .month h2 { 
      background-color: #f5f5f5; 
      padding: 10px; 
      border-radius: 5px;
      margin-bottom: 10px;
    }
    .job {
      border-left: 4px solid #ddd;
      padding: 10px;
      margin-bottom: 10px;
      background-color: #f9f9f9;
    }
    .job.high { border-left-color: #ff6b6b; }
    .job.medium-high { border-left-color: #ffa06b; }
    .job.medium { border-left-color: #ffd56b; }
    .job.low-medium, .job.low { border-left-color: #6bff6b; }
    .job h3 { margin-top: 0; }
    .job-meta { color: #666; font-size: 0.9em; margin-bottom: 8px; }
    .job-description { margin-bottom: 10px; }
    .job-details { display: flex; justify-content: space-between; }
    .job-details div { flex: 1; }
  </style>
</head>
<body>
  <h1>HouseHeld Maintenance Schedule</h1>
  <p>Property: ${homeProfile.property.type} (${homeProfile.property.age})</p>
`;

// Group jobs by month/year
const jobsByMonth = {};
scheduledJobs.forEach(job => {
  const key = `${job.scheduledYear}-${job.scheduledMonth}`;
  if (!jobsByMonth[key]) {
    jobsByMonth[key] = [];
  }
  jobsByMonth[key].push(job);
});

// Add each month to the HTML
Object.keys(jobsByMonth).sort().forEach(key => {
  const [year, month] = key.split('-');
  const monthName = months[parseInt(month) - 1];
  
  htmlContent += `
  <div class="month">
    <h2>${monthName} ${year}</h2>
  `;
  
  jobsByMonth[key].forEach(job => {
    const priorityClass = job.priority.toLowerCase().replace(' ', '-');
    
    htmlContent += `
    <div class="job ${priorityClass}">
      <h3>${job.name}</h3>
      <div class="job-meta">
        <strong>Area:</strong> ${job.area} - ${job.subarea} | 
        <strong>Priority:</strong> ${job.priority} | 
        <strong>Frequency:</strong> ${job.frequency}
      </div>
      <div class="job-description">${job.description}</div>
      <div class="job-details">
        <div><strong>Tradesperson:</strong> ${job.tradesperson}</div>
        <div><strong>Estimated Cost:</strong> ${job.costEstimate}</div>
      </div>
    </div>
    `;
  });
  
  htmlContent += `</div>`;
});

htmlContent += `
</body>
</html>
`;

fs.writeFileSync('./maintenance_schedule.html', htmlContent);

console.log(`Found ${matchedJobs.length} maintenance jobs for this property.`);
console.log("Schedule saved to home_profile_with_schedule.json");
console.log("HTML view saved to maintenance_schedule.html");
