#include "Config.h"
#include "Net.h"
#include "Sensors.h"
#include "Battery.h"

Config config;
String authToken;

const uint8_t DHT_PIN = 5;
const uint8_t BATTERY_PIN = 34;
const uint8_t BUZZER_PIN = 25;

unsigned long lastMeasurementTime = 0;

void setup()
{
  Serial.begin(115200);
  Serial.println("Starting IoT Client...");

  loadConfig(config);

  if (!connectWiFi(config.wifi_ssid, config.wifi_password))
  {
    Serial.println("Failed to connect to Wi-Fi. Restarting...");
    delay(5000);
    ESP.restart();
  }

  authToken = loginToServer(config.username, config.password, config.server_url);
  if (authToken.isEmpty())
  {
    Serial.println("Failed to login to server. Restarting...");
    delay(5000);
    ESP.restart();
  }

  initSensors(DHT_PIN);
  initBatteryMonitoring(BATTERY_PIN, BUZZER_PIN);

  lastMeasurementTime = millis();
  Serial.println("Setup complete.");
}

void loop()
{
  unsigned long currentTime = millis();

  if (currentTime - lastMeasurementTime >= config.measurement_interval * 1000)
  {
    lastMeasurementTime = currentTime;

    float temperature = readTemperature();
    float humidity = readHumidity();

    if (!authToken.isEmpty())
    {
      bool success = postData(authToken, config.server_url, config.location_id, temperature, humidity);
      if (!success)
      {
        authToken = loginToServer(config.username, config.password, config.server_url);
      }
    }
    else
    {
      authToken = loginToServer(config.username, config.password, config.server_url);
    }

    float batteryLevel = readBatteryLevel();
    Serial.print("Battery level: ");
    Serial.print(batteryLevel, 1);
    Serial.print("\n");
    if (batteryLevel < 20.0)
    {
      triggerLowBatteryAlert();
    }
  }

  delay(100);
}
