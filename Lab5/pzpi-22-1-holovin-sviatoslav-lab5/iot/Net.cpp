#include "Net.h"
#include <HTTPClient.h>
#include <WiFi.h>

bool connectWiFi(const String &ssid, const String &password)
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid.c_str(), password.c_str(), 6);
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(ssid);

  unsigned long startAttemptTime = millis();
  const unsigned long wifiTimeout = 20000;

  while (WiFi.status() != WL_CONNECTED && (millis() - startAttemptTime) < wifiTimeout)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.print("Wi-Fi connected, IP address: ");
    Serial.println(WiFi.localIP());
    return true;
  }
  else
  {
    Serial.println("Failed to connect to Wi-Fi");
    return false;
  }
}

String loginToServer(const String &username, const String &password, const String &server_url)
{
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Not connected to Wi-Fi!");
    return "";
  }

  if (server_url == "stub")
  {
    Serial.println("Login mocked successfully. Username: " + username + ", Password: " + password);
    return "stub";
  }

  HTTPClient http;
  String loginEndpoint = server_url + "/users/login";

  http.begin(loginEndpoint);
  http.addHeader("Content-Type", "application/json");

  String payload = "{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}";

  int httpCode = http.POST(payload);
  if (httpCode > 0)
  {
    if (httpCode == HTTP_CODE_OK)
    {
      String response = http.getString();

      int tokenIndex = response.indexOf("\"accessToken\":\"");
      if (tokenIndex != -1)
      {
        int start = tokenIndex + 15; // length of "accessToken":
        int end = response.indexOf("\"", start);
        String token = response.substring(start, end);
        Serial.println("Login successful, token: " + token);
        http.end();
        return token;
      }
      else
      {
        Serial.println("Login response does not contain token");
      }
    }
    else
    {
      Serial.printf("Login failed, code: %d, response: %s\n", httpCode, http.getString().c_str());
    }
  }
  else
  {
    Serial.printf("Connection failed: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
  return "";
}

bool postData(const String &token, const String &server_url, const String &location_id, float temp, float humidity)
{
  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Not connected to Wi-Fi!");
    return false;
  }

  if (server_url == "stub")
  {
    Serial.println("Sending data mocked successfully. Token: " + token + ", Location ID: " + location_id + ", Temperature: " + temp + ", Humidity: " + humidity);
    return true;
  }

  HTTPClient http;
  String dataEndpoint = server_url + "/sensorData";

  http.begin(dataEndpoint);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + token);

  String payload = "{\"location_id\":\"" + location_id + "\",\"temperature\":" + String(temp) + ",\"humidity\":" + String(humidity) + "}";

  int httpCode = http.POST(payload);
  if (httpCode > 0)
  {
    if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_ACCEPTED)
    {
      Serial.println("Data sent successfully");
      http.end();
      return true;
    }
    else
    {
      Serial.printf("Data sending failed, code: %d, response: %s\n", httpCode, http.getString().c_str());
    }
  }
  else
  {
    Serial.printf("Connection failed: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
  return false;
}
