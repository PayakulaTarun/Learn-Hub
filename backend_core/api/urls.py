from django.urls import path
from .views import IntentCheckView, ChatView

urlpatterns = [
    path('intent_check/', IntentCheckView.as_view(), name='intent_check'),
    path('chat/', ChatView.as_view(), name='chat'),
]
