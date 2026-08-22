import { analyzeQuestion as analyzeFromAPI } from "./api";

export async function analyzeQuestion(question) {
  return analyzeFromAPI(question);
}