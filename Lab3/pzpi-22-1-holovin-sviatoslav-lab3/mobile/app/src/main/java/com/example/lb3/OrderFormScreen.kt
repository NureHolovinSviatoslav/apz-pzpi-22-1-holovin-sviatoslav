package com.example.lb3

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
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
fun OrderFormScreen(nav: NavController, orderId: Int) {
    val scope = rememberCoroutineScope()
    var username by remember { mutableStateOf("") }
    var status   by remember { mutableStateOf("") }
    var isNew    by remember { mutableStateOf(orderId == 0) }

    fun load() = scope.launch {
        if (!isNew) {
            ApiClient.getOrder(orderId)?.let {
                username = it.username
                status   = it.order_status
            }
        }
    }

    LifecycleResumeEffect(Unit) { load(); onPauseOrDispose { } }

    Scaffold { padding ->
        Column(
            Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp)
        ) {
            OutlinedTextField(
                value = username,
                onValueChange = { username = it },
                label = { Text("Користувач") },
                modifier = Modifier.fillMaxWidth(),
                enabled = isNew
            )
            Spacer(Modifier.height(8.dp))
            OutlinedTextField(
                value = status,
                onValueChange = { status = it },
                label = { Text("Статус") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(16.dp))
            Row {
                Button(
                    onClick = {
                        scope.launch(Dispatchers.IO) {
                            if (isNew) {
                                ApiClient.createOrder(username.trim(), status.trim())
                            } else {
                                ApiClient.updateOrder(orderId, status.trim())
                            }
                            withContext(Dispatchers.Main) { nav.popBackStack() }
                        }
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Text(if (isNew) "Створити" else "Зберегти")
                }
                if (!isNew) {
                    Spacer(Modifier.width(8.dp))
                    Button(
                        onClick = {
                            scope.launch(Dispatchers.IO) {
                                ApiClient.deleteOrder(orderId)
                                withContext(Dispatchers.Main) { nav.popBackStack() }
                            }
                        },
                        modifier = Modifier.weight(1f)
                    ) { Text("Видалити") }
                }
            }
        }
    }
}
