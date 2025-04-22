#include "Config.h"

static String readLineFromSerial(const String &prompt)
{
  Serial.println(prompt);
  while (Serial.available() == 0)
  {
    delay(10);
  }

  String input = Serial.readStringUntil('\n');
  input.trim();

  return input;
}

void loadConfig(Config &cfg)
{
  Serial.begin(115200);
  Serial.println("Configuration");
  Serial.println("Input configuration value and press Enter:");

  cfg.username = readLineFromSerial("Username:");
  cfg.password = readLineFromSerial("Password:");
  cfg.location_id = readLineFromSerial("location_id:");

  {
    String intervalStr = readLineFromSerial("measurement_interval (s):");
    cfg.measurement_interval = intervalStr.toInt();
  }

  cfg.server_url = readLineFromSerial("server_url (example: http://example.com):");
  cfg.wifi_ssid = readLineFromSerial("Wi-Fi SSID:");
  cfg.wifi_password = readLineFromSerial("Wi-Fi password:");

  Serial.println("Configuration successful");
}
