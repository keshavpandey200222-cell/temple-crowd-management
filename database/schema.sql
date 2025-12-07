-- Temple Crowd Management System Database Schema

-- Users Table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'visitor' CHECK (role IN ('visitor', 'admin', 'staff')),
    language_preference VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Temple Zones Table
CREATE TABLE temple_zones (
    zone_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_name VARCHAR(100) NOT NULL UNIQUE,
    zone_type VARCHAR(50) NOT NULL CHECK (zone_type IN ('darshan', 'prasad', 'waiting', 'parking', 'facility')),
    max_capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,
    alert_threshold INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE bookings (
    booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    slot_time TIME NOT NULL,
    booking_type VARCHAR(50) DEFAULT 'regular' CHECK (booking_type IN ('regular', 'vip', 'senior', 'special')),
    number_of_people INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
    qr_code VARCHAR(255) UNIQUE,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_amount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(slot_date, slot_time, booking_type)
);

-- Queues Table
CREATE TABLE queues (
    queue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_name VARCHAR(100) NOT NULL,
    zone_id UUID REFERENCES temple_zones(zone_id) ON DELETE CASCADE,
    queue_type VARCHAR(50) DEFAULT 'regular' CHECK (queue_type IN ('regular', 'vip', 'senior', 'special')),
    current_count INTEGER DEFAULT 0,
    max_capacity INTEGER NOT NULL,
    estimated_wait_time INTEGER DEFAULT 0, -- in minutes
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Queue Entries Table
CREATE TABLE queue_entries (
    entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_id UUID REFERENCES queues(queue_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(booking_id) ON DELETE SET NULL,
    position INTEGER NOT NULL,
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_service_time TIMESTAMP,
    status VARCHAR(50) DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_service', 'completed', 'cancelled')),
    exit_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crowd Monitoring Table
CREATE TABLE crowd_monitoring (
    monitor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID REFERENCES temple_zones(zone_id) ON DELETE CASCADE,
    occupancy_count INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    alert_level VARCHAR(20) DEFAULT 'green' CHECK (alert_level IN ('green', 'yellow', 'red')),
    sensor_data JSONB, -- For IoT sensor data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Events Table
CREATE TABLE analytics_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    zone_id UUID REFERENCES temple_zones(zone_id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    event_data JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Slot Configuration Table
CREATE TABLE slot_configuration (
    slot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_time TIME NOT NULL,
    slot_type VARCHAR(50) NOT NULL CHECK (slot_type IN ('regular', 'vip', 'senior', 'special')),
    max_bookings INTEGER NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    days_of_week INTEGER[] DEFAULT ARRAY[0,1,2,3,4,5,6], -- 0=Sunday, 6=Saturday
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('booking', 'queue', 'alert', 'general')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    sent_via VARCHAR(50)[] DEFAULT ARRAY['app'], -- app, email, sms
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff Allocation Table
CREATE TABLE staff_allocation (
    allocation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    zone_id UUID REFERENCES temple_zones(zone_id) ON DELETE CASCADE,
    shift_start TIMESTAMP NOT NULL,
    shift_end TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Alerts Table
CREATE TABLE emergency_alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID REFERENCES temple_zones(zone_id) ON DELETE SET NULL,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('overcrowding', 'emergency', 'maintenance', 'security')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(slot_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_queue_entries_queue ON queue_entries(queue_id);
CREATE INDEX idx_queue_entries_user ON queue_entries(user_id);
CREATE INDEX idx_crowd_monitoring_zone ON crowd_monitoring(zone_id);
CREATE INDEX idx_crowd_monitoring_timestamp ON crowd_monitoring(timestamp);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Create Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_temple_zones_updated_at BEFORE UPDATE ON temple_zones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_queues_updated_at BEFORE UPDATE ON queues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_slot_configuration_updated_at BEFORE UPDATE ON slot_configuration
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_allocation_updated_at BEFORE UPDATE ON staff_allocation
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
