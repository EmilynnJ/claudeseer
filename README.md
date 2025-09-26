# SoulSeer - Mystical Psychic Reading Platform

A comprehensive psychic reading platform built with SvelteKit and FastAPI, featuring real-time WebRTC communication, Stripe payments, and a mystical dark theme.

## Features

🔮 **Pay-per-minute readings** (chat, voice, video)  
📅 **Scheduled flat-rate readings**  
🎥 **Live streaming with virtual gifting**  
💰 **Stripe Connect payments** (70/30 split)  
🎨 **Mystical UI** with dark theme  
📱 **Mobile responsive** design  
🔒 **Secure authentication** with Clerk  
💬 **Real-time messaging**  
🛒 **Marketplace** for services & products  
👥 **Community forum**  
📊 **Comprehensive dashboards**  

## Tech Stack

- **Frontend:** SvelteKit + TailwindCSS
- **Backend:** Python FastAPI
- **Database:** Neon PostgreSQL
- **Authentication:** Clerk
- **Payments:** Stripe Connect
- **Real-time:** WebRTC + WebSockets
- **Deployment:** Docker + Vercel/Netlify

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL (or Neon account)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd soulseer
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Environment Variables**
```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env with your actual values
```

5. **Database Setup**
```bash
# Run database migrations
cd backend
alembic upgrade head
```

6. **Start Development Servers**
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Project Structure

```
soulseer/
├── backend/                 # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── api/            # API routes
│   │   ├── core/           # Core configuration
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── websockets/     # WebSocket handlers
│   ├── requirements.txt
│   └── .env
├── frontend/               # SvelteKit Frontend
│   ├── src/
│   │   ├── routes/         # Page routes
│   │   ├── lib/            # Components & utilities
│   │   └── app.html
│   ├── package.json
│   └── vite.config.js
└── docker-compose.yml      # Development environment
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost/soulseer
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
TURN_SERVERS=relay1.expressturn.com:3480
TURN_USERNAME=your_username
TURN_CREDENTIAL=your_credential
```

### Frontend (.env)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:8000
```

## Key Features Implementation

### WebRTC System
- Custom WebRTC implementation (no SDKs)
- Real-time video/audio communication
- STUN/TURN server support
- Connection management and reconnection

### Payment System
- Stripe Connect for reader payouts
- Per-minute billing with real-time updates
- 70/30 revenue split
- Automatic payout processing

### User Roles
- **Clients**: Book readings, join streams, purchase products
- **Readers**: Provide services, manage availability, track earnings
- **Admins**: Platform management, user oversight, analytics

## Development Status

✅ Core infrastructure and routing  
✅ Authentication system with Clerk  
✅ Database models and API routes  
✅ WebRTC implementation  
✅ Payment processing with Stripe  
✅ Real-time messaging  
✅ Live streaming with gifting  
✅ Admin dashboard  
✅ Mobile responsive design  

## Deployment

### Docker
```bash
docker-compose up -d
```

### Manual Deployment
- **Backend**: Deploy to Railway, Render, or similar
- **Frontend**: Deploy to Vercel or Netlify
- **Database**: Use Neon PostgreSQL

## License

Private - All rights reserved

## Support

For technical support or questions, please contact the development team.