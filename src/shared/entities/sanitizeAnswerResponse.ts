import { Answer } from '../../components/answer/answer.entity.js';
import { sanitizeWizardResponse } from './sanitizeWizardResponse.js';
import { sanitizeWandResponse } from './sanitizeWandResponse.js';

export function sanitizeAnswerResponse(answer: Answer | null) {
  if (!answer) return answer;
  const obj = { ...answer };
  obj.wizard = sanitizeWizardResponse(answer.wizard);
  obj.wand = sanitizeWandResponse(answer.wand);
  return obj;
}

export function sanitizeAnswerResponseArray(answers: Answer[]) {
  return answers.map(sanitizeAnswerResponse);
}
