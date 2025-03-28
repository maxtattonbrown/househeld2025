# HouseHeld Maintenance Jobs Database

This document outlines the initial set of common household maintenance tasks we'll include in our MVP. Each job has attributes that help us match it to the right properties and schedule it appropriately.

## Job Attributes

Each maintenance job in our database includes:

- **Name**: Clear, concise title
- **Description**: Brief explanation of the task and its importance
- **Frequency**: How often this task should be performed
- **Estimated Cost Range**: Approximate cost in GBP (£)
- **Priority**: Critical, Important, or Routine
- **Applicable Property Types**: Which property types this applies to
- **Applicable Heating Systems**: Which heating systems this applies to
- **Seasonal Timing**: Best time of year to perform the task
- **Property Age Relevance**: Age ranges where this task is applicable
- **Tags**: Categories for grouping related tasks

## Initial Job List (Core 20)

1. **Boiler Service**
   - Frequency: Annual
   - Est. Cost: £80-£120
   - Priority: Critical
   - Heating Systems: Gas, Oil
   - Seasonal: Autumn
   - Ages: All

2. **Gutter Cleaning**
   - Frequency: Annual
   - Est. Cost: £70-£150
   - Priority: Important
   - Property Types: Detached, Semi, Terraced
   - Seasonal: Autumn
   - Ages: All

3. **Chimney Sweep**
   - Frequency: Annual
   - Est. Cost: £50-£90
   - Priority: Critical
   - Property Types: Properties with chimneys
   - Seasonal: Autumn
   - Ages: All properties with active fireplaces

4. **Roof Inspection**
   - Frequency: Every 2-3 years
   - Est. Cost: £100-£250
   - Priority: Important
   - Property Types: Detached, Semi, Terraced
   - Seasonal: Spring/Summer
   - Ages: 10+ years

5. **HVAC Filter Change**
   - Frequency: Every 3-6 months
   - Est. Cost: £10-£30 (DIY)
   - Priority: Important
   - Heating Systems: Forced air systems
   - Seasonal: Quarterly
   - Ages: All

6. **Drain Cleaning**
   - Frequency: Annual
   - Est. Cost: £75-£150
   - Priority: Important
   - Property Types: All
   - Seasonal: Any
   - Ages: All

7. **Pressure Relief Valve Test (Hot Water)**
   - Frequency: Annual
   - Est. Cost: £0 (DIY) or part of boiler service
   - Priority: Critical
   - Property Types: All with hot water systems
   - Seasonal: Any
   - Ages: All

8. **Test Smoke/Carbon Monoxide Alarms**
   - Frequency: Monthly
   - Est. Cost: £0 (DIY)
   - Priority: Critical
   - Property Types: All
   - Seasonal: Monthly
   - Ages: All

9. **Replace Smoke/CO Alarm Batteries**
   - Frequency: Annual
   - Est. Cost: £5-£15 (DIY)
   - Priority: Critical
   - Property Types: All
   - Seasonal: Spring
   - Ages: All

10. **External Wood Treatment/Painting**
    - Frequency: Every 3-5 years
    - Est. Cost: £200-£1000+
    - Priority: Important
    - Property Types: Properties with external wood
    - Seasonal: Summer
    - Ages: All

11. **Check/Clean Extractor Fan Vents**
    - Frequency: Annual
    - Est. Cost: £0 (DIY) or £60-£100
    - Priority: Important
    - Property Types: All
    - Seasonal: Spring
    - Ages: All

12. **Bleed Radiators**
    - Frequency: Annual
    - Est. Cost: £0 (DIY)
    - Priority: Routine
    - Heating Systems: Central heating with radiators
    - Seasonal: Autumn
    - Ages: All

13. **Clear Air Bricks/Vents**
    - Frequency: Annual
    - Est. Cost: £0 (DIY)
    - Priority: Important
    - Property Types: All with air bricks
    - Seasonal: Spring
    - Ages: All

14. **Check Sealant Around Bath/Shower**
    - Frequency: Annual
    - Est. Cost: £0 (DIY check) / £20-£50 (replacement)
    - Priority: Important
    - Property Types: All
    - Seasonal: Any
    - Ages: All

15. **Clear Washing Machine Filter**
    - Frequency: Every 3-6 months
    - Est. Cost: £0 (DIY)
    - Priority: Routine
    - Property Types: All
    - Seasonal: Quarterly
    - Ages: All

16. **Check/Replace Taps Washers & Seals**
    - Frequency: As needed (check annually)
    - Est. Cost: £5-£30 (DIY) or £60-£100 (plumber)
    - Priority: Routine
    - Property Types: All
    - Seasonal: Any
    - Ages: All

17. **Clean/Service Heat Pump**
    - Frequency: Annual
    - Est. Cost: £120-£200
    - Priority: Critical
    - Heating Systems: Heat pumps
    - Seasonal: Spring
    - Ages: All with heat pumps

18. **Test RCD in Electrical Consumer Unit**
    - Frequency: Every 3 months
    - Est. Cost: £0 (DIY)
    - Priority: Critical
    - Property Types: All
    - Seasonal: Quarterly
    - Ages: All

19. **Electrical Installation Condition Report**
    - Frequency: Every 5-10 years
    - Est. Cost: £150-£300
    - Priority: Important
    - Property Types: All
    - Seasonal: Any
    - Ages: Properties 15+ years old

20. **Check/Clear Drainage Access Points**
    - Frequency: Annual
    - Est. Cost: £0 (DIY check)
    - Priority: Important
    - Property Types: All
    - Seasonal: Spring
    - Ages: All

## Extended Job List (For Future Expansion)

After validating our MVP, we can expand to include:
- Window maintenance
- Loft/attic inspection
- Damp check in vulnerable areas
- Garden drainage check
- Septic tank service (rural properties)
- Tree inspection for properties with large trees
- Fence/boundary maintenance
- Clear moss from roof/paths
- Check pointing on brickwork
- Service garage door
- Annual borescope inspection of inaccessible drain runs
- Check soil stack vent
- Rodent-proofing check

## Matching Logic

Our MVP will use these simple rules to match jobs to properties:

1. Filter by property type (detached, semi, etc)
2. Filter by heating system (gas, electric, etc)
3. Apply age filters (older homes need more checks)
4. Set seasonal schedule based on best practice
5. Sort by priority level

This approach will generate a basic maintenance calendar that covers the most important tasks for any property type.
