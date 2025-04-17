Building a Chatbot with Cache-Augmented Generation (CAG) using DeepSeek R1 and Streamlit
Vansh Kakkar
Stuvalley AI Nexus
Vansh Kakkar

·
Follow

Published in
Stuvalley AI Nexus

·
6 min read
·
Feb 19, 2025
14






Introduction
Chatbots powered by large language models (LLMs) have transformed human-computer interactions by providing fast, intelligent, and context-aware responses. However, one of the biggest challenges in LLM-based chatbots is reducing response time and computational cost.

To address this, we’ll build a chatbot using DeepSeek R1, an open-source LLM, with Cache-Augmented Generation (CAG). Unlike Retrieval-Augmented Generation (RAG), which retrieves document chunks from external databases, CAG caches previously generated responses to improve efficiency.

We’ll implement this chatbot using Streamlit for a seamless web interface and LangChain for managing conversational logic. The chatbot will allow users to upload a research document, ask questions about it, and receive instant responses if the question has been previously answered.

Cache-Augmented Generation (CAG) in LLMs
Cache-Augmented Generation (CAG) is emerging as a highly efficient approach for frequently asked questions and real-time applications, while RAG remains essential for complex knowledge retrieval tasks.

Traditionally, Retrieval-Augmented Generation (RAG) has been used to improve LLM performance by retrieving the most relevant document chunks from a vector database (e.g., FAISS, Chroma) and using them as context to generate responses. While this approach is useful for knowledge retrieval applications, it struggles with scalability and real-time response optimization.

Limitations of RAG:
High Latency — RAG requires querying a vector database, retrieving relevant chunks, and passing them to an LLM, which slows down response time.

Computationally Expensive — Running a vector search on large datasets requires significant memory and processing power.

No Reuse of Previous Responses — Every time a query is made, RAG recomputes the response, even if the same question has been asked before.

Why CAG is the Future
With modern LLMs like DeepSeek R1, GPT-4 Turbo, and Claude 3, caching responses significantly reduces computational overhead and improves efficiency.

Instant Response for Previously Asked Questions — If a question has been answered before, CAG retrieves the response from a cache instead of recomputing it.

Reduced API/Computation Costs — By avoiding repeated LLM calls, CAG optimizes efficiency and scalability.

No Need for Vector Databases — Unlike RAG, which relies on external retrieval mechanisms, CAG optimizes response time by leveraging cached responses, reducing the dependency on vector databases for frequently asked queries.

CAG in Real-World Applications
Customer Support Chatbots — Frequently asked questions (FAQs) are answered instantly, reducing response time.

Enterprise AI Assistants — Large organizations use CAG to avoid redundant processing in chat applications.

Scientific Research Assistants — Previously asked queries on uploaded papers get immediate answers.

Medical AI Advisors — Common health-related queries are cached for faster responses.

With caching mechanisms, Cache-Augmented Generation is rapidly replacing RAG as the preferred paradigm for efficient AI assistants.

Prerequisites
Before starting, ensure you have the following installed:

Python 3.8+ (Recommended)
Streamlit (for UI deployment)
LangChain Core & Community (for managing LLM pipelines)
LangChain Ollama (for running DeepSeek R1)
pdfplumber (for extracting text from PDFs)

Install Dependencies
Run the following command to install all required packages:

pip install streamlit langchain_core langchain_community langchain_ollama pdfplumber
Step 1: Load the DeepSeek R1 Model
DeepSeek R1 is a powerful open-source LLM optimized for reasoning and natural language understanding. We’ll load it using LangChain’s Ollama integration:

from langchain_ollama.llms import OllamaLLM

# Load the DeepSeek R1 model
LANGUAGE_MODEL = OllamaLLM(model="deepseek-r1:1.5b")
Step 2: Implement Cache-Augmented Generation (CAG)
CAG enables the chatbot to store and reuse previously generated responses, significantly improving efficiency.

How CAG Works:
🔹 Check if the question has been asked before — If found in the cache, return the saved response instantly.
🔹 If no cache hit, generate a new response — Use DeepSeek R1 to process the document and store the new answer.
🔹 Store the new response in memory — Future queries will use the cached version for speed.

Step 3: Build the Chatbot in Streamlit
We’ll now integrate everything into a Streamlit web app that:

Allows users to upload a research document
Caches previous responses for fast retrieval
Maintains conversation history

Full Implementation:
import streamlit as st
from langchain_community.document_loaders import PDFPlumberLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
import re
# --- Custom CSS for Styling ---
st.markdown("""
<style>
/* Overall Background */
.stApp {
    background-color: #000000;
    color: #FFFFFF;
}

/* File Uploader Styling */
.stFileUploader {
    background-color: #111111 !important;
    border: 2px solid #00FFAA !important;
    border-radius: 8px;
    padding: 15px;
    color: #FFFFFF !important;
    font-weight: bold;
    text-align: center;
}

/* Upload Button Text */
.stFileUploader label {
    color: #FFFFFF !important;
    font-size: 16px;
}

/* Chat Input Box */
.stChatInput input {
    background-color: #1E1E1E !important;
    color: #FFFFFF !important;
    border: 2px solid #00FFAA !important;
    border-radius: 8px;
    padding: 10px;
}

/* User Chat Message Styling */
.stChatMessage[data-testid="stChatMessage"]:nth-child(odd) {
    background-color: #222222 !important;
    border: 1px solid #00AAFF !important;
    color: #E0E0E0 !important;
    border-radius: 12px;
    padding: 15px;
    margin: 10px 0;
}

/* Assistant Chat Message Styling */
.stChatMessage[data-testid="stChatMessage"]:nth-child(even) {
    background-color: #333333 !important;
    border: 1px solid #FFAA00 !important;
    color: #FFFFFF !important;
    border-radius: 12px;
    padding: 15px;
    margin: 10px 0;
}

/* Avatars */
.stChatMessage .avatar {
    background-color: #00FFAA !important;
    color: #000000 !important;
    font-weight: bold;
    border-radius: 50%;
    padding: 8px;
    display: inline-block;
}

/* Titles and Headers */
h1, h2, h3 {
    color: #00FFAA !important;
    font-weight: bold;
}

/* General Text Fix */
.stChatMessage p, .stChatMessage div {
    color: #FFFFFF !important;
}
</style>
""", unsafe_allow_html=True)
# --- Constants ---
PROMPT_TEMPLATE = """
You are an expert research assistant. Answer queries concisely using the provided document context.
If unsure, state that you don't know. Be factual and clear (max 10 sentences).

Query: {user_query} 
Context: {full_document} 
Answer:
"""

PDF_STORAGE_PATH = 'document_store/pdfs/'
LANGUAGE_MODEL = OllamaLLM(model="deepseek-r1:1.5b")

# --- Initialize Cache ---
if "response_cache" not in st.session_state:
    st.session_state["response_cache"] = {}  # Dictionary to store past Q&A pairs
if "conversation_history" not in st.session_state:
    st.session_state["conversation_history"] = []
if "document_text" not in st.session_state:
    st.session_state["document_text"] = ""

# --- Functions ---
def save_uploaded_file(uploaded_file):
    file_path = PDF_STORAGE_PATH + uploaded_file.name
    with open(file_path, "wb") as file:
        file.write(uploaded_file.getbuffer())
    return file_path

def load_pdf_documents(file_path):
    document_loader = PDFPlumberLoader(file_path)
    return document_loader.load()

def chunk_documents(raw_documents):
    text_processor = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    return text_processor.split_documents(raw_documents)

def get_full_document_text(chunks):
    return "\n\n".join([chunk.page_content for chunk in chunks])

def generate_answer(user_query, full_text):
    """ Generate response using cache if available; otherwise, call LLM """
    # Check if the response is already in the cache
    if user_query in st.session_state["response_cache"]:
        return st.session_state["response_cache"][user_query]  # Return cached response

    # If not cached, generate response
    conversation_prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    response_chain = conversation_prompt | LANGUAGE_MODEL
    response = response_chain.invoke({"user_query": user_query, "full_document": full_text})

    # Extract response text
    if isinstance(response, dict):
        response_text = response.get("text", "⚠️ Error: No response generated.")
    else:
        response_text = str(response)

    # Limit response length and store in cache
    response_text = limit_sentences(response_text, 10)
    st.session_state["response_cache"][user_query] = response_text  # Cache the response

    return response_text

def limit_sentences(text, max_sentences):
    sentences = re.split(r'(?<=\.)\s+', text)
    return ' '.join(sentences[:max_sentences]) + ("..." if len(sentences) > max_sentences else "")

# --- UI Layout ---
st.sidebar.title("📌 Instructions")
st.sidebar.info("""
1. Upload a **PDF research document**.
2. Once uploaded, **ask any question** about its content.
3. The chatbot will first check its **cache** to provide faster responses.
4. If no answer is cached, the AI will generate a new response and store it for future use.
""")

st.title("📘 InquireAI (Cache-Augmented)")
st.markdown("### Your Fast and Efficient Research Assistant 🚀")

uploaded_pdf = st.file_uploader("📂 Upload a Research Document (PDF)", type="pdf")

if uploaded_pdf:
    saved_path = save_uploaded_file(uploaded_pdf)
    raw_docs = load_pdf_documents(saved_path)
    processed_chunks = chunk_documents(raw_docs)
    full_document_text = get_full_document_text(processed_chunks)
    st.session_state["document_text"] = full_document_text
    st.success("✅ Document uploaded successfully! Ask questions below.")

# Chat interface for continuous conversation
user_input = st.chat_input("💬 Ask your question about the document...")

if user_input:
    st.session_state["conversation_history"].append({"role": "user", "content": user_input})

    with st.chat_message("user"):
        st.write(user_input)

    with st.spinner("🔍 Checking cache..."):
        ai_response = generate_answer(user_input, st.session_state["document_text"])

    st.session_state["conversation_history"].append({"role": "assistant", "content": ai_response})

    with st.chat_message("assistant", avatar="🤖"):
        st.write(ai_response)

# Display the entire conversation history
for message in st.session_state["conversation_history"]:
    with st.chat_message(message["role"]):
        st.write(message["content"])
Outputs:


Key Takeaways
Drastically reduced response time — No need to recompute answers for repeated queries.
Lower computational costs — Efficient memory usage eliminates unnecessary LLM calls.
Improved scalability — Ideal for enterprise chatbots handling large user bases.
Seamless multi-turn interaction — Users experience instant responses, enhancing engagement.
No external vector database required — Eliminates dependency on FAISS, Chroma, or other retrieval-based systems.
Potential Further Steps
Expand Caching Mechanisms — Implement intelligent expiration policies for the cache to keep responses fresh.
Hybrid Approach: CAG + RAG — Combine caching with retrieval for optimized long-term memory.
Fine-Tune for Specific Domains — Train DeepSeek R1 on custom datasets for enhanced domain-specific accuracy.
Deploy at Scale — Integrate with enterprise cloud platforms to handle thousands of queries per second.






------




Deploy A LangGraph AI Agent In 5 Minutes (For Free!)
Filip K
AI Advances
Filip K

·
Follow

Published in
AI Advances

·
10 min read
·
Feb 5, 2025
208


3





A neural network brain
Photo by Growtika on Unsplash
If you are still wondering what the next big tech trend for 2025 will be, look no further. The results are out and it’s clear that the winner is AI Agents.

With OpenAI introducing their Operator Software and Claude releasing Computer Use, it’s undeniable that big companies are betting on a future with agents working for humans and AI automation at the core of every industry.

And we can see this is the case by checking the Google Trends graph for AI Agents.

The results of google search trends for ‘ai agents’ keywords
‘ai agents’ — Google Trends
So what are agents? Simply put, they are AI-powered apps that have the ability to interact with the world and decide autonomously what to do next. Similarly to humans, they can plan, act and reassess based on the results of their actions.

There are several different frameworks with unique approaches to building AI Agents, as the space is still exploring what are the best practices and methods.

One particular framework that stands out from the rest is LangGraph, due to its intuitive and modular approach to designing agent flows as graphs that we can visualize.

We will be learning how to deploy a LangGraph for free (without using LangGraph Cloud) while including key features, like memory, that would otherwise be managed for you.

We will start by running our graph locally with docker compose, and making sure that it’s connected to our local database. Once that is ready, I will show you how to deploy on fly.io, a Platform as as Service (PaaS) service that allows us to deploy applications easily.

LangGraph
LangGraph‘s approach to building agents is simple. You define your agent as a Direct Acyclic Graphs (DAGs) that connects nodes and edges. Each node represents a state the agent can be in and perform actions. The edges represent the transition between different states.

LangGraph is already being adopted by major companies, which makes it a safer bet than less-known agent frameworks that haven’t been battle-tested.

Replit built all of their agent workflows using LangGraph.
Elastic, one of the earliest big company adopters of LangGraph AI agents.
Currently, the easiest way to deploy LangGraphs is to use LangGraph Cloud, their paid offering with managed deployment and useful additional features like authentication and double-texting. This is great, but unfortunately, cloud is on the expensive side, as LangChain (the parent company) mostly targets enterprise customers.

Thankfully LangGraph is an open-source library, which means that we are able to deploy our graphs completely for free. We simply need to follow some extra steps to get there.

Set up
We will be modifying one of the examples present in the LangChain documentation: https://github.com/langchain-ai/memory-agent

The Memory Agent LangGraph
LangGraph of Memory Agent (from docs)
This is a simple agent that can capture memories from its conversation with the user. This feature allows it to learn user preferences, remember important details and adapt the conversation to the user over time.

To get started, clone the repository into your local machine. This will give us all the initial code to run our graph locally.

Also, don’t forget to create a .env file with the following variables filled:

ANTHROPIC_API_KEY=<YOUR_ANTHROPIC_API_KEY>
X_API_KEY=<ANY_VALUE>
DATABASE_URL=
We will be interacting with claude-3.5-sonnet model, so we will need an Anthropic API Key. You can obtain one from their website.

Dependencies
Before deploying our Graph we will install Poetry. This is a Python package manager that will make our life much easier when installing and managing dependencies. First follow poetry’s installation guide here.

Then, replace the existing pyproject.toml with the one below. This includes all the dependencies that we will need to make our deployed graph work.

[tool.poetry]
name = "langgraph-deploy-demo"
version = "0.1.0"
description = "A LangGraph deployment on Fly.io"
authors = ["YOUR_NAME <YOUR_EMAIL>"]
readme = "README.md"
package-mode = true

[tool.poetry.dependencies]
python = "^3.11"
langgraph = "^0.2.60"
langchain-core = "^0.3.29"
langchain-community = "^0.3.14"
langchain-openai = "^0.2.14"
trustcall = "^0.0.26"
ipython = "^8.31.0"
fastapi = "^0.115.6"
python-dateutil = "^2.9.0.post0"
uvicorn = "^0.34.0"
langgraph-checkpoint-postgres = "^2.0.9"
langchain-anthropic = "^0.3.1"
psycopg-binary = "^3.2.3"


[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
Then we simply need to install all the dependencies with

poetry install
And we are all set to start developing!

API
One of the benefits that LangGraph Cloud provides out of the gate is an API Interface with which to interact with your graph.

Since we will be deploying the graph on our own we will need to build our own API endpoints, and secure them. For this we will use FastAPI, my go to framework for building APIs quickly and easily.

Let’s create a server.py and put it under src/server.py.

from http.client import HTTPException
import os
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from fastapi.security import APIKeyHeader
from src.memory_agent.state import State
from src.memory_agent.graph import builder
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langgraph.store.postgres.aio import AsyncPostgresStore
from contextlib import asynccontextmanager

# Load .env vars
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Generated docs endpoint
@app.get("/")
async def redirect_root_to_docs():
    return RedirectResponse("/docs")

# Helper function for protecting our /generate endpoint
X_API_KEY = APIKeyHeader(name="X_API_KEY")
def api_key_auth(x_api_key: str = Depends(X_API_KEY)):
    """takes the X-API-Key header and validate it with
       the X-API-Key in the database/environment"""
    if x_api_key != os.environ["X_API_KEY"]:
        raise HTTPException(
            status_code=401,
            detail="""
                Invalid API Key. Check that you are passing 
                a 'X-API-Key' on your header.
            """
        )


# The endpoint our agent will reply through
@app.post("/generate", dependencies=[Depends(api_key_auth)])
async def generate_route(state: State):
    graph = builder.compile()
    graph.name = "LangGraphDeployDemo"
    config = {"configurable": {"thread_id": "3"}}
    try:
        result = await graph.ainvoke(state, config)
        return {"success": True, "result": result}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8080)
This file provides us a basic, protected API interface for us to interact with our graph. We can test it out by running the following command in the terminal:

poetry run python src/server.py
and we should see our server running on the 8080 port:

INFO:     Started server process [64572]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8080 (Press CTRL+C to quit)
Unfortunately, at this point our agent is not able to reply to us yet. We can try to make a request with the command below. Remember to use your own X_API_KEY that you set in .env.

curl --location 'localhost:8080/generate' \
--header 'X_API_KEY: <YOUR_X_API_KEY>' \
--header 'Content-Type: application/json' \
--data '{
    "messages":[
        {
            "type": "human",
            "content": "hello"
        }
    ]
}'
But we will be greeted with a 500 — Internal Server Error. Why? We still haven’t set up the database for the agent to store it’s memories. Once we do that, our agent will be ready to chat with us.

Memory
Memory is a key component of an Agent. Similarly to humans, memory is what allows agents to plan ahead, store data and retrieve it when needed.

To store memory we need to connect our agent to a database. For that, we will use a simple option that most of us are already familiar with, a Postgres database.

LangGraph provides us Postgres connectors available in the langgraph-checkpoint package. This should already be installed if you copied the pyproject.toml earlier in this article. This package will allow us to point the store and checkpointer to our Postgres DB. These are both abstractions that LangGraph requires to give our agent memory.

Let’s make sure they are both initialized when we first run the app. We will create a lifespan function that simply initializes our store and checkpointer when we first run the app.

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database connections when the app starts
    async with AsyncPostgresStore.from_conn_string(os.environ["DATABASE_URL"]) as store:
        async with AsyncPostgresSaver.from_conn_string(os.environ["DATABASE_URL"]) as checkpointer:
            app.state.store = store
            app.state.checkpointer = checkpointer
            
            await app.state.store.setup()
            await app.state.checkpointer.setup()
            
            yield
            
            # Clean up connections when the app shuts down
            await app.state.store.close()
            await app.state.checkpointer.close()


app = FastAPI(lifespan=lifespan)
Then, lets update our /generate endpoint to use the app store and checkpointer to compile the langgraph.

@app.post("/generate", dependencies=[Depends(api_key_auth)])
async def generate(state: State, request: Request):
    if not request.app.state.store or not request.app.state.checkpointer:
        raise HTTPException(
            status_code=500,
            detail="Database or checkpoint store not found. 
                    Please check your DATABASE_URL.",
        )
    graph = builder.compile(
        store=request.app.state.store,
        checkpointer=request.app.state.checkpointer,
    )
    graph.name = "LangGraphDeployDemo"
    config = {"configurable": {"thread_id": "3"}}
    try:
        result = await graph.ainvoke(state, config)
        return {"success": True, "result": result}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
Now all we need to do is to run the DB in parallel with our application and we are all set!

Dockerizing
The easiest option to run our agent and connect it to the Postgres DB is to run both with docker-compose. Let’s start by creating the application Dockerfile at the root level:

FROM python:3.12.8-slim

# Create and switch to the app directory
WORKDIR /app

# Copy only pyproject.toml and poetry.lock first
COPY pyproject.toml poetry.lock* ./

# Install Poetry
RUN pip install --no-cache-dir poetry

# Install dependencies (system-wide, since we turn off virtualenv creation)
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Now copy your entire source code
COPY . /app

# Finally, run your server
CMD ["python", "src/server.py"]
This will initialize the python 3.12 image and install all of our dependencies.

We can try to build and run the docker image to make sure everything works as expected:

docker build -t langgraph-deploy-test . 
docker run -p 8000:8000 langgraph-deploy-test
We should again see our server running on port 8080 as before! But we still haven’t run and connected the database to the agent, so let’s do that by creating a docker-compose.yaml at the root level of the project:

version: '3.8'

services:
  langgraph_demo:
    build: .
    command: >
      bash -c "python src/server.py"
    ports:
      - 8000:8000
    depends_on:
      - langgraph_demo_db
    environment:
      - DATABASE_URL=
postgresql://langgraph_demo:langgraph_demo@langgraph_demo_db:5432/postgres
    networks:
      - langgraph_network

  langgraph_demo_db:
    image: postgres:15
    container_name: langgraph_demo_db
    restart: always
    environment:
      POSTGRES_USER: langgraph_demo
      POSTGRES_PASSWORD: langgraph_demo
    ports:
      - '5432:5432'
    volumes:
      - langgraph_demo_db:/var/lib/postgresql/data
    networks:
      - langgraph_network

volumes:
  langgraph_demo_db:
    driver: local

networks:
  langgraph_network:
    driver: bridge
Now we can run

docker compose up
If everything went well, you should see logs of the Postgres DB and the application being initialized.

This time, the agent is connected to the database and so we should no longer get the 500 reply we got before. If we send the same curl command as previously we should get a response similar to this:

{
    "success": true,
    "result": {
        "messages": [
            {
                "content": "hello",
                "additional_kwargs": {},
                "response_metadata": {},
                "type": "human",
                "name": null,
                "id": "c1269f92-2d4f-405b-9818-4c30524d050a",
                "example": false
            },
            {
                "content": "Hello there! It's wonderful to meet you. 
  How are you doing today? I'm excited to chat and get to know you better. 
  Is there anything in particular you'd like to talk about, 
  or shall we start with some casual conversation?",
                "additional_kwargs": {},
                "response_metadata": {
                    "id": "msg_01SYADKmjxytYRwdDqjYnsDK",
                    "model": "claude-3-5-sonnet-20240620",
                    "stop_reason": "end_turn",
                    "stop_sequence": null,
                    "usage": {
                        "cache_creation_input_tokens": 0,
                        "cache_read_input_tokens": 0,
                        "input_tokens": 576,
                        "output_tokens": 52
                    }
                },
                "type": "ai",
                "name": null,
                "id": "run-633827f2-df5c-4e24-80a7-a7953de7a900-0",
                "example": false,
                "tool_calls": [],
                "invalid_tool_calls": [],
                "usage_metadata": {
                    "input_tokens": 576,
                    "output_tokens": 52,
                    "total_tokens": 628,
                    "input_token_details": {
                        "cache_read": 0,
                        "cache_creation": 0
                    }
                }
            }
        ]
    }
}
We are ready!
Success! We can see that we that Claude-3.5-sonnet replies to our messages. We also get in the reply some details about usage, model name and cache usage. This can be useful when trying to estimate costs for each request.

Now let’s see the agent’s memory in action. We must first send a message containing some information for the agent to remember:

{
    "messages":[
        {
            "type": "human",
            "content": "Hi, my name is Filip K and you are currently in
                       a demo on how to deploy LangGraph"
        }
    ]
}
Our agent should then record this information and let us know that it did. The reply should be something along the lines of:

Hello Filip K! It's great to meet you. Thank you for sharing that information 
with me. I understand that I'm currently part of a demo on how to deploy
LangGraph. That's very interesting!

Given this context, I think it would be good to make a note of this
information. Let me store this as a memory so we can reference it later
if needed.
And we can confirm that the memory was indeed stored by connecting to the database and inspecting the store table.

We can connect to the DB with the command below

psql postgresql://langgraph_demo:langgraph_demo@localhost:5432/postgres
Please note that here we need to use localhost as host, since we will be connecting from outside the Docker container. In the docker-compose the host is the name of the DB image ‘langgraph_demo_db’.

Now we can check the available tables with the command \dt. These are the tables created during the setup of both the checkpoint and the store.

postgres=# \dt
                    List of relations
 Schema |         Name          | Type  |     Owner      
--------+-----------------------+-------+----------------
 public | checkpoint_blobs      | table | langgraph_demo
 public | checkpoint_migrations | table | langgraph_demo
 public | checkpoint_writes     | table | langgraph_demo
 public | checkpoints           | table | langgraph_demo
 public | store                 | table | langgraph_demo
 public | store_migrations      | table | langgraph_demo
(6 rows)
And finally we can check what memories have been saved so far

postgres=# SELECT * FROM store;
-[ RECORD 1 ]---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
prefix     | memories.default
key        | a7c70b1d-118d-464f-9b04-c517acab3eef
value      | {"content": "User's name is Filip. The conversation is part of a demo on deploying LangGraph.", "context": "Introduced during the initial greeting and context setting of the conversation."}
created_at | 2025-02-04 06:12:40.058925+00
updated_at | 2025-02-04 06:12:40.058925+00
Now the agent will be able to retrieve these memories whenever needed in the conversation. LangGraph provides with some utility functions to do semantic search on memories, but that’s a topic we will get into in another post.

Final Words
There we go! You are now able to deploy your graph on any platform that supports dockerized applications.

If you scrolled all the way down to find the github repository here it is ;) https://github.com/filipkny/langgraph-deploy-demo

In the next post we will show how to test and debug your AI agents with LangGraph Studio and how to deploy them using fly.io, which makes the whole process simple (and is also free). Deploying should be very easy with the current project set up as it is so feel free to give it a shot now!

Thanks for reading my post! I write about technology and self-improvement. If you are developer interested in escaping your 9–5 and earning back your freedom, please give me a follow here and on twitter: @itsfilipk




----------

Cache-Augmented Generation (CAG) in LLMs: A Step-by-Step Tutorial
Ronan Takizawa
Ronan Takizawa

·
Follow

5 min read
·
Jan 2, 2025
282


3






Full Code (Make sure to leave the Original Repo a Star!) ⭐️

Retrieval-augmented generation (RAG) is a powerful method to connect external knowledge bases to an LLM and fetch context each time a user asks a question, but it can slow down the LLM’s performance due to its retrieval latency.

Cache-augmented generation (CAG) offers a faster alternative; instead of performing real-time retrieval, it preloads your relevant documents into the model’s context and stores that inference state — also known as a Key-Value (KV) cache. This approach eliminates retrieval latencies, allowing the model to access preloaded information instantly for faster and more efficient responses.

For a more technical explanation of CAG, check out this article.

In this tutorial, we will show how to build a simple CAG setup to embed all your knowledge upfront, quickly answer multiple user queries, and reset the cache without reloading the entire context each time.

Prerequisites
1. A HuggingFace account and a HuggingFace access token

2. A document.txt file with sentences about yourself.

Project Setup
We import the essential libraries:

torchfor PyTorch.
transformers for Hugging Face.
DynamicCache for storing the model’s key-value states.
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers.cache_utils import DynamicCache
import os
Generate Function
We’ll next define the generate function.

The generate function handles token-by-token generation with the cached knowledge using greedy decoding.

Greedy decoding is a simple text generation method where, at each step, the token with the highest probability (maximum value in the logits) is selected as the next token.

We pass in these inputs:

model: The LLM, which with me Mistral-7B for this tutorial.
input_ids: A tensor containing the tokenized input sequence.
past_key_values: The core component of the CAG. A cache of previously computed attention values is used to speed up inference by avoiding recomputation.
max_new_tokens: The maximum number of new tokens to generate. The default is 50.
The function operates in a loop that iterates up to max_new_tokens times or terminates early if an end-of-sequence token (if configured) is generated.

At each iteration:

The model processes the current input tokens along with the cached past_key_values, producing logits for the next token.
The logits are analyzed to identify the token with the highest probability using greedy decoding.
This new token is appended to the output sequence, and the cache (past_key_values) is updated to include the current context.
The newly generated token becomes the input for the next iteration.
def generate(model, input_ids: torch.Tensor, past_key_values, max_new_tokens: int = 50) -> torch.Tensor:
    device = model.model.embed_tokens.weight.device
    origin_len = input_ids.shape[-1]
    input_ids = input_ids.to(device)
    output_ids = input_ids.clone()
    next_token = input_ids

    with torch.no_grad():
        for _ in range(max_new_tokens):
            out = model(
                input_ids=next_token,
                past_key_values=past_key_values,
                use_cache=True
            )
            logits = out.logits[:, -1, :]
            token = torch.argmax(logits, dim=-1, keepdim=True)
            output_ids = torch.cat([output_ids, token], dim=-1)
            past_key_values = out.past_key_values
            next_token = token.to(device)

            if model.config.eos_token_id is not None and token.item() == model.config.eos_token_id:
                break
    return output_ids[:, origin_len:]
DynamicCache Setup
Next, we’ll define the get_kv_cache function that prepares a reusable key-value cache for a transformer model’s attention mechanism and the clean_up function that cleans the key-value cache by removing unnecessary entries to ensure that you can answer multiple independent questions without “polluting” the cache.

get_kv_cache passes a prompt (in our case, the knowledge from document.txt) through the model once, creating a KV cache that records all the hidden states from each layer.

get_kv_cache passes in these inputs:

model: The transformer model used for encoding the prompt.
tokenizer: Tokenizer to convert the prompt into token IDs.
prompt: A string input is used as the prompt.
and returns an object of the type DynamicCache.

The get_kv_cache function first tokenizes the provided prompt using the tokenizer, converts it into input IDs, and then initializes an DynamicCache object to store key-value pairs, and then performs a forward pass through the model with caching enabled (use_cache=True). This populates the cache with the key-value pairs resulting from the model's computation.

The clean_up trims a DynamicCache object to match the original sequence length by removing any additional tokens added during processing. For each layer of the cache, it slices both the key and value tensors to retain only the first origin_len tokens along the sequence dimension.

def get_kv_cache(model, tokenizer, prompt: str) -> DynamicCache:
    device = model.model.embed_tokens.weight.device
    input_ids = tokenizer(prompt, return_tensors="pt").input_ids.to(device)
    cache = DynamicCache()

    with torch.no_grad():
        _ = model(
            input_ids=input_ids,
            past_key_values=cache,
            use_cache=True
        )
    return cache

def clean_up(cache: DynamicCache, origin_len: int):
    for i in range(len(cache.key_cache)):
        cache.key_cache[i] = cache.key_cache[i][:, :, :origin_len, :]
        cache.value_cache[i] = cache.value_cache[i][:, :, :origin_len, :]
Load LLM (Mistral)
Now we’ll load the Mistral-7B model, and load the tokenizer and model in full precision or half precision (FP16) on GPU if available.

Remember to input YOUR_HF_TOKEN with your unique HuggingFace Token.

model_name = "mistralai/Mistral-7B-Instruct-v0.1"
tokenizer = AutoTokenizer.from_pretrained(model_name, token="YOUR_HF_TOKEN", trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    device_map="auto",
    trust_remote_code=True,
    token="YOUR_HF_TOKEN"
)
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)
print(f"Loaded {model_name}.")
Create a Knowledge Prompt from document.txt
Next, we’ll read document.txt , which you can fill with information about yourself. For this tutorial, document.txt contains information about me (Ronan Takizawa).

Here we construct a simple system prompt embedding with the doc information and pass it to get_kv_cache to generate the KV cache.

with open("document.txt", "r", encoding="utf-8") as f:
    doc_text = f.read()

system_prompt = f"""
<|system|>
You are an assistant who provides concise factual answers.
<|user|>
Context:
{doc_text}
Question:
""".strip()

ronan_cache = get_kv_cache(model, tokenizer, system_prompt)
origin_len = ronan_cache.key_cache[0].shape[-2]
print("KV cache built.")
Ask Questions Reusing the Cache
We first run clean_up to clear our cache (Good practice for CAGs).

Next, we convert our questions into tokens in input_ids_q1 , then appended to the knowledge context stored in ronan_cache.

Finally, we call generate to produce the answer, decoding the final result with tokenizer.decode.

question1 = "Who is Ronan Takizawa?"
clean_up(ronan_cache, origin_len)
input_ids_q1 = tokenizer(question1 + "\n", return_tensors="pt").input_ids.to(device)
gen_ids_q1 = generate(model, input_ids_q1, ronan_cache)
answer1 = tokenizer.decode(gen_ids_q1[0], skip_special_tokens=True)
print("Q1:", question1)
print("A1:", answer1)
You should expect a response like this:

Q1: Who is Ronan Takizawa?
A1: Answer: Ronan Takizawa is an ambitious and accomplished 
tech enthusiast. He has a diverse skill set in 
software development, AI/ML...
Conclusion
Cache-augmented generation (CAG) simplifies AI architectures by storing small knowledge bases directly within a model’s context window, eliminating the need for retrieval loops in RAG and reducing latency. This approach enhances response speed and improves the responsiveness of an LLM with external knowledge. By leveraging CAG, developers can streamline their AI systems for faster and more efficient knowledge integration, particularly for tasks with stable, compact datasets.



-----------


Getting Started with Cache Augmented Generation in RAG
Cache-Augmented Generation boosts RAG efficiency by storing frequently accessed data for faster retrieval. This guide covers the fundamentals, benefits, and implementation strategies to enhance AI-driven knowledge retrieval and reduce latency.

Arooj
Arooj
10 Mar 2025 • 10 min read
Getting Started with Cache Augmented Generation in RAG
Large language models struggle with a common trade-off: speed vs. accuracy. Retrieval-Augmented Generation (RAG) has long been the standard for integrating external knowledge into AI systems, but it comes at a cost—slow retrieval times, complex pipelines, and inconsistent results.

A new approach is challenging this norm. Cache-Augmented Generation (CAG) preloads relevant knowledge directly into the model’s extended context, eliminating retrieval delays while maintaining precision. 

The implications are huge. Imagine AI models that can respond instantly to complex queries, provide consistent answers across interactions, and operate without relying on real-time search engines. Industries like finance, healthcare, and legal research stand to benefit from this shift.

This article explains how Cache-Augmented Generation works, when to use it over RAG, and how to implement it effectively.

CAG or RAG – Cache vs. Retrieval Augmented Generation - EnkiAI
Image source: enkiai.com
Core Concepts of CAG
Cache-Augmented Generation (CAG) fundamentally redefines knowledge integration by embedding preloaded datasets into the extended context windows of large language models (LLMs). 

This approach eliminates the need for real-time retrieval, streamlining operations and enhancing reliability. Unlike RAG, where external retrieval introduces latency and potential inconsistencies, CAG ensures that all necessary knowledge is immediately accessible. 

For instance, IBM’s integration of CAG in its Granite LLMs improved query response times by leveraging preloaded regulatory documents for compliance checks.

An unexpected advantage of CAG is its ability to maintain contextual coherence over extended interactions. CAG avoids the pitfalls of fragmented retrieval pipelines by preloading domain-specific knowledge, such as medical guidelines or legal precedents. 

This makes it particularly effective in high-stakes healthcare environments where consistency is critical.

However, a common misconception is that CAG is limited to static datasets. 

Emerging hybrid models suggest dynamic updates to preloaded caches can bridge this gap, combining adaptability and efficiency. As LLMs evolve, CAG’s potential to balance simplicity and scalability will redefine knowledge-intensive workflows.

Cache-Augmented Generation CAG: The Future of Efficient 
Image source: medium.com
Preloading Relevant Documents
Preloading relevant documents in Cache-Augmented Generation (CAG) is a critical step that directly impacts the system’s efficiency and accuracy. 

This process involves curating, preprocessing, and encoding datasets into the model’s key-value (KV) cache, ensuring immediate accessibility during inference. 

The success of this approach hinges on document prioritization and context optimization.

For example, Bloomberg’s financial analytics system leverages CAG by preloading datasets such as historical market trends and regulatory guidelines. 

A unique insight emerges when considering chunk optimization—breaking documents into smaller, contextually relevant segments. 

This technique minimizes redundancy and maximizes token efficiency, particularly in LLMs with context windows exceeding 32,000 tokens. Additionally, dynamic knowledge prioritization allows models to adapt preloaded caches based on query patterns, bridging the gap between static and dynamic datasets.

Looking forward, integrating automated document curation using machine learning could further refine preloading workflows, ensuring scalability and adaptability across diverse applications.

Precomputation of Key-Value Caches
Pre-computation of key-value (KV) caches is a cornerstone of Cache-Augmented Generation (CAG). CAG enables retrieval-free inference by storing reusable context representations. 

This process involves encoding preloaded datasets into a KV cache, which captures the model’s inference state and significantly reduces computational redundancy.

A notable application is IBM’s Granite LLMs, which utilize precomputed KV caches for compliance checks. By encoding regulatory documents into the cache, IBM improved query response times while maintaining high accuracy. 

This efficiency stems from eliminating repetitive computations during inference, allowing the model to focus solely on query-specific processing.

An emerging trend is adaptive cache encoding, where the KV cache dynamically adjusts based on query patterns. 

This approach optimizes memory usage and ensures that high-priority data remains accessible. Additionally, cache segmentation—dividing the cache into modular components—enhances scalability by isolating domain-specific knowledge.

Future strategies should explore hierarchical caching models. In these models, multi-layered caches prioritize critical data while offloading less relevant information, ensuring sustained performance in increasingly complex workflows.

Utilizing Extended Context in LLMs
The extended context capabilities of modern LLMs, such as GPT-4 (32k tokens) and Claude 2 (100k tokens), have redefined the boundaries of Cache-Augmented Generation (CAG). 

Extended context windows accommodate larger datasets within a single inference cycle, reducing the need for aggressive document chunking, preserving coherence, and improving response accuracy.

A compelling case study is Anthropic’s deployment of Claude 2 in customer support systems. By leveraging its 100k-token context window, the model preloaded comprehensive product manuals and troubleshooting guides. 

This approach reduced average resolution times as users received contextually rich, uninterrupted responses without retrieval delays.

Key Insight: Extended context windows enable contextual layering, where hierarchical knowledge—such as general guidelines followed by specific case studies—is embedded seamlessly. This structure enhances the model’s ability to address complex, multi-faceted queries.

Emerging trends suggest that context prioritization algorithms will be pivotal in optimizing token allocation within extended windows. For instance, dynamically weighting high-relevance sections ensures critical information remains accessible without exceeding token limits.

Future strategies should explore context compression techniques to maximize utility, ensuring scalability as context windows expand further.

Implementing CAG in RAG Systems
Integrating Cache-Augmented Generation (CAG) into Retrieval-Augmented Generation (RAG) systems requires a strategic blend of preloading efficiency and retrieval adaptability. 

A key insight is that CAG can act as a stabilizing layer, preloading static, high-priority datasets while RAG dynamically retrieves volatile or time-sensitive information. This hybrid approach ensures both reliability and adaptability.

For instance, a healthcare platform could preload medical guidelines and historical patient data using CAG, while employing RAG to fetch real-time updates on drug recalls or emerging research. 

This dual-layered system minimizes latency and enhances decision-making accuracy in critical scenarios.

A common misconception is that CAG’s preloaded caches are inherently static. However, dynamic cache updates—triggered by query patterns or scheduled refreshes—can bridge the gap between static and dynamic data needs. 

This flexibility is exemplified by IBM’s Granite LLMs, which periodically update regulatory caches to maintain compliance accuracy.

Future implementations should explore cache prioritization algorithms to optimize resource allocation, ensuring seamless integration in knowledge-intensive workflows.

Document Curation and Preprocessing
Effective document curation and preprocessing are pivotal in optimizing Cache-Augmented Generation (CAG) within hybrid RAG systems. 

The process involves selecting, structuring, and encoding datasets to maximize relevance and minimize redundancy, ensuring seamless integration into the model’s key-value (KV) cache.

Chunk optimization further enhances efficiency by segmenting documents into smaller, contextually relevant units. Additionally, dynamic query analysis enables adaptive updates to preloaded caches, bridging static and dynamic data needs.

Emerging trends suggest that machine learning-driven curation will revolutionize preprocessing workflows. Algorithms that predict query patterns can automate document selection, ensuring scalability across diverse applications.

Future strategies should explore contextual compression models to optimize token allocation, ensuring sustained performance as context windows expand.

Cache Management and Reset Mechanisms
Efficient cache management and reset mechanisms are critical for maintaining the performance and adaptability of Cache-Augmented Generation (CAG) systems. A well-designed strategy ensures that preloaded knowledge remains relevant while minimizing computational overhead.

One innovative approach is priority-based cache eviction. In this approach, less frequently accessed data is replaced by high-priority updates. This method ensures that critical information remains accessible without overloading the system.

Segmented cache structures further enhance flexibility by isolating domain-specific knowledge. Bloomberg’s financial analytics platform, for instance, segments caches into regulatory, market, and historical data layers. 

This modular design allows targeted resets, improving response accuracy during volatile market conditions.

Emerging trends highlight the potential of predictive cache resets driven by machine learning. 

Systems can preemptively refresh caches by analysing query patterns, aligning with user needs. Additionally, hierarchical caching models prioritize core datasets while offloading less critical information to secondary layers, optimizing memory usage.

Future strategies should explore automated reset frameworks to balance stability and adaptability, ensuring long-term scalability in knowledge-intensive applications.

Adapting Inference Processes
Adapting inference processes in Cache-Augmented Generation (CAG) systems requires a nuanced balance between efficiency and contextual accuracy. 

A critical innovation is dynamic query routing, where inference pathways are optimized based on query complexity. 

Inference layering is another transformative approach. This method ensures that responses remain coherent while adapting to the depth of user queries.

Emerging trends emphasize contextual token prioritization, where high-relevance data is dynamically weighted during inference. 

Future strategies should explore adaptive inference frameworks that integrate real-time feedback loops, enabling systems to refine their processes continuously. 

This evolution will ensure that CAG systems remain robust and responsive in increasingly complex environments.

Advanced Applications and Optimization
Cache-Augmented Generation (CAG) is unlocking advanced applications by optimizing knowledge workflows in ways previously unattainable with Retrieval-Augmented Generation (RAG). 

An unexpected connection emerges in personalized education platforms like Coursera, which preload course materials and adaptive learning paths into CAG systems. 

A common misconception is that CAG is unsuitable for dynamic datasets. However, hybrid models integrating dynamic cache updates have bridged this gap, as seen in IBM’s compliance systems, which refresh regulatory caches weekly to maintain accuracy.

Future advancements should explore predictive cache layering, where machine learning anticipates data needs, ensuring scalability across diverse, high-stakes domains.

Cache-Augmented Generation: Rethinking Context
Image source: medium.com
Optimizing CAG for Various Tasks
Optimizing Cache-Augmented Generation (CAG) for diverse tasks requires a tailored approach that aligns preloaded knowledge with task-specific demands. 

A critical factor is domain-specific cache structuring, where datasets are segmented and prioritized based on relevance. 

For instance, IBM’s Granite LLMs employ modular cache layers for compliance checks, isolating regulatory, financial, and operational data. 

A novel metric, Cache Utilization Efficiency (CUE), can evaluate the effectiveness of preloaded caches. CUE measures the ratio of relevant cache hits to total queries, offering actionable insights into cache optimization. 

Emerging trends highlight the role of adaptive cache refresh cycles. 

Unlike static updates, adaptive cycles leverage machine learning to predict when caches require updates, ensuring relevance without overloading resources. 

To further optimize CAG, organizations should explore context-aware token allocation algorithms. These algorithms dynamically prioritize high-impact data within extended context windows, ensuring critical information remains accessible. 

Integrating predictive analytics with cache management will redefine its scalability as CAG evolves, enabling seamless performance across increasingly complex workflows.

Hybrid Approaches with CAG and RAG
Hybrid approaches combining Cache-Augmented Generation (CAG) and Retrieval-Augmented Generation (RAG) offer a strategic balance between efficiency and adaptability, particularly in knowledge-intensive domains. 

A key innovation is dynamic task partitioning, where static, high-priority datasets are preloaded via CAG, while RAG handles volatile or less predictable queries. This dual-layered system ensures both speed and relevance.

A compelling case study is the implementation by a leading healthcare platform, which preloaded medical guidelines and patient histories using CAG while employing RAG to retrieve real-time updates on drug recalls and emerging research. 

To evaluate hybrid system performance, the Hybrid Efficiency Index (HEI) can be introduced. HEI measures the ratio of preloaded cache hits to retrieval events, weighted by query complexity.

Emerging trends suggest that context-aware hybrid frameworks will dominate future applications. 

These frameworks dynamically adjust the balance between CAG and RAG based on query patterns, user intent, and domain-specific priorities. 

For instance, retail platforms could preload product catalogs via CAG while using RAG to fetch inventory updates, enhancing customer experience and operational efficiency.

Future strategies should explore predictive hybrid models that leverage machine learning to optimize task allocation, ensuring scalability and precision in increasingly complex workflows.

Scaling CAG for Larger Knowledge Bases
Scaling Cache-Augmented Generation (CAG) for larger knowledge bases requires innovative strategies to overcome the inherent limitations of finite context windows and memory constraints. 

A pivotal approach is hierarchical cache layering, where knowledge is segmented into prioritized tiers based on relevance and frequency of access. 

This method ensures that critical data remains within the primary cache, while less essential information is offloaded to secondary layers. 

Another transformative technique is context-aware compression algorithms, which optimize token allocation by dynamically summarizing low-priority data. 

Anthropic’s Claude 2 demonstrated this by compressing extended product manuals into high-relevance segments. This enabled the model to handle datasets exceeding 100,000 tokens without sacrificing accuracy. 

The Cache Scalability Index (CSI) can be introduced to measure scalability. CSI evaluates the efficiency of cache utilization relative to the size of the knowledge base, factoring in query complexity and response latency. 

Emerging trends highlight the potential of distributed caching architectures, where multiple models share segmented caches across a network. 

This reduces memory bottlenecks and enhances scalability for enterprise-level applications.

Future strategies should explore predictive cache distribution models that leverage machine learning to anticipate data needs, ensuring seamless performance across increasingly expansive knowledge domains.

FAQ
What is Cache Augmented Generation (CAG), and how does it differ from Retrieval Augmented Generation (RAG)?


How does Cache Augmented Generation improve efficiency in AI workflows?


What are the key steps to implement Cache Augmented Generation in a hybrid RAG system?


Which industries benefit the most from Cache Augmented Generation?


What are the best practices for optimizing preloaded caches in Cache Augmented Generation?


Conclusion
Cache Augmented Generation offers a new approach to knowledge retrieval by reducing reliance on real-time search. 

It improves efficiency, speeds up inference, and ensures consistent accuracy, especially for industries handling large, stable datasets. 

While Retrieval Augmented Generation remains useful for dynamic content, CAG provides a scalable, reliable alternative for tasks requiring structured, preloaded information. 

Future advancements will focus on refining cache optimization techniques and integrating hybrid models that balance efficiency with adaptability.







--------------




Based on the given data and the flow of CAG and Agentic systems - I want to create a langgraph based AI chatbot for recommendations, customer customer support, general support, product finding, men's faishon based questions-answering chatbot using the CAG system where I will put my document in the directory and I want to make it in fastapi to be used by some other Backend Systems and I am making it for Ecommerce applications - so I want to make it and you will have to help me make it from the starting to end where we can use different AI model provide - groq with llama models, open ai models, google gemini models - the project should be such that where I can use any of them just by adjusting things in the .env file and providing the API keys - so prepare the code and the full plan for me for implementation of these things in fastapi + langgraph