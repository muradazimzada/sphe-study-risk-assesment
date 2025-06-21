import type { QuestionnaireData } from "./types"

const STORAGE_KEY = "bshape_questionnaire_data"

export function saveToLocalStorage(data: QuestionnaireData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

export function loadFromLocalStorage(): QuestionnaireData | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error("Error parsing stored data:", error)
        return null
      }
    }
  }
  return null
}

export function clearLocalStorage(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function initializeQuestionnaire(): QuestionnaireData {
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const initialData: QuestionnaireData = {
    userId,
    currentStep: 0,
    relationshipConcerns: [],
    livingWith: "",
    livingPreference: "",
    partnerQuestions: {},
    inLawsQuestions: {},
    familyQuestions: {},
    scores: {},
    results: {},
  }

  saveToLocalStorage(initialData)
  return initialData
}
