import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Add the current directory to the Python path
sys.path.insert(0, os.path.abspath("."))

from src.schema.models import ChatRequest, ChatResponse
from src.utils import initialize_llm
from src.graph import create_graph

# Load environment variables
load_dotenv()

# Initialize the LLM once when the application starts
try:
    print("Initializing LLM...")
    langchain_model = initialize_llm()
    print(f"LLM initialized: {type(langchain_model).__name__}")
    
    # Create the LangGraph
    print("Creating LangGraph...")
    graph = create_graph(langchain_model)
    print("LangGraph created successfully!")
except Exception as e:
    print(f"Error initializing LLM or graph: {e}")
    # We'll allow the application to start even if LLM fails,
    # but requests will fail until it's fixed
    langchain_model = None
    graph = None

# Create FastAPI app
app = FastAPI(
    title="CrownKing AI Chatbot API",
    description="A FastAPI + LangGraph AI chatbot using Cache-Augmented Generation",
    version="1.0.0"
)

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods including OPTIONS
    allow_headers=["*"],  # Allow all headers
)

@app.get("/", include_in_schema=False)
async def redirect_to_docs():
    """Redirect to the API documentation."""
    return RedirectResponse(url="/docs")

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat with the AI assistant.
    
    Args:
        request: The chat request containing the query.
        
    Returns:
        The AI assistant's response.
    """
    if not graph:
        raise HTTPException(
            status_code=503,
            detail="LLM is not initialized. Check server logs for details."
        )
    
    try:
        # Invoke the graph with the query
        result = graph.invoke({"query": request.query})
        
        # Get the AI response from the result
        for message in reversed(result.get("messages", [])):
            if message.get("type") == "ai":
                return ChatResponse(answer=message.get("content", ""))
        
        # If no AI response was found, return an error
        raise HTTPException(
            status_code=500,
            detail="No response generated."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )

# Add a sample document endpoint for testing
@app.post("/add_sample_document")
async def add_sample_document():
    """Add a sample document to the documents directory for testing."""
    # Create the documents directory if it doesn't exist
    documents_dir = os.getenv("DOCUMENTS_DIR", "./documents")
    os.makedirs(documents_dir, exist_ok=True)
    
    # Sample document content
    sample_content = """
    # CrownKing Product Catalog
    
    ## Men's Rings
    - Gold Crown Ring: $249.99
    - Silver Royal Signet: $149.99
    - Diamond Encrusted Band: $499.99
    
    ## Bracelets
    - Gold Chain Bracelet: $199.99
    - Silver Cuff: $129.99
    - Leather and Gold Detail: $99.99
    
    ## Necklaces
    - Gold Crown Pendant: $299.99
    - Silver Chain with Pendant: $179.99
    
    ## Shipping Information
    - Free shipping on orders over $100
    - International shipping available
    - 30-day return policy
    
    ## FAQs
    Q: What sizes are available for rings?
    A: We offer sizes 7-13 for all our rings.
    
    Q: Do you offer gift wrapping?
    A: Yes, premium gift wrapping is available for $5.99.
    
    Q: How do I care for gold jewelry?
    A: Clean with a soft cloth and mild soap. Avoid harsh chemicals and store in a jewelry box.
    """
    
    # Write the sample document to the documents directory
    sample_path = os.path.join(documents_dir, "product_catalog.txt")
    with open(sample_path, "w", encoding="utf-8") as f:
        f.write(sample_content)
    
    return {"status": "success", "message": f"Sample document added at {sample_path}"}

@app.post("/reload")
async def reload_llm():
    """Reload the LLM and graph with any new documents."""
    global langchain_model, graph
    
    try:
        print("Reloading LLM...")
        langchain_model = initialize_llm()
        print(f"LLM reloaded: {type(langchain_model).__name__}")
        
        # Recreate the LangGraph
        print("Recreating LangGraph...")
        graph = create_graph(langchain_model)
        print("LangGraph recreated successfully!")
        
        return {"status": "success", "message": "LLM and graph reloaded successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reloading LLM: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)