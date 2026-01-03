from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from inference.engine import CognitiveEngine
from api.authentication import FirebaseAuthentication
from storage.models import InteractionLog, UserProfile

class IntentCheckView(APIView):
    """
    API Endpoint for the 'Sidecar Brain'.
    """
    def post(self, request):
        query = request.data.get('query')
        context = request.data.get('context', {})
        if not query:
            return Response({"error": "Query required"}, status=status.HTTP_400_BAD_REQUEST)
        result = CognitiveEngine.analyze_intent(query, context)
        return Response(result, status=status.HTTP_200_OK)

class ChatView(APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Full RAG Chat Endpoint.
        Expects: { "messages": [ ... ] }
        """
        messages = request.data.get('messages', [])
        if not messages:
            return Response({"error": "Messages required"}, status=status.HTTP_400_BAD_REQUEST)
        
        last_message = messages[-1].get('content')
        if not last_message:
             return Response({"error": "Content required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 1. Execute Python-based RAG
            result = CognitiveEngine.run_rag_flow(last_message)
            
            # 2. Log Interaction (Data Pipeline)
            try:
                # request.user is the Django User (username=FirebaseUID)
                user_profile, _ = UserProfile.objects.get_or_create(user_id=request.user.username)
                
                InteractionLog.objects.create(
                    user=user_profile,
                    query=last_message,
                    intent=result.get('intent', {}).get('intent', 'unknown'),
                    response=result.get('response', ''),
                    # feedback_score will be updated later via separate endpoint
                )
            except Exception as log_error:
                print(f"⚠️ Logging Failed: {log_error}") # Non-blocking

            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Chat Error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
