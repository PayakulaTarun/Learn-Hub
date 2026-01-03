import random
import json
import os

TOPICS = [
    "binary search", "linked lists", "recursion", "dynamic programming", "hash maps", "trees"
]

TEMPLATES = {
    "concept_learning": [
        "What is {topic}?",
        "Explain {topic} in simple terms.",
        "Theory behind {topic}.",
        "Define {topic}."
    ],
    "problem_solving": [
        "How do I implement {topic} in python?",
        "I have a bug in my {topic} code.",
        "My {topic} function is causing a stack overflow.",
        "Write code for {topic}."
    ],
    "interview_preparation": [
        "Interview questions about {topic}.",
        "Common mistakes in {topic} interviews.",
        "What is the time complexity of {topic}?",
        "Mock interview for {topic}."
    ],
    "quick_revision": [
        "Quick summary of {topic}.",
        "Recap {topic}.",
        "Key points of {topic}.",
        "TLDR {topic}."
    ]
}

def generate_data(num_samples=100, output_file="synthetic_data.jsonl"):
    print(f"Generating {num_samples} samples...")
    data = []
    
    for _ in range(num_samples):
        intent = random.choice(list(TEMPLATES.keys()))
        template = random.choice(TEMPLATES[intent])
        topic = random.choice(TOPICS)
        query = template.format(topic=topic)
        
        data.append({
            "text": query,
            "label": intent
        })
        
    with open(output_file, "w") as f:
        for item in data:
            f.write(json.dumps(item) + "\n")
            
    print(f"Saved to {output_file}")

if __name__ == "__main__":
    generate_data()
