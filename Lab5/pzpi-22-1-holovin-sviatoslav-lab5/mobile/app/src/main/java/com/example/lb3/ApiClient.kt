package com.example.lb3

import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

object ApiClient {
    private const val BASE = "https://apz-pzpi-22-1-holovin-sviatoslav.onrender.com"
    var token: String? = null

    private fun request(path: String, method: String, body: JSONObject? = null): String? {
        val conn = (URL("$BASE$path").openConnection() as HttpURLConnection).apply {
            requestMethod = method
            connectTimeout = 5000
            readTimeout = 5000
            doInput = true
            token?.let { setRequestProperty("Authorization", "Bearer $it") }
            if (body != null) {
                doOutput = true
                setRequestProperty("Content-Type", "application/json")
                OutputStreamWriter(outputStream).use { it.write(body.toString()) }
            }
        }
        return try {
            BufferedReader(conn.inputStream.reader()).use { it.readText() }
        } catch (_: Exception) { null } finally { conn.disconnect() }
    }

    fun login(username: String, password: String): String? {
        val obj = JSONObject().put("username", username).put("password", password)
        val txt = request("/users/login", "POST", obj) ?: return null
        return JSONObject(txt).getString("accessToken")
    }

    fun getNotifications(): List<Notification> {
        val txt = request("/notifications", "GET") ?: return emptyList()
        val arr = JSONArray(txt)
        return List(arr.length()) { i ->
            arr.getJSONObject(i).let {
                Notification(
                    it.getInt("notification_id"),
                    it.getString("phone"),
                    it.getString("sent_at"),
                    it.getString("message"),
                    it.getString("notification_type")
                )
            }
        }
    }

    fun getOrders(): List<Order> {
        val txt = request("/orders", "GET") ?: return emptyList()
        val arr = JSONArray(txt)
        return List(arr.length()) { i ->
            arr.getJSONObject(i).let {
                Order(
                    it.getInt("order_id"),
                    it.getString("username"),
                    it.getString("order_date"),
                    it.getString("order_status")
                )
            }
        }
    }

    fun getOrder(id: Int): Order? {
        val txt = request("/orders/$id", "GET") ?: return null
        val o = JSONObject(txt)
        return Order(
            o.getInt("order_id"),
            o.getString("username"),
            o.getString("order_date"),
            o.getString("order_status")
        )
    }

    fun createOrder(username: String, status: String): Order? {
        val obj = JSONObject()
            .put("username", username)
            .put("order_status", status)
            .put("items", JSONArray())
        val txt = request("/orders", "POST", obj) ?: return null
        val o = JSONObject(txt)
        return Order(
            o.getInt("order_id"),
            o.getString("username"),
            o.getString("order_date"),
            o.getString("order_status")
        )
    }

    fun updateOrder(id: Int, status: String): Order? {
        val txt = request(
            "/orders/$id",
            "PATCH",
            JSONObject().put("order_status", status).put("items", JSONArray())
        ) ?: return null
        val o = JSONObject(txt)
        return Order(
            o.getInt("order_id"),
            o.getString("username"),
            o.getString("order_date"),
            o.getString("order_status")
        )
    }

    fun deleteOrder(id: Int) {
        request("/orders/$id", "DELETE")
    }
}
