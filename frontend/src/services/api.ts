import axios from 'axios';
import type { QuestionRequest, QuestionResponse } from '../types';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export const api = {
  async askQuestion(payload: QuestionRequest): Promise<QuestionResponse> {
    const res = await axios.post<QuestionResponse>(`${API_BASE}/qa/ask`, payload);
    return res.data;
  }
};