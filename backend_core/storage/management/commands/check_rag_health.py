from django.core.management.base import BaseCommand
from storage.models import KnowledgeNode
from pgvector.django import L2Distance
import numpy as np

class Command(BaseCommand):
    help = 'Verifies if RAG components (DB, Vectors) are healthy'

    def handle(self, *args, **options):
        self.stdout.write("🏥 RAG HEALTH CHECK INITIALIZED...")
        
        # 1. Count Nodes
        count = KnowledgeNode.objects.count()
        self.stdout.write(f"📊 Knowledge Nodes: {count}")
        
        if count == 0:
            self.stdout.write(self.style.WARNING("⚠️  No vector data found! Run migrate_vectors.py."))
            return

        # 2. Check Vector Dimension
        first_node = KnowledgeNode.objects.first()
        if not first_node.embedding:
            self.stdout.write(self.style.ERROR("❌ Node found but embedding is NULL!"))
            return
            
        dim = len(first_node.embedding)
        self.stdout.write(f"📏 Vector Dims: {dim} (Expected: 768)")
        
        # 3. Test Search (Calculated Logic)
        self.stdout.write("🔎 Testing Similarity Search...")
        try:
            # We just take the first node's embedding and find itself
            # If database supports pgvector operator, this query works:
            results = KnowledgeNode.objects.alias(
                distance=L2Distance('embedding', first_node.embedding)
            ).order_by('distance')[:1]
            
            top_match = results[0]
            if top_match.id == first_node.id:
                self.stdout.write(self.style.SUCCESS("✅ Vector Search Verified (Self-Match Found)"))
            else:
                self.stdout.write(self.style.WARNING(f"⚠️ Vector Search returned different node ID: {top_match.id}"))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Vector Search Failed: {e}"))
            self.stdout.write("   (This is expected if running on SQLite)")

        self.stdout.write(self.style.SUCCESS("✅ RAG Health Check Complete."))
