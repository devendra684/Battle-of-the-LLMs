Q: 6
Battle of the LLMs: Summarizer Showdown
💡 Objective:
Build a simple web app where users can:

Select two different LLMs (open-source or proprietary)
Input a long-form text (news article, blog, transcript, etc.)
Get summaries from both models side-by-side
Rate and compare results based on clarity, conciseness, and correctness
🛠️ Features & Flow:

1. Model Selection Dropdowns
   Dropdown 1: Closed-source APIs
   OpenAI GPT-3.5 / GPT-4
   Anthropic Claude (optional)
   Dropdown 2: Open-source (via HuggingFace)
   facebook/bart-large-cnn
   google/pegasus-xsum
   mistralai/Mixtral (if available with text summarization pipeline)
   Let the user choose

any combination

2. Input Text Box
   Paste or upload a long article (~500–1000 words)
   Optional: Pre-load some sample inputs for speed
3. LLM Summarization
   When user clicks “Compare Summaries”:
   Make API call to selected Closed LLM (e.g., OpenAI GPT)
   Run inference using selected Open LLM via HuggingFace (HF Inference API or locally using transformers)
   Store responses separately
4. Side-by-side Output View
   Left Panel: Summary from Model 1
   Right Panel: Summary from Model 2
5. User Rating Section
   For each model, let user rate the following on a scale of 1 to 5:

✅ Clarity
🧠 Accuracy
✂️ Conciseness
Also include a final “Which one do you prefer?” option.

6. Overall Report Card
   Show a bar graph or table:
   Model A: Average rating per dimension
   Model B: Same
   Visual preference indication
   Here’s a short and concise submission guideline for Battle of the LLMs: Summarizer Showdown:

Submission Guidelines: Summarizer Showdown
Submit a public GitHub repository link with the code
README with setup steps and models/APIs used
