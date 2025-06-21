export interface QuestionnaireData {
  userId: string
  currentStep: number
  relationshipConcerns: string[]
  livingWith: string
  livingPreference: string
  livingChangeDescription?: string
  partnerQuestions: Record<string, boolean | string>
  inLawsQuestions: Record<string, boolean | string>
  familyQuestions: Record<string, boolean | string>
  scores: {
    partner?: number
    inLaws?: "some" | "high"
    family?: "some" | "high"
  }
  results: {
    partner?: "variable" | "moderate" | "high" | "extreme"
    inLaws?: "some" | "high"
    family?: "some" | "high"
  }
  completedAt?: Date
}

export interface Question {
  id: string
  text: string
  type: "yes-no" | "checkbox" | "radio" | "text"
  options?: string[]
  required?: boolean
  subQuestion?: {
    id: string
    text: string
    condition: string
  }
}
