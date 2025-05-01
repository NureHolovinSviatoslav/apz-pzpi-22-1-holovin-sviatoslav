package com.example.lb3

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Divider
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Text
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.LifecycleResumeEffect
import androidx.navigation.NavController
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

@Composable
fun OrdersListScreen(nav: NavController) {
    val scope = rememberCoroutineScope()
    var orders by remember { mutableStateOf(listOf<Order>()) }

    fun load() = scope.launch {
        orders = withContext(Dispatchers.IO) { ApiClient.getOrders() }
    }

    LifecycleResumeEffect(Unit) { load(); onPauseOrDispose { } }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = { nav.navigate("orderForm/0") }) { Text("+") }
        }
    ) { padding ->
        Column(
            Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp)
        ) {
            Text("Замовлення", Modifier.padding(bottom = 8.dp))
            Row(Modifier.fillMaxWidth()) {
                Text("ID", Modifier.weight(0.15f))
                Text("User", Modifier.weight(0.35f))
                Text("Статус", Modifier.weight(0.5f))
            }
            Divider()
            LazyColumn {
                items(orders) { o ->
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .clickable { nav.navigate("orderForm/${o.order_id}") }
                            .padding(vertical = 6.dp)
                    ) {
                        Text(o.order_id.toString(), Modifier.weight(0.15f))
                        Text(o.username, Modifier.weight(0.35f))
                        Text(o.order_status, Modifier.weight(0.5f))
                    }
                    Divider()
                }
            }
        }
    }
}
