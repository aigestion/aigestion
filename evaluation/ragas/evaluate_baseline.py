import os
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_recall,
    context_precision,
)
from datasets import Dataset

# Initial Ground Truth Dataset for Q1 2026
evaluation_data = {
    "question": [
        "What are the strategic goals of AIGestion for Q1 2026?",
        "How do I deploy the backend to Cloud Run?",
    ],
    "answer": [
        "The strategic goals for Q1 2026 include caching strategy, NestJS migration, and Design System v2.",
        "You can deploy using the gcloud run deploy command as described in the walkthrough.",
    ],
    "contexts": [
        ["Roadmap Q1 mentions caching, NestJS, and Design System v2 as priorities."],
        ["Walkthrough documents the gcloud run deploy command for backend deployment."],
    ],
    "ground_truth": [
        "Strategic goals for Q1 2026 focus on Architecture (Caching, NestJS), Qality (RAGAS), and Product (Design System v2).",
        "The deployment to Cloud Run is handled via gcloud CLI with specific project and region parameters.",
    ]
}

def run_evaluation():
    print("🚀 Starting RAGAS Evaluation Pipeline...")
    dataset = Dataset.from_dict(evaluation_data)
    
    # Selection of metrics for Q1 validation
    metrics = [
        faithfulness,
        answer_relevancy,
        context_recall,
        context_precision,
    ]
    
    # results = evaluate(dataset, metrics=metrics)
    # print("📊 Evaluation Complete. Scores:")
    # print(results)
    print("⚠️ Mock evaluation: Scores: {'faithfulness': 0.92, 'answer_relevancy': 0.88, 'context_recall': 0.95}")

if __name__ == "__main__":
    run_evaluation()
