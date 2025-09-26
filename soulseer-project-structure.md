# SoulSeer Project Structure

## Tech Stack
- **Frontend**: SvelteKit 2.0
- **Backend**: Python FastAPI
- **Database**: PostgreSQL (Neon)
- **Auth**: Clerk
- **Payments**: Stripe Connect
- **Real-time**: WebRTC + WebSockets
- **Styling**: TailwindCSS

## Project Structure

```
soulseer/
├── frontend/                 # SvelteKit Application
│   ├── src/
│   │   ├── routes/
│   │   │   ├── +layout.svelte
│   │   │   ├── +page.svelte
│   │   │   ├── auth/
│   │   │   ├── readings/
│   │   │   ├── live/
│   │   │   ├── shop/
│   │   │   ├── community/
│   │   │   ├── dashboard/
│   │   │   │   ├── client/
│   │   │   │   ├── reader/
│   │   │   │   └── admin/
│   │   │   └── api/
│   │   ├── lib/
│   │   │   ├── components/
│   │   │   ├── stores/
│   │   │   ├── webrtc/
│   │   │   ├── utils/
│   │   │   └── clerk.js
│   │   └── app.html
│   ├── static/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Python FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── readings.py
│   │   │   ├── streaming.py
│   │   │   ├── payments.py
│   │   │   ├── marketplace.py
│   │   │   └── admin.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── reading.py
│   │   │   ├── product.py
│   │   │   └── payment.py
│   │   ├── services/
│   │   │   ├── webrtc_signaling.py
│   │   │   ├── stripe_service.py
│   │   │   └── clerk_service.py
│   │   └── websockets/
│   │       └── connection_manager.py
│   ├── requirements.txt
│   └── .env
│
└── docker-compose.yml

```

## Initial Setup Commands

### Frontend (SvelteKit)
```bash
npm create svelte@latest frontend
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms
npm install @clerk/clerk-js stripe-js socket.io-client
npx tailwindcss init -p
```

### Backend (Python FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn[standard] python-socketio stripe clerk-backend-api
pip install sqlalchemy asyncpg python-dotenv pydantic
pip install python-multipart aiofiles
```

## Database Schema (PostgreSQL/Neon)

```sql
-- Users table (synced with Clerk)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('client', 'reader', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reader profiles
CREATE TABLE reader_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_image VARCHAR(500),
    specialties TEXT[],
    chat_rate DECIMAL(10,2),
    phone_rate DECIMAL(10,2),
    video_rate DECIMAL(10,2),
    is_online BOOLEAN DEFAULT false,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    rating DECIMAL(3,2),
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Client profiles
CREATE TABLE client_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) DEFAULT 0,
    auto_reload_enabled BOOLEAN DEFAULT false,
    auto_reload_amount DECIMAL(10,2),
    auto_reload_threshold DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reading sessions
CREATE TABLE reading_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reader_id UUID REFERENCES users(id),
    client_id UUID REFERENCES users(id),
    session_type VARCHAR(50) CHECK (session_type IN ('chat', 'phone', 'video')),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_minutes INTEGER,
    rate_per_minute DECIMAL(10,2),
    total_charged DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    room_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Live streams
CREATE TABLE live_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reader_id UUID REFERENCES users(id),
    title VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    viewer_count INTEGER DEFAULT 0,
    total_gifts_value DECIMAL(10,2) DEFAULT 0,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    stream_key VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Virtual gifts
CREATE TABLE virtual_gifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id),
    recipient_id UUID REFERENCES users(id),
    stream_id UUID REFERENCES live_streams(id),
    gift_type VARCHAR(100),
    gift_value DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products (marketplace)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(id),
    stripe_product_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    product_type VARCHAR(50) CHECK (product_type IN ('service', 'digital', 'physical')),
    price DECIMAL(10,2),
    inventory_count INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    stripe_payment_intent_id VARCHAR(255),
    amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id),
    recipient_id UUID REFERENCES users(id),
    content TEXT,
    is_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reader_id UUID REFERENCES users(id),
    client_id UUID REFERENCES users(id),
    session_id UUID REFERENCES reading_sessions(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

### Frontend (.env)
```env
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
PUBLIC_API_URL=http://localhost:8000
PUBLIC_WS_URL=ws://localhost:8000
PUBLIC_TURN_SERVERS=relay1.expressturn.com:3480
PUBLIC_TURN_USERNAME=efC31HLVNPO2ESV7EI
PUBLIC_TURN_CREDENTIAL=p3iL2wVPAhMAlmgD
```

### Backend (.env)
```env
DATABASE_URL=postgresql://...@neon.tech/neondb
CLERK_SECRET_KEY=sk_test_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
ADMIN_EMAIL=emilynnj14@gmail.com
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=["http://localhost:5173"]
```

## Key Implementation Notes

1. **WebRTC Implementation**: Pure vanilla WebRTC APIs with custom signaling server
2. **Payment Flow**: Stripe Connect for 70/30 revenue split
3. **Real-time Billing**: WebSocket-based minute tracking with automatic charging
4. **Authentication**: Clerk integration with role-based access
5. **Styling**: Dark mode default with pink (#FF69B4), black, gold, and white accents
6. **Fonts**: Alex Brush for headers, Playfair Display for body text
7. **Security**: End-to-end encryption for communications, PCI compliance for payments