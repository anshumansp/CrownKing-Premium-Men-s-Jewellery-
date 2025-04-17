from groq import Groq
from .base import BaseLLM

class GroqLLM(BaseLLM):
    """Groq LLM implementation with context inclusion."""
    
    def __init__(self, api_key: str, context: str):
        """Initialize the Groq LLM.
        
        Args:
            api_key: The API key to use.
            context: The context to include in the prompt.
        """
        self.client = Groq(api_key=api_key)
        self.context = context
    
    def generate(self, query: str) -> str:
        """Generate a response to the given query.
        
        Args:
            query: The query to generate a response for.
            
        Returns:
            The generated response.
        """
        # For Groq we include the context in each prompt
        # This simulates CAG by including the context upfront
        prompt = f"Context: {self.context}\nQuestion: {query}\nAnswer:"
        
        # Call the Groq API
        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for an e-commerce website focusing on men's fashion and jewelry."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip() 