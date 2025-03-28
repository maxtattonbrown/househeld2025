# HouseHeld Technical Architecture

## MVP Architecture Overview

We're optimizing for speed and validation, not scalability. This architecture focuses on proving our concept works before investing in complex infrastructure.

```
+------------------+      +--------------------+      +-------------------+
|                  |      |                    |      |                   |
|  Web Frontend    +----->+  Backend API       +----->+  Database         |
|  (React)         |      |  (Node.js/Express) |      |  (MongoDB)        |
|                  |      |                    |      |                   |
+------------------+      +--------------------+      +-------------------+
                                   |
                                   |
                                   v
                          +-------------------+
                          |                   |
                          |  Email Service    |
                          |  (SendGrid)       |
                          |                   |
                          +-------------------+
```

## Data Models

### User
```json
{
  "id": "uuid",
  "email": "string",
  "name": "string",
  "createdAt": "timestamp",
  "lastLoginAt": "timestamp"
}
```

### HomeProfile
```json
{
  "id": "uuid",
  "userId": "uuid",
  "propertyAge": "number", // Year built or range
  "propertyType": "enum", // Detached, Semi, Terraced, Flat
  "propertySize": "enum", // Small, Medium, Large
  "heatingSystem": "enum", // Gas, Electric, Oil, Heat Pump
  "location": "string", // Postcode area or region
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### MaintenanceJob
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "frequency": "string", // e.g., "Annual", "Bi-annual", "Every 5 years"
  "estimatedCostMin": "number",
  "estimatedCostMax": "number",
  "priority": "enum", // Critical, Important, Routine
  "applicablePropertyTypes": ["enum"], // Which property types this applies to
  "applicableHeatingTypes": ["enum"], // Which heating systems this applies to
  "seasonalTiming": ["enum"], // Spring, Summer, Autumn, Winter
  "applicablePropertyAgeMin": "number", // Minimum property age this applies to
  "applicablePropertyAgeMax": "number", // Maximum property age this applies to
  "tags": ["string"]
}
```

### UserCalendar
```json
{
  "id": "uuid",
  "userId": "uuid",
  "jobs": [
    {
      "jobId": "uuid",
      "scheduledDate": "date",
      "status": "enum", // Pending, Notified, Completed, Skipped
      "notificationSent": "boolean",
      "notificationDate": "timestamp"
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### TradespersonContact (Optional for MVP)
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "string",
  "businessName": "string",
  "phoneNumber": "string",
  "email": "string",
  "specialty": ["string"], // e.g., "Plumber", "Electrician"
  "notes": "string"
}
```

## Key Functionality

### Onboarding Flow
1. Simple signup (email + password)
2. 5-question home profile (one question per screen)
3. Generate initial maintenance calendar
4. Show immediate value (next 3 maintenance items)

### Job Matching Algorithm
A simple rule-based system for MVP:
1. Filter jobs by property type match
2. Filter by heating system match
3. Filter by property age range match
4. Apply seasonal timing
5. Sort by priority

### Notification Engine
1. Daily check for upcoming maintenance (30, 14, 7, 3 days out)
2. Send simple HTML emails with:
   - Job details and importance
   - Estimated cost range
   - Simple "Mark as Done" button (tracking link)
   - Option to snooze or reschedule

## Tech Implementation Notes

### Frontend
- Next.js for React framework (page routing, SSR benefits)
- Tailwind CSS for styling (rapid development)
- Simple form validation with React Hook Form
- Minimal state management (React Context sufficient for MVP)

### Backend
- Express.js REST API
- Simple JWT authentication
- Middleware for request validation
- Structured logging for debugging

### Database
- MongoDB for flexibility during early iterations
- Simple indexes on userId and common query fields
- No complex relations needed for MVP

### Deployment
- Vercel for frontend (easy CI/CD, previews)
- Railway for backend (simple setup, reasonable free tier)
- MongoDB Atlas for database (free tier sufficient for testing)

### Testing Approach
- Manual testing for MVP (save time)
- Focus on end-to-end user flows
- Capture errors with Sentry
