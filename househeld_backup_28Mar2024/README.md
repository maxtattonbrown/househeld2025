# HouseHeld

## Core Problem
Homeowners face uncertainty that creates anxiety. Especially in first time buyers.

## Solution Approach
Change uncertainty into informed confidence through:
1. **Knowledge** — Automatically detect and list your jobs + tradespeople with priorities, costs
2. **Action** — Schedule & reach out automatically when work needs to be done.

## Core Product Goal: Home Assurance
A preventive insight system that conquers threats before they become expensive, WITHOUT STRESS.

## Technical Architecture

### MVP Components
1. **Jobs Database** 
   - Curated list of 20-50 common household maintenance tasks
   - Each job includes: frequency, priority level, estimated cost, seasonal timing
   - Jobs tagged by property attributes (age, type, heating system)

2. **Home Profile**
   - Simple user data model capturing critical home attributes
   - Links to personalized maintenance calendar
   - Optional storage for preferred tradespeople contacts

3. **Scheduler**
   - Generates email reminders for upcoming maintenance
   - Simple HTML email templates with clear calls to action
   - Tracking for user engagement with notifications

### MVP Entry Strategy
For initial testing, we'll implement the **Quick Profile approach**:
- 5 essential questions (age, type, size, heating system, location)
- Takes under 2 minutes to complete
- Immediately generates a personalized maintenance calendar

### Tech Stack
- **Frontend**: React with Tailwind CSS (fast development, responsive design)
- **Backend**: Node.js with Express (lightweight API)
- **Database**: MongoDB (flexible schema for early iterations)
- **Email**: SendGrid for notifications
- **Hosting**: Vercel for frontend, Railway for backend

### MVP Success Metrics
- User acquisition cost
- Onboarding completion rate
- Email open/click rates
- User retention at 30 days
- Qualitative feedback on value proposition

## Development Phases
1. **Foundation (Week 1-2)**
   - Build core jobs database
   - Create simple onboarding flow
   - Implement basic user accounts

2. **Engine (Week 3-4)**
   - Develop job matching algorithm
   - Create maintenance calendar generation
   - Set up email notification system

3. **Testing (Week 5-6)**
   - Launch to small test group
   - Collect initial feedback
   - Iterate on highest impact areas

## Beyond MVP
If initial testing validates our approach, consider:
- **Survey Import**: Parse PDF surveys for richer home data
- **Tradesperson Network**: Build local provider directories
- **Smart Home Integration**: Connect with IoT devices for automated monitoring
