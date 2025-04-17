from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ChatMessage(BaseModel):
    type: str  # "human" or "ai"
    content: str
    
class ChatRequest(BaseModel):
    query: str
    
class ChatResponse(BaseModel):
    answer: str 