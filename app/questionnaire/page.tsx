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
import { Card, CardContent } from "@/components/ui/card"

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

  const renderStep = () => {
    switch (data.currentStep) {
      case 0:
        return (
          <div className="min-h-screen bg-cream flex items-center justify-center py-12">
            <div className="container-content text-center space-y-8">
              <div className="space-y-4">
                <h1 className="font-merriweather text-heading-xl text-primary font-bold">BSHAPE</h1>
                <p className="font-montserrat text-body-lg text-gray-700 font-medium">
                  Being Safe, Healthy and Positively Empowered
                </p>
              </div>

              <div className="relative w-full max-w-md mx-auto h-64">
                <Image
                  src="/images/bshape-logo.jpg"
                  alt="BSHAPE Logo"
                  fill
                  className="object-contain rounded-lg shadow-md"
                  priority
                />
              </div>

              <div className="space-y-6">
                <h2 className="font-merriweather text-heading-lg text-primary font-bold">Welcome to BSHAPE!</h2>
                <p className="font-montserrat text-body-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                  Everyone deserves to be healthy and safe in their relationships. BSHAPE is here to help you assess
                  your well-being, explore safety strategies, and connect with resources that can support you.
                </p>
              </div>

              <div className="pt-6">
                <Button onClick={handleNext} className="btn-primary px-12 py-4 text-lg font-semibold mx-auto">
                  Continue →
                </Button>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="container-content text-center space-y-8 py-12">
            <div className="relative w-full max-w-md mx-auto h-64">
              <Image src="/images/tree-illustration.jpg" alt="Tree illustration" fill className="object-contain" />
            </div>
            <div className="space-y-6">
              <h2 className="font-merriweather text-heading-lg text-primary font-bold">Recognizing Your Strengths</h2>
              <div className="space-y-4 max-w-3xl mx-auto">
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
        )

      case 2:
        return (
          <div className="container-content text-center space-y-8 py-12">
            <div className="relative w-full max-w-md mx-auto h-64">
              <Image src="/images/woman-speaking.jpg" alt="Woman speaking" fill className="object-contain" />
            </div>
            <div className="space-y-6">
              <h2 className="font-merriweather text-heading-lg text-primary font-bold">Personalized Help for You</h2>
              <p className="font-montserrat text-body-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                In the next sections, I'll help you reflect on your relationships and support you on your path to
                health, safety, and well-being.
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="container-content space-y-8 py-12">
            <div className="text-center space-y-6">
              <h2 className="font-merriweather text-heading-lg text-primary font-bold">
                Which relationship(s) are you concerned about?
              </h2>
              <div className="space-y-2">
                <p className="font-montserrat text-body-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  Let's start by talking about your relationships. Everyone's situation is different, and understanding
                  your concerns is the first step toward finding the right support.
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
        )

      case 4:
        return (
          <div className="container-content space-y-8 py-12">
            <div className="text-center space-y-6">
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
        )

      case 5:
        return (
          <div className="container-content space-y-8 py-12">
            <div className="text-center space-y-6">
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
        )

      case 6:
        return (
          <div className="container-content text-center space-y-8 py-12">
            <div className="space-y-6">
              <h2 className="font-merriweather text-heading-lg text-primary font-bold">Relationship Warning Signs</h2>
              <div className="relative w-32 h-32 mx-auto">
                <Image src="/images/red-flag.jpg" alt="Red flag warning" fill className="object-contain" />
              </div>
            </div>

            <div className="text-left max-w-4xl mx-auto space-y-6">
              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-button">
                <h3 className="font-merriweather text-xl font-bold text-primary mb-3">Your well-being matters!</h3>
                <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
                  Unhealthy relationships can take a toll on your health and happiness. We're here to offer strategies
                  and resources to help you stay safe and supported.
                </p>
              </div>

              <div className="space-y-4">
                <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
                  When people hear the word "abuse", they often think of physical violence, like hitting. But abuse can
                  take many forms—emotional, verbal, financial, and more.
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
        )

      default:
        // Handle questionnaire sections and results
        const hasPartner = data.relationshipConcerns.some(
          (concern) => concern.includes("husband") || concern.includes("partner"),
        )
        const hasInLaws = data.relationshipConcerns.includes("My in-laws")
        const hasFamily =
          data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

        let stepOffset = 7

        // Partner questionnaire intro
        if (hasPartner && data.currentStep === stepOffset) {
          return (
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">About your Husband or Partner</h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  Every woman's situation is unique. These following questions will help me better understand what
                  you're going through. The more you share, the more personalized support I can offer.
                </p>
                <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  Several risk factors have been associated with increased risk of severe violence injuries or homicides
                  of immigrant women in violent relationships.
                </p>
                <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  We cannot predict what will happen in your case, but we would like you to be aware of the danger of
                  homicide in situations of abuse and for you to see how many of the risk factors apply to your
                  situation.
                </p>
                <p className="text-base font-semibold text-gray-900">
                  The following questions were designed by experts to help identify unhealthy patterns. Please answer
                  "Yes" or "No."
                </p>
              </div>
            </div>
          )
        }

        stepOffset += hasPartner ? 1 : 0

        // Partner questions
        if (hasPartner && data.currentStep >= stepOffset && data.currentStep < stepOffset + partnerQuestions.length) {
          const questionIndex = data.currentStep - stepOffset
          const question = partnerQuestions[questionIndex]
          const answer = data.partnerQuestions[question.id]
          const subAnswer = question.subQuestion ? data.partnerQuestions[question.subQuestion.id] : undefined

          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                  About your Husband or Partner
                  {questionIndex >= 8 && " (Continuation)"}
                </h2>
              </div>

              <QuestionCard
                question={question}
                answer={answer}
                onAnswer={handleAnswer}
                showSubQuestion={question.subQuestion && answer === true}
                subAnswer={subAnswer}
                onSubAnswer={handleSubAnswer}
              />
            </div>
          )
        }

        stepOffset += hasPartner ? partnerQuestions.length : 0

        // Partner results
        if (hasPartner && data.currentStep === stepOffset) {
          if (!data.results.partner) {
            calculateResults()
            return <div>Calculating results...</div>
          }

          const riskLevel = data.results.partner
          const riskImages = {
            variable: "/images/stay-alert.jpg",
            moderate: "/images/be-alert.jpg",
            high: "/images/dont-wait.jpg",
            extreme: "/images/seek-immediately.jpg",
          }

          const riskTitles = {
            variable: "Variable Risk",
            moderate: "Moderate Risk",
            high: "High Risk",
            extreme: "Extreme Risk",
          }

          const riskSubtitles = {
            variable: "Stay Alert",
            moderate: "Be Alert and Plan for Your Safety",
            high: "Don't Wait, Seek Support",
            extreme: "Seek Support Immediately",
          }

          const riskDescriptions = {
            variable: "You may not be in immediate danger, but it's important to stay alert",
            moderate: "Your safety may be at a greater risk",
            high: "You may be in serious danger",
            extreme: "You may be in immediate and extreme danger",
          }

          const riskActions = {
            variable: [
              "Know that risks can change quickly, even if things seem calm right now.",
              "Trust your instincts — if something feels off, it probably is.",
              "Stay connected to your support system and keep watching for any warning signs.",
              "Create or review a safety plan and check in regularly with someone you trust.",
            ],
            moderate: [
              "Please pay close attention to any signs that things are escalating.",
              "This is a time to increase your safety planning and be more cautious.",
              "Talk to a trusted advocate or professional.",
              "Keep a record of concerning behavior and have a plan for where to go and who to call if you need help quickly.",
            ],
            high: [
              "We strongly encourage you to work closely with professionals to create a detailed safety plan.",
              "You may need immediate protection. Support from the courts, law enforcement, or other agencies could be critical.",
              "Please don't wait—your safety is urgent.",
            ],
            extreme: [
              "We need to act now to protect you.",
              "This may involve calling emergency services or getting immediate legal or professional help.",
              "The situation is very serious, and your safety is the top priority.",
              "Any support available — including strict legal measures — should be used.",
            ],
          }

          return (
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  Thank you for taking the time to complete this questionnaire. By doing so, you're already taking an
                  important step toward caring for your safety and well-being.
                </p>
                <p className="text-base text-gray-600 max-w-3xl mx-auto">
                  On the next page, you'll see results based on your responses. These insights are meant to help you
                  better understand your situation and explore your options.
                </p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="relative w-full max-w-sm mx-auto h-32">
                      <Image
                        src={riskImages[riskLevel] || "/placeholder.svg"}
                        alt={`${riskLevel} risk level`}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-lg text-gray-700">Based on your answers, you scored:</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{riskTitles[riskLevel]}</h3>
                      <p className="text-lg font-semibold text-orange-600">{riskSubtitles[riskLevel]}</p>
                    </div>

                    <div className="text-left space-y-4">
                      <p className="text-base text-gray-700 font-medium">{riskDescriptions[riskLevel]}</p>

                      <div>
                        <h4 className="text-base font-semibold text-gray-900 mb-3">What you can do:</h4>
                        <ul className="space-y-2">
                          {riskActions[riskLevel].map((action, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="text-orange-500 mr-2">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        }

        stepOffset += hasPartner ? 1 : 0

        // Similar logic for in-laws and family questionnaires...
        // (Implementation continues with similar patterns for in-laws and family sections)

        // Summary page
        const totalSteps = getTotalSteps()
        if (data.currentStep === totalSteps - 1) {
          return (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Summary of Your Risk Assessment</h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  Below are the current risk assessments for the relationships you've expressed concerns about.
                </p>
              </div>

              <div className="space-y-4 max-w-2xl mx-auto">
                {data.results.partner && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Husband or partner:</h3>
                      <p className="text-base text-gray-700">
                        Based on your responses, you may be at: <strong>{data.results.partner} Risk</strong>
                      </p>
                    </CardContent>
                  </Card>
                )}

                {data.results.inLaws && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">In-laws:</h3>
                      <p className="text-base text-gray-700">
                        Based on your responses, you may be at:{" "}
                        <strong>{data.results.inLaws === "some" ? "Some Level of" : "High"} Risk</strong>
                      </p>
                    </CardContent>
                  </Card>
                )}

                {data.results.family && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Other Family Members:</h3>
                      <p className="text-base text-gray-700">
                        Based on your responses, you may be at:{" "}
                        <strong>{data.results.family === "some" ? "Some Level of" : "High"} Risk</strong>
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="text-center space-y-6">
                <div className="relative w-full max-w-md mx-auto h-48">
                  <Image
                    src="/images/women-support.jpg"
                    alt="Women supporting each other"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                    These results reflect where you are now, but your story is still unfolding. Recognizing where you
                    are today is progress towards where you want to be.
                  </p>
                  <p className="text-base text-gray-700 max-w-2xl mx-auto">
                    You are the expert on your life, and we're here to walk with you. If you're ready to create a
                    personalized safety plan, click below and the BSHAPE team will guide you through it.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
                  >
                    {isSubmitting ? "Submitting..." : "Create my Safety Plan →"}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-base font-semibold text-gray-900">You are not alone, we are here for you</p>
                    <p className="text-sm text-gray-600">
                      You can contact us at{" "}
                      <a href="mailto:bshape@jhu.edu" className="text-orange-600 hover:underline">
                        bshape@jhu.edu
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        return <div className="container-content py-12">Step not implemented yet</div>
    }
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
            data.livingChangeDescription)
        )
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {data.currentStep > 0 && <ProgressBar currentStep={data.currentStep + 1} totalSteps={getTotalSteps()} />}

      <div className="min-h-screen flex flex-col">
        <div className="flex-1">{renderStep()}</div>

        {data.currentStep > 0 && (
          <div className="container-content">
            <NavigationButtons
              onBack={data.currentStep > 0 ? handleBack : undefined}
              onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
              showBack={data.currentStep > 0}
              showNext={data.currentStep < getTotalSteps() - 1}
              nextDisabled={!canProceed()}
            />
          </div>
        )}
      </div>
    </div>
  )
}
