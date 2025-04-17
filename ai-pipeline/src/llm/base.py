from abc import ABC, abstractmethod

class BaseLLM(ABC):
    """Base class for all LLM implementations."""
    
    @abstractmethod
    def generate(self, query: str) -> str:
        """Generate a response to the given query.
        
        Args:
            query: The query to generate a response for.
            
        Returns:
            The generated response.
        """
        pass 