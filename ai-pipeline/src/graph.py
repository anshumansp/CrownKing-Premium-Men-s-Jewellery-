from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph

# Define state
class State(TypedDict):
    messages: List[Dict[str, Any]]
    query: str

def create_graph(langchain_model):
    """Create a simple graph that uses the LangChain model.
    
    Args:
        langchain_model: The LangChain model chain to use
        
    Returns:
        A compiled StateGraph
    """
    # Get the process function from our langchain model
    process_fn = langchain_model["process"]
    
    # Create state graph
    graph = StateGraph(State)
    
    # Define the node function
    def generate_response(state: State) -> State:
        query = state["query"]
        
        # Generate response using our LangChain chain
        content = process_fn(query)
        
        # Update the state with the response
        new_state = state.copy()
        if "messages" not in new_state:
            new_state["messages"] = []
        
        # Add the human query and AI response to messages
        new_state["messages"].append({"type": "human", "content": query})
        new_state["messages"].append({"type": "ai", "content": content})
        
        return new_state
    
    # Add the node to the graph
    graph.add_node("generate", generate_response)
    
    # Set the entry point
    graph.set_entry_point("generate")
    
    # Compile the graph
    return graph.compile() 