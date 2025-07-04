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
    partner?: "variable" | "increased" | "severe" | "extreme"
    inLaws?: "some" | "high"
    family?: "some" | "high"
  }
  completedAt?: Date
}

// export interface Question {
//   id: string
//   text: string
//   type: "yes-no" | "checkbox" | "radio" | "text"
//   options?: string[]
//   required?: boolean
//   subQuestion?: {
//     id: string
//     text: string
//     condition: "yes" | "no" | "yes_no"
//     type?: "yes-no" | "checkbox" | "radio" | "text"
//   }
// }
export interface Question {
  id: string
  text: string
  type: 'yes-no' | 'checkbox' | 'radio' | 'text'
  options?: string[]          // optional, even for checkbox
  subQuestion?: Question & {  // let a subQuestion be any Question
    condition: 'yes' | 'no' | 'yes_no'
  }
}
