import streamlit as st
import requests

BACKEND_URL = "http://127.0.0.1:8000/api/v1/qa/ask"

st.set_page_config(
    page_title="P102 Academic RAG",
    page_icon="📚",
    layout="wide"
)

st.title("📚 P102 Academic QA System")
st.caption("Course: Machine Learning Techniques (MLT Unit 1) | Grounded with Page Citations")

# Sidebar Controls
with st.sidebar:
    st.header("Retrieval Settings")
    top_k = st.slider("Top Chunks (k)", min_value=1, max_value=5, value=3)
    confidence_threshold = st.slider("Confidence Gate Threshold", min_value=0.20, max_value=0.80, value=0.45, step=0.05)
    st.divider()
    st.info("Questions scoring below the confidence threshold are rejected automatically to prevent hallucinations.")

# Query Input
question = st.text_input(
    "Ask a question from MLT Unit 1:",
    placeholder="e.g., What is machine learning and what are its main paradigms?"
)

if st.button("Submit Question", type="primary") and question.strip():
    with st.spinner("Searching course materials and generating answer..."):
        try:
            payload = {
                "question": question.strip(),
                "top_k": top_k,
                "confidence_threshold": confidence_threshold
            }
            res = requests.post(BACKEND_URL, json=payload, timeout=60)
            
            if res.status_code == 200:
                data = res.json()
                
                # Check confidence gate status
                if data.get("gated"):
                    st.warning(f"⚠️ **Confidence Gate Triggered** (Score: {data['confidence_score']:.4f})")
                    st.write(data["answer"])
                else:
                    st.success(f"✅ **Answer Generated** (Confidence Score: {data['confidence_score']:.4f})")
                    st.markdown(data["answer"])
                    
                    st.divider()
                    st.subheader("📑 Verified Page Citations")
                    for idx, cite in enumerate(data.get("citations", []), 1):
                        with st.expander(f"Reference {idx}: {cite['source']} — Page {cite['page_number']} (Score: {cite['score']})"):
                            st.write(f"Source file: `{cite['source']}`")
                            st.write(f"Cited Page: **Page {cite['page_number']}**")
                            st.write(f"Vector Similarity: `{cite['score']}`")
            else:
                st.error(f"Backend error ({res.status_code}): {res.text}")
                
        except requests.exceptions.ConnectionError:
            st.error("Could not reach FastAPI backend. Make sure Uvicorn is running on http://127.0.0.1:8000.")
        except Exception as e:
            st.error(f"Error: {str(e)}")