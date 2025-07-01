
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
    // "11a",
    "12",
    "13",
    "14",

    "15",
    "16",
    // "16a",
    "17",
    "18",
    "19",
    "20",
    "20a",
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
  // 2 point substract if 6a is true
  if (answers["6a"] === true) score -= 2

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

export function getPartnerRiskLevel(score: number): "variable" | "increased" | "severe" | "extreme" {
  if (score <= 14) return "variable"
  if (score >= 15 && score <= 25) return "increased"
  if (score <= 35) return "severe"
  return "extreme"
}

export function getInLawsRiskLevel(answers: Record<string, boolean | string>): "some" | "high" {
  // Critical questions that determine high risk
  const criticalQuestions = ["1", "2", "5", "9"]
  const hasHighRiskAnswer = criticalQuestions.some((q) => answers[q] === true)
  return hasHighRiskAnswer ? "high" : "some"
}

export function getFamilyRiskLevel(answers: Record<string, boolean | string>): "some" | "high" {
  // Critical questions that determine high risk
  const criticalQuestions = ["1", "2", "5", "9"]
  const hasHighRiskAnswer = criticalQuestions.some((q) => answers[q] === true)
  return hasHighRiskAnswer ? "high" : "some"
}

import { log } from "console"
import { partnerQuestions, inLawsQuestions, familyQuestions } from "./questions"

type QuestionSet = typeof partnerQuestions

const scoreConfig: Record<string, number> = {
  // partner scores
  "1": 2,
  "2": 1,
  "3": 3,
  "4": 3,
  "5": 3,
  "6": 2,
  "6a": -2,
  "7": 1,
  "8": 1,
  "9": 1,
  "10": 1,
  "11": 1,
  "11a": 0,
  "12": 1,
  "13": 1,
  "14": 1,
  "14a": 2,
  "15": 1,
  "16": 1,
  "16a": 0,
  "17": 1,
  "18": 1,
  "19": 1,
  "20": 1,
  "20a": 1,
  "21": 1,
  "22": 1,
  "23": 1,
  "24": 1,
  "25": 4, // if false
  "26": 5, // if false
  "27": 0, // ignored
}

function calculateScoreFromQuestions(questions: QuestionSet, answers: Record<string, boolean | string>) {
  let total = 0
  const detailed: Record<
    string,
    {
      question: string
      answer: boolean | string | undefined
      score: number
      maxScore: number
    }
  > = {}

  for (const q of questions) {
    const qid = q.id
    const ans = answers[qid]
    const max = scoreConfig[qid] ?? 0
    let score = 0
    console.log("Processing question:", qid, "Answer:", ans)
    if (qid === "25" && ans === false) score = 4
    else if (qid === "26" && ans === false) score = 5
    else if (
      typeof ans === "boolean" &&
      ans === true &&
      qid !== "25" &&                      // ⬅️ guard
      qid !== "26"
    ) {
      score = scoreConfig[qid] ?? 0;
    }

    console.log("Score for question", qid, "is", score)
    total += score

    detailed[qid] = { question: q.text, answer: ans, score, maxScore: max }

    if (q.subQuestion) {
      const sub = q.subQuestion
      const subAns = answers[sub.id]
      const subMax = scoreConfig[sub.id] ?? 0
      let subScore = 0

      if (typeof subAns === "boolean" && subAns === true) {
        subScore = scoreConfig[sub.id] ?? 0
        total += subScore
      }

      detailed[sub.id] = {
        question: sub.text,
        answer: subAns,
        score: subScore,
        maxScore: subMax,
      }
    }
  }

  return {
    totalScore: total,
    questions: detailed,
  }
}

export function calculatePartnerScoreWithBreakdown(answers: Record<string, boolean | string>) {
  return calculateScoreFromQuestions(partnerQuestions, answers)
}

export function calculateInLawsScoreWithBreakdown(answers: Record<string, boolean | string>) {
  return calculateScoreFromQuestions(inLawsQuestions, answers)
}

export function calculateFamilyScoreWithBreakdown(answers: Record<string, boolean | string>) {
  return calculateScoreFromQuestions(familyQuestions, answers)
}
