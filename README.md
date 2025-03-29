# Plant Database

A comprehensive plant database application built with Deno Fresh and PostgreSQL, following Domain-Driven Design principles.

## Features

- Plant management with detailed information (botanical names, common names, taxonomy)
- Garden planning with beds and plots
- Crop rotation management
- Dictionary and glossary for botanical terms
- Medicinal properties and recipes tracking
- Growing information and seed management

## Technology Stack

- **Frontend**: [Deno Fresh](https://fresh.deno.dev/) with [Preact](https://preactjs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/)
- **Database**: PostgreSQL 17 with [Drizzle ORM](https://orm.drizzle.team/)
- **Backup Database**: Firebase
- **Architecture**: Domain-Driven Design (DDD)

## Project Structure

The application follows Domain-Driven Design principles with bounded contexts:

- **Plant Management**: Core plant information and properties
- **Garden Management**: Garden beds, plots, and planning
- **Dictionary/Glossary**: Terminology management
- **User Management**: Authentication and authorization

## Getting Started

### Prerequisites

- [Deno](https://deno.land/manual/getting_started/installation)
- PostgreSQL 17
- Firebase account (for backup database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DarbeesChasingRainbows/plant-database.git
   cd plant-database
   ```

2. Create a `.env.local` file with your database credentials

3. Run database migrations:
   ```bash
   deno task migrate
   ```

4. Start the development server:
   ```bash
   deno task start
   ```

## Routes

### Plant Management
- `/admin/plants` - Plant listing
- `/admin/plants/new` - Create a new plant
- `/admin/plants/[id]` - Plant details
- `/admin/plants/edit/[id]` - Edit a plant
- `/admin/plants/[id]/actions` - Plant actions
- `/admin/plants/[id]/medicinal` - Medicinal properties
- `/admin/plants/[id]/recipes` - Plant recipes
- `/admin/plants/[id]/growing` - Growing information
- `/admin/plants/[id]/seeds` - Seed management

### Garden Management
- `/admin/garden/plots` - Garden plots listing
- `/admin/garden/plots/new` - Create a new plot
- `/admin/garden/plots/[id]` - Plot details
- `/admin/garden/plots/edit/[id]` - Edit a plot

## License

MIT