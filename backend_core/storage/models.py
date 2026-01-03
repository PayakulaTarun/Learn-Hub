from django.db import models
from pgvector.django import VectorField

class UserProfile(models.Model):
    user_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # Store aggregated signals, e.g. {"mastery": 0.5}
    stats = models.JSONField(default=dict)

class KnowledgeNode(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    # 768 dimensions for text-embedding-004
    embedding = VectorField(dimensions=768) 
    created_at = models.DateTimeField(auto_now_add=True)
    source_path = models.CharField(max_length=512, blank=True)

class InteractionLog(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    query = models.TextField()
    intent = models.CharField(max_length=50)
    response = models.TextField()
    feedback_score = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
