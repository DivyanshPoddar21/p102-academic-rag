export interface Citation {
  source: string;
  page_number: number;
  score: number;
}

export interface QuestionRequest {
  question: string;
  top_k: number;
  confidence_threshold: number;
}

export interface QuestionResponse {
  answer: string;
  citations: Citation[];
  confidence_score: number;
  gated: boolean;
  model: string;
}