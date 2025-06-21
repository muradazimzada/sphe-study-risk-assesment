"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { QuestionnaireData } from "@/lib/types"
import {
  relationshipConcernOptions,
  livingWithOptions,
  partnerQuestions,
  inLawsQuestions,
  familyQuestions,
} from "@/lib/questions"
import { calculatePartnerScore, getPartnerRiskLevel, getInLawsRiskLevel, getFamilyRiskLevel } from "@/lib/scoring"
import { saveToLocalStorage, loadFromLocalStorage, initializeQuestionnaire, clearLocalStorage } from "@/lib/storage"
import QuestionCard from "@/components/QuestionCard"
import NavigationButtons from "@/components/NavigationButtons"
import ProgressBar from "@/components/ProgressBar"
import { Button } from "@/components/ui/button"

export default function QuestionnairePage() {
  const [data, setData] = useState<QuestionnaireData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const stored = loadFromLocalStorage()
    if (stored) {
      setData(stored)
    } else {
      setData(initializeQuestionnaire())
    }
  }, [])

  const updateData = (updates: Partial<QuestionnaireData>) => {
    if (!data) return

    const newData = { ...data, ...updates }
    setData(newData)
    saveToLocalStorage(newData)
  }

  const handleAnswer = (questionId: string, answer: boolean | string | string[]) => {
    if (!data) return

    const currentSection = getCurrentSection()
    const sectionKey = getSectionKey()

    updateData({
      [sectionKey]: {
        ...data[sectionKey as keyof QuestionnaireData],
        [questionId]: answer,
      },
    })
  }

  const handleSubAnswer = (subQuestionId: string, answer: boolean | string) => {
    if (!data) return

    const sectionKey = getSectionKey()

    updateData({
      [sectionKey]: {
        ...data[sectionKey as keyof QuestionnaireData],
        [subQuestionId]: answer,
      },
    })
  }

  const getCurrentSection = () => {
    if (!data) return []

    if (data.currentStep <= 6) return []

    const hasPartner = data.relationshipConcerns.some(
      (concern) => concern.includes("husband") || concern.includes("partner"),
    )
    const hasInLaws = data.relationshipConcerns.includes("My in-laws")
    const hasFamily =
      data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

    if (data.currentStep <= 6 + (hasPartner ? partnerQuestions.length : 0)) {
      return partnerQuestions
    } else if (
      data.currentStep <=
      6 + (hasPartner ? partnerQuestions.length : 0) + (hasInLaws ? inLawsQuestions.length : 0)
    ) {
      return inLawsQuestions
    } else {
      return familyQuestions
    }
  }

  const getSectionKey = (): string => {
    if (!data) return ""

    const hasPartner = data.relationshipConcerns.some(
      (concern) => concern.includes("husband") || concern.includes("partner"),
    )
    const hasInLaws = data.relationshipConcerns.includes("My in-laws")

    if (data.currentStep <= 6 + (hasPartner ? partnerQuestions.length : 0)) {
      return "partnerQuestions"
    } else if (
      data.currentStep <=
      6 + (hasPartner ? partnerQuestions.length : 0) + (hasInLaws ? inLawsQuestions.length : 0)
    ) {
      return "inLawsQuestions"
    } else {
      return "familyQuestions"
    }
  }

  const getTotalSteps = () => {
    if (!data) return 10

    let steps = 7 // Initial steps

    const hasPartner = data.relationshipConcerns.some(
      (concern) => concern.includes("husband") || concern.includes("partner"),
    )
    const hasInLaws = data.relationshipConcerns.includes("My in-laws")
    const hasFamily =
      data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

    if (hasPartner) steps += partnerQuestions.length + 2
    if (hasInLaws) steps += inLawsQuestions.length + 2
    if (hasFamily) steps += familyQuestions.length + 2

    steps += 1

    return steps
  }

  const handleNext = () => {
    if (!data) return

    const newStep = data.currentStep + 1
    updateData({ currentStep: newStep })
  }

  const handleBack = () => {
    if (!data) return

    const newStep = Math.max(0, data.currentStep - 1)
    updateData({ currentStep: newStep })
  }

  const calculateResults = () => {
    if (!data) return

    const results: any = {}
    const scores: any = {}

    if (data.relationshipConcerns.some((concern) => concern.includes("husband") || concern.includes("partner"))) {
      const partnerScore = calculatePartnerScore(data.partnerQuestions)
      scores.partner = partnerScore
      results.partner = getPartnerRiskLevel(partnerScore)
    }

    if (data.relationshipConcerns.includes("My in-laws")) {
      results.inLaws = getInLawsRiskLevel(data.inLawsQuestions)
      scores.inLaws = results.inLaws
    }

    if (data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")) {
      results.family = getFamilyRiskLevel(data.familyQuestions)
      scores.family = results.family
    }

    updateData({ results, scores })
  }

  const handleSubmit = async () => {
    if (!data) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submit-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          completedAt: new Date(),
        }),
      })

      if (response.ok) {
        clearLocalStorage()
        alert("Assessment submitted successfully!")
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      console.error("Error submitting assessment:", error)
      alert("Error submitting assessment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-cream flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-button mx-auto"></div>
          <p className="mt-4 text-gray-600 font-montserrat">Loading BSHAPE Assessment...</p>
        </div>
      </div>
    )
  }

  const canProceed = () => {
    switch (data.currentStep) {
      case 3:
        return data.relationshipConcerns.length > 0
      case 4:
        return data.livingWith !== ""
      case 5:
        return (
          data.livingPreference !== "" &&
          (data.livingPreference !== "No, I would prefer a change in my living situation" ||
            (data.livingChangeDescription && data.livingChangeDescription.trim().length > 0))
        )
      default:
        // For questionnaire sections, check if current question is answered
        const currentSection = getCurrentSection()
        const sectionKey = getSectionKey()

        if (currentSection.length > 0) {
          const hasPartner = data.relationshipConcerns.some(
            (concern) => concern.includes("husband") || concern.includes("partner"),
          )
          const hasInLaws = data.relationshipConcerns.includes("My in-laws")

          let stepOffset = 7
          if (hasPartner) stepOffset += 1 // intro

          if (hasPartner && data.currentStep >= stepOffset && data.currentStep < stepOffset + partnerQuestions.length) {
            const questionIndex = data.currentStep - stepOffset
            const question = partnerQuestions[questionIndex]
            const answer = data.partnerQuestions[question.id]

            // Check if main question is answered
            if (answer === undefined || answer === "") return false

            // Check sub-question if applicable
            if (question.subQuestion && answer === true) {
              const subAnswer = data.partnerQuestions[question.subQuestion.id]
              return subAnswer !== undefined && subAnswer !== ""
            }

            return true
          }

          // Similar validation for other questionnaire sections...
        }

        return true
    }
  }

  const renderStep = () => {
    switch (data.currentStep) {
      case 0:
        return (
          <div className="min-h-screen bg-cream flex items-center justify-center py-8">
            <div className="container-content text-center space-y-6">
              <div className="space-y-3">
                <h1 className="font-merriweather text-heading-xl text-primary font-bold">BSHAPE</h1>
                <p className="font-montserrat text-body-lg text-gray-700 font-medium">
                  Being Safe, Healthy and Positively Empowered
                </p>
              </div>

              <div className="relative w-full max-w-sm mx-auto h-48">
                <Image
                  src="/images/bshape-logo.jpg"
                  alt="BSHAPE Logo"
                  fill
                  className="object-contain rounded-lg shadow-md"
                  priority
                />
              </div>

              <div className="space-y-4">
                <h2 className="font-merriweather text-heading-lg text-primary font-bold">Welcome to BSHAPE!</h2>
                <p className="font-montserrat text-body-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                  Everyone deserves to be healthy and safe in their relationships. BSHAPE is here to help you assess
                  your well-being, explore safety strategies, and connect with resources that can support you.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleNext}
                  className="btn-primary px-12 py-4 text-lg font-semibold mx-auto rounded-full"
                >
                  Continue →
                </Button>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="min-h-screen bg-cream py-8 pb-24">
            <div className="container-content text-center space-y-6">
              <div className="relative w-full max-w-sm mx-auto h-48">
                <Image src="/images/tree-illustration.jpg" alt="Tree illustration" fill className="object-contain" />
              </div>
              <div className="space-y-4">
                <h2 className="font-merriweather text-heading-lg text-primary font-bold">Recognizing Your Strengths</h2>
                <div className="space-y-3 max-w-3xl mx-auto">
                  <p className="font-montserrat text-body-lg text-gray-700 leading-relaxed">
                    Acknowledging your abilities and support systems can help you make informed decisions about your
                    safety and well-being. Let's take a moment to focus on what makes you unique and resilient.
                  </p>
                  <p className="font-montserrat text-body-md text-gray-600 leading-relaxed">
                    Everyone has strengths—qualities that help them overcome challenges and thrive. This conversation is
                    about recognizing those strengths and how they contribute to your overall health, safety, and
                    well-being.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="min-h-screen bg-cream py-8 pb-24">
            <div className="container-content text-center space-y-6">
              <div className="relative w-full max-w-sm mx-auto h-48">
                <Image src="/images/woman-speaking.jpg" alt="Woman speaking" fill className="object-contain" />
              </div>
              <div className="space-y-4">
                <h2 className="font-merriweather text-heading-lg text-primary font-bold">Personalized Help for You</h2>
                <p className="font-montserrat text-body-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                  In the next sections, I'll help you reflect on your relationships and support you on your path to
                  health, safety, and well-being.
                </p>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="min-h-screen bg-cream py-8 pb-24">
            <div className="container-content space-y-6">
              <div className="text-center space-y-4">
                <h2 className="font-merriweather text-heading-lg text-primary font-bold">
                  Which relationship(s) are you concerned about?
                </h2>
                <div className="space-y-2">
                  <p className="font-montserrat text-body-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    Let's start by talking about your relationships. Everyone's situation is different, and
                    understanding your concerns is the first step toward finding the right support.
                  </p>
                  <p className="font-montserrat text-body-md text-gray-600">(Select all that apply)</p>
                </div>
              </div>

              <QuestionCard
                question={{
                  id: "relationship-concerns",
                  text: "",
                  type: "checkbox",
                  options: relationshipConcernOptions,
                }}
                answer={data.relationshipConcerns}
                onAnswer={(_, answer) => updateData({ relationshipConcerns: answer as string[] })}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="min-h-screen bg-cream py-8 pb-24">
            <div className="container-content space-y-6">
              <div className="text-center space-y-4">
                <h2 className="font-merriweather text-heading-lg text-primary font-bold">Who do you live with?</h2>
                <p className="font-montserrat text-body-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                  Next, understanding your living situation can help us better understand your circumstances.
                </p>
              </div>

              <QuestionCard
                question={{
                  id: "living-with",
                  text: "",
                  type: "radio",
                  options: livingWithOptions,
                }}
                answer={data.livingWith}
                onAnswer={(_, answer) => updateData({ livingWith: answer as string })}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="min-h-screen bg-cream py-8 pb-24">
            <div className="container-content space-y-6">
              <div className="text-center space-y-4">
                <h2 className="font-merriweather text-heading-md text-primary font-bold">
                  Would you like to continue living with the people you're currently living with?
                </h2>
                <p className="font-montserrat text-body-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  Let's explore your thoughts about your current living situation.
                  {data.livingWith === "I live alone" &&
                    " Or, if you're living alone, would you like to continue living alone?"}
                </p>
              </div>

              <QuestionCard
                question={{
                  id: "living-preference",
                  text: "",
                  type: "radio",
                  options: [
                    "Yes, I would like to continue living with people in my household or to continue living alone",
                    "No, I would prefer a change in my living situation",
                  ],
                }}
                answer={data.livingPreference}
                onAnswer={(_, answer) => updateData({ livingPreference: answer as string })}
              />

              {data.livingPreference === "No, I would prefer a change in my living situation" && (
                <div className="mt-8">
                  <QuestionCard
                    question={{
                      id: "living-change-description",
                      text: "Please describe how you would like to change your living situation:",
                      type: "text",
                    }}
                    answer={data.livingChangeDescription || ""}
                    onAnswer={(_, answer) => updateData({ livingChangeDescription: answer as string })}
                  />
                </div>
              )}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="min-h-screen bg-cream py-8 pb-24">
            <div className="container-content text-center space-y-6">
              <div className="space-y-4">
                <h2 className="font-merriweather text-heading-lg text-primary font-bold">Relationship Warning Signs</h2>
                <div className="relative w-32 h-32 mx-auto">
                  <Image src="/images/red-flag.jpg" alt="Red flag warning" fill className="object-contain" />
                </div>
              </div>

              <div className="text-left max-w-4xl mx-auto space-y-4">
                <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-button">
                  <h3 className="font-merriweather text-xl font-bold text-primary mb-3">Your well-being matters!</h3>
                  <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
                    Unhealthy relationships can take a toll on your health and happiness. We're here to offer strategies
                    and resources to help you stay safe and supported.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
                    When people hear the word "abuse", they often think of physical violence, like hitting. But abuse
                    can take many forms—emotional, verbal, financial, and more.
                  </p>
                  <p className="font-montserrat text-body-md text-red-600 font-semibold">
                    No matter the form, abuse is never okay.
                  </p>
                  <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
                    It can be difficult to recognize and even harder to deal with, but you don't have to go through it
                    alone.
                  </p>

                  <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
                    <p className="font-montserrat text-body-md text-green-700 font-semibold leading-relaxed">
                      A healthy relationship should make you feel respected, valued, and good about yourself—you deserve
                      that!
                    </p>
                  </div>

                  <div className="text-center pt-4">
                    <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
                      Now, let's take a moment to check-in.
                    </p>
                    <p className="font-merriweather text-lg font-semibold text-primary mt-2">
                      Are you noticing any red flags or warning signs in your relationship?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="min-h-screen bg-cream py-8 pb-24">
            <div className="container-content">Step not implemented yet</div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {data.currentStep > 0 && <ProgressBar currentStep={data.currentStep + 1} totalSteps={getTotalSteps()} />}

      <div className="min-h-screen">{renderStep()}</div>

      {data.currentStep > 0 && (
        <NavigationButtons
          onBack={data.currentStep > 0 ? handleBack : undefined}
          onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
          showBack={data.currentStep > 0}
          showNext={data.currentStep < getTotalSteps() - 1}
          nextDisabled={!canProceed()}
        />
      )}
    </div>
  )
}
