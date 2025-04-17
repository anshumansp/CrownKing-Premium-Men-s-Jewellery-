import os
import glob
from dotenv import load_dotenv
from .llm.openai import OpenAILLM
from .llm.groq import GroqLLM
from .llm.gemini import GeminiLLM
from .langchain_wrapper import create_langchain_model

def load_documents(directory: str) -> str:
    """Load all text documents from the specified directory.
    
    Args:
        directory: Path to the directory containing documents.
        
    Returns:
        Concatenated content of all documents.
    """
    context = ""
    # Create the directory if it doesn't exist
    os.makedirs(directory, exist_ok=True)
    
    # Load all .txt files
    for file in glob.glob(f"{directory}/*.txt"):
        try:
            with open(file, "r", encoding="utf-8") as f:
                context += f.read() + "\n\n"
        except Exception as e:
            print(f"Error loading file {file}: {e}")
    
    # If no files were found, provide a default context
    if not context:
        context = """
        CrownKing is a premium e-commerce platform specializing in men's jewelry and fashion accessories.
        Our product range includes rings, bracelets, necklaces, watches, and exclusive luxury items.
        We offer worldwide shipping and a 30-day return policy.
        """
    
    return context.strip()

def initialize_llm():
    """Initialize the appropriate LLM based on environment variables.
    
    Returns:
        A LangChain model chain or traditional LLM.
    """
    # Load environment variables
    load_dotenv()
    
    # Get configuration
    llm_type = os.getenv("LLM_TYPE", "groq")
    documents_dir = os.getenv("DOCUMENTS_DIR", "./documents")
    
    # Load context from documents
    context = load_documents(documents_dir)
    
    # Initialize the appropriate LLM
    if llm_type == "openai":
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OpenAI API key not found in environment variables.")
        # Using the old approach for non-Groq models
        llm = OpenAILLM(api_key=api_key, context=context)
        # This won't work with LangGraph, but kept for reference
        return llm
    elif llm_type == "groq" or llm_type == "default":
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("Groq API key not found in environment variables.")
        # Use the new LangChain approach for Groq
        return create_langchain_model(api_key=api_key, context=context)
    elif llm_type == "gemini":
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("Gemini API key not found in environment variables.")
        # Using the old approach for non-Groq models
        llm = GeminiLLM(api_key=api_key, context=context)
        # This won't work with LangGraph, but kept for reference
        return llm
    else:
        # Default to Groq
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("Groq API key not found in environment variables.")
        # Use the new LangChain approach for Groq
        return create_langchain_model(api_key=api_key, context=context) 