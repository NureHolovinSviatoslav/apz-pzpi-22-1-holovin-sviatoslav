#ifndef NETWORK_H
#define NETWORK_H

#include <Arduino.h>

bool connectWiFi(const String &ssid, const String &password);
String loginToServer(const String &username, const String &password, const String &server_url);
bool postData(const String &token, const String &server_url, const String &location_id, float temp, float humidity);

#endif
