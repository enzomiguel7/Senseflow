CREATE DATABASE IF NOT EXISTS RegistrosSensor;

ALTER USER 'root'@'%' IDENTIFIED BY '0000';
ALTER USER 'root'@'localhost' IDENTIFIED BY '0000';

CREATE TABLE IF NOT EXISTS RegistrosSensor.sensor_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_id VARCHAR(50),
    type VARCHAR(50),
    detected BOOLEAN,
    value INT,
    timestamp DATETIME
);
