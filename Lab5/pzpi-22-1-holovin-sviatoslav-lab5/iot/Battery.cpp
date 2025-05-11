#include "Battery.h"

static uint8_t g_batteryPin = 0;
static uint8_t g_buzzerPin = 0;

void initBatteryMonitoring(uint8_t batteryPin, uint8_t buzzerPin)
{
  g_batteryPin = batteryPin;
  g_buzzerPin = buzzerPin;

  pinMode(g_buzzerPin, OUTPUT);
  digitalWrite(g_buzzerPin, LOW);

  pinMode(g_batteryPin, INPUT);

  Serial.println("Battery monitoring initialized");
}

float readBatteryLevel()
{
  int analogVal = analogRead(g_batteryPin);
  int batteryLevel = map(analogVal, 0, 1023, 0, 12);

  return batteryLevel;
}

void triggerLowBatteryAlert()
{
  Serial.println("Low battery! Alert triggered.");
  tone(g_buzzerPin, 100, 1000);
}
