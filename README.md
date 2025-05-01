# Sacred Choices

A daily architecture application for optimized performance tracking and personal development.

## Project Structure

```
sacred-choices/
├── app/                    # Next.js frontend components and pages
├── sacred-choices-backend/ # Flask backend
├── public/                # Static assets
└── components/            # Reusable React components
```

## Tech Stack

- **Frontend:**
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Chart.js

- **Backend:**
  - Flask
  - SQLAlchemy
  - PostgreSQL (via Supabase)

- **Deployment:**
  - Frontend: Vercel
  - Backend: Render
  - Database: Supabase

## Local Development

### Prerequisites

- Node.js (v18 or higher)
- Python 3.11 or higher
- pnpm (recommended) or npm
- PostgreSQL (optional, SQLite used by default in development)

### Frontend Setup

```bash
# Install dependencies
pnpm install

# Create .env.local
cp .env.example .env.local

# Start development server
pnpm dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd sacred-choices-backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Start development server
flask run
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
FLASK_ENV=development
DATABASE_URL=your_supabase_connection_string
SECRET_KEY=your_secret_key
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL

### Backend (Render)

1. Push your code to GitHub
2. Create a new Web Service in Render
3. Connect your repository
4. Set environment variables:
   - `FLASK_ENV=production`
   - `DATABASE_URL`: Your Supabase connection string
   - `SECRET_KEY`: A secure random string
   - `ALLOWED_ORIGINS`: Your Vercel frontend URL

### Database (Supabase)

1. Create a new project in Supabase
2. Run the schema.sql file in the SQL editor
3. Get the connection string from Settings > Database
4. Add the connection string to your backend environment variables

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
