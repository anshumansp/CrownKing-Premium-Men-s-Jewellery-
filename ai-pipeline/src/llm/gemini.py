import google.generativeai as genai
from .base import BaseLLM

class GeminiLLM(BaseLLM):
    """Google Gemini LLM implementation with context inclusion."""
    
    def __init__(self, api_key: str, context: str):
        """Initialize the Gemini LLM.
        
        Args:
            api_key: The API key to use.
            context: The context to include in the prompt.
        """
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.context = context
    
    def generate(self, query: str) -> str:
        """Generate a response to the given query.
        
        Args:
            query: The query to generate a response for.
            
        Returns:
            The generated response.
        """
        # For Gemini we include the context in each prompt
        # This simulates CAG by including the context upfront
        prompt = f"""
You are a helpful assistant for an e-commerce website focusing on men's fashion and jewelry.

Context: {self.context}

Question: {query}

Answer:
        """
        
        # Call the Gemini API
        response = self.model.generate_content(prompt)
        
        return response.text.strip() 