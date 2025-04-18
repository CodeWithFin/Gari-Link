# GariLink Car Maintenance App - Project Planning

## Project Overview
GariLink is a comprehensive car maintenance and tracking application built with React Native and Supabase. The app helps users maintain their vehicles, track expenses, log trips, and build good car maintenance habits through gamification.

## Timeline
- **Phase 1 (MVP)**: 6-8 weeks
- **Phase 2 (Secondary Features)**: 4-6 weeks
- **Phase 3 (Advanced Features)**: 4-6 weeks
- **Testing & Refinement**: 2-4 weeks

## Technology Stack
### Frontend
- **Core Framework**: React Native with Expo
- **UI/Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Query + Zustand
- **Animations**: React Native Reanimated

### Backend (Supabase-focused)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Functions**: Supabase Edge Functions
- **Realtime**: Supabase Realtime for updates

### Other Tools
- **Push Notifications**: OneSignal + Expo Notifications
- **Maps & Location**: Expo Location + Google Maps API
- **Analytics**: Amplitude
- **Error Tracking**: Sentry
- **Deployment**: Expo EAS Build & Submit

## Database Schema (Supabase PostgreSQL)

### Users Table
```sql
create table users (
  id uuid references auth.users not null primary key,
  email text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Vehicles Table
```sql
create table vehicles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade not null,
  name text not null,
  make text not null,
  model text not null,
  year integer not null,
  color text,
  license_plate text,
  vin text,
  avatar_url text,
  mileage integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Maintenance Records Table
```sql
create table maintenance_records (
  id uuid default uuid_generate_v4() primary key,
  vehicle_id uuid references vehicles(id) on delete cascade not null,
  service_type text not null,
  description text,
  date timestamp with time zone not null,
  mileage integer not null,
  cost decimal(10,2),
  receipt_url text,
  reminder_mileage integer,
  reminder_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### Fuel Logs Table
```sql
create table fuel_logs (
  id uuid default uuid_generate_v4() primary key,
  vehicle_id uuid references vehicles(id) on delete cascade not null,
  date timestamp with time zone not null,
  fuel_amount decimal(10,2) not null,
  cost decimal(10,2) not null,
  mileage integer not null,
  full_tank boolean default true,
  station text,
  created_at timestamp with time zone default now()
);
```

### Trips Table
```sql
create table trips (
  id uuid default uuid_generate_v4() primary key,
  vehicle_id uuid references vehicles(id) on delete cascade not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  start_location text,
  end_location text,
  distance decimal(10,2),
  start_mileage integer,
  end_mileage integer,
  purpose text,
  created_at timestamp with time zone default now()
);
```

### User Achievements Table
```sql
create table achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade not null,
  vehicle_id uuid references vehicles(id) on delete cascade,
  achievement_type text not null,
  earned_at timestamp with time zone default now(),
  points integer default 0
);
```

### Documents Table
```sql
create table documents (
  id uuid default uuid_generate_v4() primary key,
  vehicle_id uuid references vehicles(id) on delete cascade not null,
  name text not null,
  document_type text not null,
  file_url text not null,
  expiry_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

## Security Considerations
- Implement Row Level Security policies in Supabase
- Use Supabase Storage with appropriate bucket policies
- Secure API keys with environment variables and Expo's SecureStore
- Implement proper authentication flows with Supabase Auth and JWT tokens

## Feature Phases

### Phase 1 (MVP)
- User Authentication
- Vehicle Profiles
- Maintenance Tracking + Reminders
- Fuel & Expense Logging
- Trip & Mileage Tracker
- Offline Data Sync (basic)

### Phase 2
- Streaks (Maintenance/Fuel Habits)
- Car Document Vault
- Dashboard & Analytics
- Push Notifications
- Dark Mode & Accessibility
- Multi-Car Support

### Phase 3
- Gamification (Points & Badges)
- Community Feed
- Daily Car Tips / Weekly Reports
- Garage/Mechanic Locator
- Eco Driving Score
- Custom Car Avatars / Themes

## Testing Strategy
- Unit Tests: Jest for utility functions and hooks
- Component Tests: React Native Testing Library
- Integration Tests: Detox for E2E testing
- User Testing: TestFlight & Google Play Beta
- Performance Testing: Profiling with Flipper

## Launch Strategy
- Soft launch with TestFlight & Google Play internal testing
- Beta program with 100-200 users
- Marketing preparation during beta
- Full launch to App Store & Google Play
- Post-launch monitoring with Sentry & Analytics