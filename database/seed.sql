-- Seed Data for Temple Crowd Management System

-- Insert Temple Zones
INSERT INTO temple_zones (zone_name, zone_type, max_capacity, alert_threshold) VALUES
('Main Darshan Hall', 'darshan', 500, 400),
('VIP Darshan Area', 'darshan', 100, 80),
('Prasad Counter 1', 'prasad', 50, 40),
('Prasad Counter 2', 'prasad', 50, 40),
('Main Waiting Area', 'waiting', 300, 250),
('VIP Waiting Lounge', 'waiting', 80, 60),
('Parking Zone A', 'parking', 200, 180),
('Parking Zone B', 'parking', 150, 130),
('Restroom Block 1', 'facility', 30, 25),
('Restroom Block 2', 'facility', 30, 25);

-- Insert Slot Configuration
INSERT INTO slot_configuration (slot_time, slot_type, max_bookings, price, days_of_week) VALUES
-- Regular Slots
('06:00:00', 'regular', 100, 0.00, ARRAY[0,1,2,3,4,5,6]),
('07:00:00', 'regular', 150, 0.00, ARRAY[0,1,2,3,4,5,6]),
('08:00:00', 'regular', 150, 0.00, ARRAY[0,1,2,3,4,5,6]),
('09:00:00', 'regular', 200, 0.00, ARRAY[0,1,2,3,4,5,6]),
('10:00:00', 'regular', 200, 0.00, ARRAY[0,1,2,3,4,5,6]),
('11:00:00', 'regular', 200, 0.00, ARRAY[0,1,2,3,4,5,6]),
('12:00:00', 'regular', 150, 0.00, ARRAY[0,1,2,3,4,5,6]),
('14:00:00', 'regular', 150, 0.00, ARRAY[0,1,2,3,4,5,6]),
('15:00:00', 'regular', 200, 0.00, ARRAY[0,1,2,3,4,5,6]),
('16:00:00', 'regular', 200, 0.00, ARRAY[0,1,2,3,4,5,6]),
('17:00:00', 'regular', 200, 0.00, ARRAY[0,1,2,3,4,5,6]),
('18:00:00', 'regular', 150, 0.00, ARRAY[0,1,2,3,4,5,6]),
('19:00:00', 'regular', 100, 0.00, ARRAY[0,1,2,3,4,5,6]),

-- VIP Slots
('06:30:00', 'vip', 20, 500.00, ARRAY[0,1,2,3,4,5,6]),
('08:30:00', 'vip', 30, 500.00, ARRAY[0,1,2,3,4,5,6]),
('10:30:00', 'vip', 30, 500.00, ARRAY[0,1,2,3,4,5,6]),
('15:30:00', 'vip', 30, 500.00, ARRAY[0,1,2,3,4,5,6]),
('17:30:00', 'vip', 20, 500.00, ARRAY[0,1,2,3,4,5,6]),

-- Senior Citizen Slots
('07:30:00', 'senior', 50, 0.00, ARRAY[0,1,2,3,4,5,6]),
('09:30:00', 'senior', 50, 0.00, ARRAY[0,1,2,3,4,5,6]),
('16:30:00', 'senior', 50, 0.00, ARRAY[0,1,2,3,4,5,6]);

-- Insert Queues for each zone
INSERT INTO queues (queue_name, zone_id, queue_type, max_capacity) 
SELECT 
    zone_name || ' - Regular Queue',
    zone_id,
    'regular',
    max_capacity
FROM temple_zones 
WHERE zone_type = 'darshan';

INSERT INTO queues (queue_name, zone_id, queue_type, max_capacity) 
SELECT 
    zone_name || ' - VIP Queue',
    zone_id,
    'vip',
    max_capacity / 5
FROM temple_zones 
WHERE zone_type = 'darshan' AND zone_name LIKE '%VIP%';

-- Insert Admin User (password: admin123 - should be hashed in production)
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Temple Admin', 'admin@temple.com', '+919999999999', '$2b$10$YourHashedPasswordHere', 'admin');

-- Insert Sample Staff Users
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Staff Member 1', 'staff1@temple.com', '+919999999991', '$2b$10$YourHashedPasswordHere', 'staff'),
('Staff Member 2', 'staff2@temple.com', '+919999999992', '$2b$10$YourHashedPasswordHere', 'staff'),
('Staff Member 3', 'staff3@temple.com', '+919999999993', '$2b$10$YourHashedPasswordHere', 'staff');

-- Note: In production, passwords should be properly hashed using bcrypt
-- The above password_hash is a placeholder
