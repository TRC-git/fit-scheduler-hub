# Fitness Class Scheduling System

A comprehensive web application for managing fitness class schedules, instructors, and class types.

## Table of Contents
- [Installation](#installation)
- [Supabase Setup](#supabase-setup)
- [Features](#features)
- [Usage Guide](#usage-guide)

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
```

2. Navigate to the project directory:
```bash
cd <project-directory>
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## Supabase Setup

This application uses Supabase for backend functionality. To set up Supabase:

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key from the project settings
4. The project is already configured to use Supabase - no additional setup required!

## Features

### Schedule Management
- Interactive weekly schedule view
- Drag-and-drop appointment management
- Copy and paste appointments
- Mark non-operational days

### Class Types
- Create and manage different class types
- Set operational days for each class type
- Configure time slots per class type
- Customize class duration

### Templates
- Create schedule templates
- Apply templates to different time periods
- Manage recurring schedules

## Usage Guide

### Managing the Schedule

1. **Viewing the Schedule**
   - The main page displays a weekly schedule grid
   - Time slots are shown vertically
   - Days of the week are shown horizontally

2. **Adding Appointments**
   - Click the "+" button in any empty time slot
   - Select an instructor and class type
   - Click "Add Appointment" to confirm

3. **Moving Appointments**
   - Drag and drop appointments between time slots
   - The system will prevent dropping on non-operational days

4. **Copying Appointments**
   - Click the copy icon on any appointment
   - Click on an empty slot to paste
   - Click the copy icon again to cancel

### Managing Class Types

1. **Creating a Class Type**
   - Go to Settings > Schedule Templates
   - Click "Add Schedule Type"
   - Fill in the name and duration
   - Select operational days
   - Add time slots for each day

2. **Editing Class Types**
   - Click the edit icon on any class type
   - Modify details as needed
   - Save changes

3. **Time Slots**
   - Add multiple time slots per day
   - Copy time slots to other operational days
   - Set start and end times for each slot

### Using Templates

1. **Creating Templates**
   - Navigate to Settings > Schedule Templates
   - Create a new template with a name
   - Set the recurring pattern (weekly, biweekly, monthly)
   - Add appointments to the template

2. **Applying Templates**
   - Select a template from the templates list
   - Choose the date range for application
   - Apply the template to create scheduled appointments

### Best Practices

- Regularly review and update operational days
- Use templates for recurring schedules
- Check for schedule conflicts before confirming appointments
- Keep class types and instructor information up to date

## Support

For additional support or questions, please refer to:
- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request