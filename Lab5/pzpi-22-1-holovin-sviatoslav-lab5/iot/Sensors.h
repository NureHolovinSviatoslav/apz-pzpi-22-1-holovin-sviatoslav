#ifndef SENSORS_H
#define SENSORS_H

#include <Arduino.h>

void initSensors(uint8_t dhtPin);

float readTemperature();
float readHumidity();

#endif
