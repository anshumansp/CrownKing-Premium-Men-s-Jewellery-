from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

def create_langchain_model(api_key: str, context: str):
    """Create a langchain_groq model using a simple implementation.
    
    Args:
        api_key: The Groq API key.
        context: The context to include in the prompt.
        
    Returns:
        A chain combining prompt, LLM and output parser.
    """
    # Initialize the ChatGroq model (with proper parameters)
    llm = ChatGroq(
        temperature=0.7,
        model_name="llama-3.3-70b-versatile",
        groq_api_key=api_key,
    )
    
    # Create a prompt template that includes the context
    prompt = PromptTemplate(
        template="""<|begin_of_text|><|start_header_id|>system<|end_header_id|> 
You are a helpful assistant for an e-commerce website focusing on men's fashion and jewelry.

Context information:
{context}

Use the context information to provide accurate and helpful responses about products, 
pricing, shipping, and other details when relevant to the user's query.
<|eot_id|><|start_header_id|>user<|end_header_id|>
{query}
<|eot_id|><|start_header_id|>assistant<|end_header_id|>""",
        input_variables=["query", "context"],
    )
    
    # Create a simple chain: prompt -> llm -> output parser
    chain = prompt | llm | StrOutputParser()
    
    # Return a function that processes queries with the context
    def process_query(query):
        return chain.invoke({"query": query, "context": context})
    
    # Return both the chain and the processing function for flexibility
    return {
        "llm": llm,
        "chain": chain,
        "process": process_query
    } 