package com.example.lb3

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

@Composable
fun HomeScreen(nav: NavController, logout: () -> Unit) {
    Column(
        Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Button(
            onClick = { nav.navigate("notifications") },
            modifier = Modifier.fillMaxWidth()
        ) { Text("Сповіщення") }

        Spacer(Modifier.height(16.dp))

        Button(
            onClick = { nav.navigate("orders") },
            modifier = Modifier.fillMaxWidth()
        ) { Text("Замовлення") }

        Spacer(Modifier.height(32.dp))

        Button(
            onClick = {
                logout()
                nav.navigate("login") {
                    popUpTo("home") { inclusive = true }
                }
            },
            modifier = Modifier.fillMaxWidth()
        ) { Text("Вийти") }
    }
}
