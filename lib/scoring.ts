export function calculatePartnerScore(answers: Record<string, boolean | string>): number {
  let score = 0

  // 1 Point for each "Yes" to questions 2, 7-24 (Except 14a)
  const onePointQuestions = [
    "2",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
  ]
  onePointQuestions.forEach((q) => {
    if (answers[q] === true) score += 1
  })

  // 2 Points for each "Yes" to questions 1, 6 & 14a
  const twoPointQuestions = ["1", "6", "14a"]
  twoPointQuestions.forEach((q) => {
    if (answers[q] === true) score += 2
  })

  // 3 Points for each "Yes" to questions 3-5
  const threePointQuestions = ["3", "4", "5"]
  threePointQuestions.forEach((q) => {
    if (answers[q] === true) score += 3
  })

  // 4 Points if "No" to question 25
  if (answers["25"] === false) score += 4

  // 5 Points if "No" to question 26
  if (answers["26"] === false) score += 5

  return score
}

export function getPartnerRiskLevel(score: number): "variable" | "moderate" | "high" | "extreme" {
  if (score <= 14) return "variable"
  if (score <= 25) return "moderate"
  if (score <= 35) return "high"
  return "extreme"
}

export function getInLawsRiskLevel(answers: Record<string, boolean | string>): "some" | "high" {
  const criticalQuestions = ["1", "2", "5", "9"]
  const hasHighRiskAnswer = criticalQuestions.some((q) => answers[q] === true)
  return hasHighRiskAnswer ? "high" : "some"
}

export function getFamilyRiskLevel(answers: Record<string, boolean | string>): "some" | "high" {
  const criticalQuestions = ["1", "2", "5", "9"]
  const hasHighRiskAnswer = criticalQuestions.some((q) => answers[q] === true)
  return hasHighRiskAnswer ? "high" : "some"
}
