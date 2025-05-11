#ifndef BATTERY_H
#define BATTERY_H

#include <Arduino.h>

void initBatteryMonitoring(uint8_t batteryPin, uint8_t buzzerPin);

float readBatteryLevel();

void triggerLowBatteryAlert();

#endif
