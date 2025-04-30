package com.example.lb3

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

@Composable
fun App(
    hasToken: Boolean,
    saveToken: (String) -> Unit,
    logout: () -> Unit
) {
    val nav = rememberNavController()
    Scaffold { padding ->
        NavHost(
            navController = nav,
            startDestination = if (hasToken) "home" else "login",
            modifier = Modifier.padding(padding)
        ) {
            composable("login") { LoginScreen(nav, saveToken) }
            composable("home") { HomeScreen(nav, logout) }
            composable("notifications") { NotificationsScreen(nav) }
            composable("orders") { OrdersListScreen(nav) }
            composable("orderForm/{id}") { back ->
                val id = back.arguments?.getString("id")?.toInt() ?: 0
                OrderFormScreen(nav, id)
            }
        }
    }
}
