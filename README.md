# BowlingSite691CapUI  
UI for 691 Capstone Bowling Site

## Live Demo
- **UI**: https://bowling-site691-cap-ui.vercel.app  

## Project Overview
The Bowling Hub UI is a React single-page application that lets users register, log in, enter and analyze bowling scores, manage leagues and tournaments, locate nearby bowling alleys, and read/write alley reviews.

## Features
- **User Authentication**: Registration, login, and session management via secure cookies.  
- **Score Tracking & Analytics**: Enter frame-by-frame scores, view total and per-game breakdowns, and see performance insights (average, high score, trend charts).  
- **League Standings**: Join or create leagues, track member rankings, and view standings in real time.  
- **Alley Locator**: Search for bowling alleys by name or location with filters (open now, rating).  
- **Event Management**: Create, join, and view tournaments with schedules and results.  
- **Stretch Features**: Submit and read user reviews and ratings for bowling alleys.

## Tech Stack
- **Frontend Framework:** React v18.x  
- **State Management:** React Context API  
- **Styling:** Tailwind CSS v3.x  
- **Charts:** Recharts  
- **API Communication:** Fetch API with `credentials: 'include'`

| Variable            | Description                                                           |
| ------------------- | --------------------------------------------------------------------- |
| `REACT_APP_API_URL` | Base URL of the backend API (e.g. `https://bowling-api.onrender.com`) |

## Key UI Routes
| Path           | Description                           |
| -------------- | ------------------------------------- |
| `/`            | Home / Login page                     |
| `/register`    | Registration form                     |
| `/game`        | New game entry (frame-by-frame input) |
| `/scores`      | Score summary & performance insights  |
| `/game/:id`    | Single-game detail & breakdown        |
| `/leagues`     | League creation & standings           |
| `/tournaments` | Tournament management                 |
| `/alleys`      | Alley search & details                |
| `/reviews`     | Submit/view alley reviews             |


## Development Workflow
Track tasks in the GitHub Projects section.

Follow Agile sprints based on the UI Back Log.
https://github.com/users/SpicyNine11/projects/3
https://github.com/users/SpicyNine11/projects/5

API Repo - https://github.com/SpicyNine11/Bowlingsite691CapAPI

## Project Structure
src/
  components/   # Reusable UI components (Layout, Forms, Cards, Charts)
  pages/        # High-level page components (Home, GamePage, ScoreSummaryPage, etc.)
  context/      # React Context providers for Auth, Scores, Leagues, etc.
  services/     # API wrapper functions (userService, gameService, leagueService)
  assets/       # Images, icons
  styles/       # Tailwind customization (if any)
  
## Related Repositories
Backend API: https://github.com/NauticalAu/Bowlingsite691CapAPI

## Environment Variables

Copy the template and set your real values before running locally:

```bash
cp .env.example .env
