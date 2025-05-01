package com.example.lb3

data class Notification(
    val notification_id: Int,
    val phone: String,
    val sent_at: String,
    val message: String,
    val notification_type: String
)
