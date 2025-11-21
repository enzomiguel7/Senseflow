CREATE TABLE IF NOT EXISTS sensor_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    detected BOOLEAN NOT NULL,
    value VARCHAR(255),
    date_ DATE NOT NULL,
    time_ TIME NOT NULL
);