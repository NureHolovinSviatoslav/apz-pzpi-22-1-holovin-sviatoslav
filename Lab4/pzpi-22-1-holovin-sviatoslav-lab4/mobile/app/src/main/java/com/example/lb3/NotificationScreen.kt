package com.example.lb3

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.LifecycleResumeEffect
import androidx.navigation.NavController
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

@Composable
fun NotificationsScreen(nav: NavController) {
    val scope = rememberCoroutineScope()
    var list by remember { mutableStateOf(listOf<Notification>()) }

    fun load() = scope.launch {
        list = withContext(Dispatchers.IO) { ApiClient.getNotifications() }
    }

    LifecycleResumeEffect(Unit) { load(); onPauseOrDispose { } }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Усі сповіщення", Modifier.padding(bottom = 8.dp))
        Row(Modifier.fillMaxWidth()) {
            Text("ID", Modifier.weight(0.1f))
            Text("Телефон", Modifier.weight(0.3f))
            Text("Тип", Modifier.weight(0.2f))
            Text("Час", Modifier.weight(0.4f))
        }
        Divider()
        LazyColumn {
            items(list) { n ->
                Row(Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                    Text(n.notification_id.toString(), Modifier.weight(0.1f))
                    Text(n.phone, Modifier.weight(0.3f))
                    Text(n.notification_type, Modifier.weight(0.2f))
                    Text(n.sent_at, Modifier.weight(0.4f))
                }
                Divider()
            }
        }
    }
}
