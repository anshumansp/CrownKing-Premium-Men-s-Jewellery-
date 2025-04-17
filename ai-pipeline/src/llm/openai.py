import openai
from .base import BaseLLM

class OpenAILLM(BaseLLM):
    """OpenAI LLM implementation with context inclusion."""
    
    def __init__(self, api_key: str, context: str):
        """Initialize the OpenAI LLM.
        
        Args:
            api_key: The API key to use.
            context: The context to include in the prompt.
        """
        self.api_key = api_key
        self.context = context
        openai.api_key = api_key
    
    def generate(self, query: str) -> str:
        """Generate a response to the given query.
        
        Args:
            query: The query to generate a response for.
            
        Returns:
            The generated response.
        """
        # For OpenAI we include the context in each prompt
        # This simulates CAG by including the context upfront
        prompt = f"Context: {self.context}\nQuestion: {query}\nAnswer:"
        
        # Call the OpenAI API
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for an e-commerce website focusing on men's fashion and jewelry."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip() 