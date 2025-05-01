#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

struct Config
{
  String username;
  String password;
  String location_id;
  unsigned long measurement_interval;
  String server_url;
  String wifi_ssid;
  String wifi_password;
};

void loadConfig(Config &cfg);

#endif
