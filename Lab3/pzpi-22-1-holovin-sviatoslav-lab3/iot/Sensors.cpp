#include "Sensors.h"
#include <DHT.h>

static DHT dhtSensor(0, DHT22);

void initSensors(uint8_t dhtPin)
{
  dhtSensor = DHT(dhtPin, DHT22);
  dhtSensor.begin();
  Serial.println("DHT22 sensor initialized");
}

float readTemperature()
{
  float temp = dhtSensor.readTemperature();
  if (isnan(temp))
  {
    Serial.println("Failed to read temperature!");
    return -1.0;
  }
  return temp;
}

float readHumidity()
{
  float hum = dhtSensor.readHumidity();
  if (isnan(hum))
  {
    Serial.println("Failed to read humidity!");
    return -1.0;
  }
  return hum;
}
