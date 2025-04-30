package com.example.lb3

import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.*
import com.example.lb3.ui.theme.Lb3Theme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val prefs = getSharedPreferences("auth", Context.MODE_PRIVATE)
        ApiClient.token = prefs.getString("jwt", null)
        enableEdgeToEdge()
        setContent {
            val tokenState = remember { mutableStateOf(ApiClient.token) }
            Lb3Theme {
                App(
                    hasToken = tokenState.value != null,
                    saveToken = { t ->
                        ApiClient.token = t
                        prefs.edit().putString("jwt", t).apply()
                        tokenState.value = t
                    },
                    logout = {
                        ApiClient.token = null
                        prefs.edit().remove("jwt").apply()
                        tokenState.value = null
                    }
                )
            }
        }
    }
}
