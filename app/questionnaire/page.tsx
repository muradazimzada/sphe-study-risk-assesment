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
import {
  getPartnerRiskLevel,
  getInLawsRiskLevel,
  getFamilyRiskLevel,
  calculatePartnerScoreWithBreakdown,
  calculateInLawsScoreWithBreakdown,
  calculateFamilyScoreWithBreakdown,
} from "@/lib/scoring"
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
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // call submitAnswer when user is done with questions using use effect

  useEffect(() => {
    if (data && data.currentStep === getTotalSteps() - 1 && !hasSubmitted) {
      // log
      console.log("Submitting questionnaire data:", data)
      setIsSubmitting(true)
      handleSubmit()
    }
  }, [data, hasSubmitted])


  // Remove the problematic useEffect that was causing repeated submissions
  useEffect(() => {
    // log
    console.log("Current step changed:", data?.currentStep)
    console.log("scrollingg")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [data?.currentStep])

  useEffect(() => {
    const stored = loadFromLocalStorage()
    if (stored) {
      setData(stored)
    } else {
      setData(initializeQuestionnaire())
    }
  }, [])
  const updateData = (updates: Partial<QuestionnaireData>) => {
    if (!data) return;

    // ── merge the incoming patch ─────────────────────────────
    const merged: QuestionnaireData = {
      ...data,
      ...updates,
    };

    // ── figure out which section’s answers changed ───────────
    const touched = Object.keys(updates);

    if (touched.includes("partnerQuestions")) {
      delete merged.results?.partner;
      delete merged.scores?.partner;
    }
    if (touched.includes("inLawsQuestions")) {
      delete merged.results?.inLaws;
      delete merged.scores?.inLaws;
    }
    if (touched.includes("familyQuestions")) {
      delete merged.results?.family;
      delete merged.scores?.family;
    }

    setData(merged);
    saveToLocalStorage(merged);
  };

  const handleAnswer = (
    questionId: string,
    answer: boolean | string | string[]
  ) => {

    // calling handle
    // log
    console.log("Handling answer for question:", questionId, "with answer:", answer);
    console.log("Current data before update:", data);
    if (!data) return;

    const sectionKey = getSectionKey();

    console.log("Current section key:s", sectionKey);
    if (!sectionKey) return;

    updateData({
      // @ts-ignore – index signature is fine
      [sectionKey]: {
        ...(data[sectionKey as keyof QuestionnaireData] as object),
        [questionId]: answer,
      },
    });
  };


  const handleSubAnswer = (subQuestionId: string, answer: boolean | string) => {
    if (!data) return
    const sectionKey = getSectionKey()
    updateData({
      [sectionKey]: {
        // @ts-ignore
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

    let stepOffset = 7

    // Partner section: intro (1) + questions (27) + results (2) = 30 steps
    if (hasPartner) {
      const partnerStart = stepOffset
      const partnerQuestionsStart = partnerStart + 1
      const partnerQuestionsEnd = partnerQuestionsStart + partnerQuestions.length

      if (data.currentStep >= partnerQuestionsStart && data.currentStep < partnerQuestionsEnd) {
        return partnerQuestions
      }
      stepOffset = partnerQuestionsEnd + 2 // +2 for results (thank & res) pages
    }

    // In-laws section: intro (1) + questions (11) + results (1) = 13 steps
    if (hasInLaws) {
      const inLawsStart = stepOffset
      const inLawsQuestionsStart = inLawsStart + 1
      const inLawsQuestionsEnd = inLawsQuestionsStart + inLawsQuestions.length

      if (data.currentStep >= inLawsQuestionsStart && data.currentStep < inLawsQuestionsEnd) {
        return inLawsQuestions
      }
      stepOffset = inLawsQuestionsEnd + 1 // +1 for results page
    }

    // Family section: intro (1) + questions (11) + results (1) = 13 steps
    if (hasFamily) {
      const familyStart = stepOffset
      const familyQuestionsStart = familyStart + 1
      const familyQuestionsEnd = familyQuestionsStart + familyQuestions.length

      if (data.currentStep >= familyQuestionsStart && data.currentStep < familyQuestionsEnd) {
        return familyQuestions
      }
    }

    return []
  }

  const getSectionKey = (): string => {
    if (!data) return ""
    if (data.currentStep <= 6) return ""

    const hasPartner = data.relationshipConcerns.some(
      (concern) => concern.includes("husband") || concern.includes("partner"),
    )
    const hasInLaws = data.relationshipConcerns.includes("My in-laws")
    const hasFamily =
      data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

    let stepOffset = 7

    // Partner section
    if (hasPartner) {
      const partnerStart = stepOffset
      const partnerQuestionsStart = partnerStart + 1
      const partnerQuestionsEnd = partnerQuestionsStart + partnerQuestions.length

      if (data.currentStep >= partnerQuestionsStart && data.currentStep < partnerQuestionsEnd) {
        return "partnerQuestions"
      }
      stepOffset = partnerQuestionsEnd + 2
    }

    // In-laws section
    if (hasInLaws) {
      const inLawsStart = stepOffset
      const inLawsQuestionsStart = inLawsStart + 1
      const inLawsQuestionsEnd = inLawsQuestionsStart + inLawsQuestions.length

      if (data.currentStep >= inLawsQuestionsStart && data.currentStep < inLawsQuestionsEnd) {
        return "inLawsQuestions"
      }
      stepOffset = inLawsQuestionsEnd + 2
    }

    // Family section
    if (hasFamily) {
      const familyStart = stepOffset
      const familyQuestionsStart = familyStart + 1
      const familyQuestionsEnd = familyQuestionsStart + familyQuestions.length
      stepOffset = familyQuestionsEnd + 2 // +2 for results (thank & res) pages

      if (data.currentStep >= familyQuestionsStart && data.currentStep < familyQuestionsEnd) {
        return "familyQuestions"
      }
    }

    return ""
  }

  const getTotalSteps = () => {
    if (!data) return 10

    let steps = 7 // Initial steps (0-6)

    const hasPartner = data.relationshipConcerns.some(
      (concern) => concern.includes("husband") || concern.includes("partner"),
    )
    const hasInLaws = data.relationshipConcerns.includes("My in-laws")
    const hasFamily =
      data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

    if (hasPartner) steps += 1 + partnerQuestions.length + 2 // intro + questions + thank & results
    if (hasInLaws) steps += 1 + inLawsQuestions.length + 2 // intro + questions + thank & results
    if (hasFamily) steps += 1 + familyQuestions.length + 2 // intro + questions + thank & results

    steps += 1 // final summary

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
      const breakdown = calculatePartnerScoreWithBreakdown(data.partnerQuestions)
      scores.partner = {
        total: breakdown.totalScore,
        questions: breakdown.questions,
      }
      results.partner = getPartnerRiskLevel(breakdown.totalScore)
    }

    if (data.relationshipConcerns.includes("My in-laws")) {
      const breakdown = calculateInLawsScoreWithBreakdown(data.inLawsQuestions)
      scores.inLaws = {
        total: breakdown.totalScore,
        questions: breakdown.questions,
      }
      results.inLaws = getInLawsRiskLevel(data.inLawsQuestions)
    }

    if (data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")) {
      const breakdown = calculateFamilyScoreWithBreakdown(data.familyQuestions)
      scores.family = {
        total: breakdown.totalScore,
        questions: breakdown.questions,
      }
      results.family = getFamilyRiskLevel(data.familyQuestions)
    }

    updateData({ results, scores })
  }

  const handleSubmit = async () => {
    if (!data || isSubmitting || hasSubmitted) return

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
        setHasSubmitted(true)
        clearLocalStorage()
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
          <div className="min-h-screen bg-cream flex items-center justify-center py-6 px-4">
            <div className="bg-white rounded-[2rem] p-10 md:p-16 shadow-lg max-w-4xl w-full">
              <div className="container-content text-center space-y-8">
                <div className="space-y-2">
                  <h1 className="font-merriweather text-heading-xl text-primary font-bold">BSHAPE</h1>
                  <p className="font-montserrat text-body-lg text-gray-700 font-medium">
                    Being Safe, Healthy and Positively Empowered
                  </p>
                </div>
                <div className="rounded-xl overflow-hidden shadow-md max-w-md mx-auto">
                  <Image
                    src="/images/bshape-logo.jpg"
                    alt="BSHAPE Logo"
                    width={350}
                    height={300}
                    className="object-cover w-full h-auto"
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
                <Button
                  onClick={handleNext}
                  className="bg-[#F28132] text-white font-semibold text-lg px-10 py-4 rounded-xl hover:brightness-105 transition"
                >
                  Continue →
                </Button>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="card-container">
            <div className="container-content text-center space-y-6 ">
              <h2 className="font-merriweather text-heading-lg text-primary font-bold">Recognizing Your Strengths</h2>
              <div className="space-y-6 max-w-3xl mx-auto text-body-lg text-gray-700 font-montserrat leading-relaxed">
                <p>
                  Acknowledging your abilities and support systems can help you make informed decisions about your
                  safety and well-being.
                </p>
                <p>Let's take a moment to focus on what makes you unique and resilient.</p>
                <p>Everyone has strengths—qualities that help them overcome challenges and thrive.</p>
              </div>
              <div className="relative w-full max-w-md mx-auto h-48">
                <Image src="/images/tree-illustration.jpg" alt="Tree illustration" fill className="object-contain" />
              </div>
              <p className="font-montserrat text-body-md text-gray-700 max-w-3xl mx-auto leading-relaxed">
                This conversation is about recognizing those strengths and how they contribute to your overall health,
                safety, and well-being.
              </p>
              <NavigationButtons
                onBack={data.currentStep > 0 ? handleBack : undefined}
                onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
                showBack={data.currentStep > 0}
                showNext={data.currentStep < getTotalSteps() - 1}
                nextDisabled={!canProceed()}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="card-container">
            <div className="container-content text-center space-y-6 ">
              <h2 className="font-merriweather text-heading-lg text-primary font-bold ">Personalized Help for You</h2>
              <p className="font-montserrat text-body-lg text-gray-700 max-w-2xl mx-auto leading-relaxed space-y-6">
                In the next sections, I'll help you reflect on your relationships and support you on your path to
                health, safety, and well-being.
              </p>
              <div className="relative max-w-3xl mx-auto flex flex-col items-center space-y-6">
                <div className="relative mx-auto w-full max-w-md h-[22rem]">
                  <Image src="/images/woman-speaking.jpg" alt="Woman speaking" fill className="object-contain" />
                </div>
              </div>
            </div>
            <NavigationButtons
              onBack={data.currentStep > 0 ? handleBack : undefined}
              onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
              showBack={data.currentStep > 0}
              showNext={data.currentStep < getTotalSteps() - 1}
              nextDisabled={!canProceed()}
            />
          </div>
        )

      case 3:
        return (
          <div className="card-container">
            <div className="container-content text-center  ">
              <div className="text-center space-y-6">
                <h2 className="font-merriweather text-heading-lg text-gray-900 font-bold">
                  Let's start by talking about your relationships.
                </h2>
                <p className="font-montserrat text-body-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  Everyone's situation is different, and understanding your concerns is the first step toward finding
                  the right support.
                </p>
                <h3 className="font-merriweather text-xl text-primary font-bold">
                  Which relationship(s) are you concerned about?
                </h3>
                <p className="font-montserrat text-body-md text-gray-700 font-medium">(Select all that apply)</p>
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
            <NavigationButtons
              onBack={data.currentStep > 0 ? handleBack : undefined}
              onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
              showBack={data.currentStep > 0}
              showNext={data.currentStep < getTotalSteps() - 1}
              nextDisabled={!canProceed()}
            />
          </div>
        )

      case 4:
        return (
          <div className="card-container">
            <div className="container-content text-center  ">
              <div className="text-center space-y-6">
                <h2 className="font-merriweather text-heading-lg text-primary font-bold">Who do you live with?</h2>
                <p className="font-montserrat text-body-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                  Next, understanding <b>your living situation</b> can help us better understand your circumstances.
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
            <NavigationButtons
              onBack={data.currentStep > 0 ? handleBack : undefined}
              onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
              showBack={data.currentStep > 0}
              showNext={data.currentStep < getTotalSteps() - 1}
              nextDisabled={!canProceed()}
            />
          </div>
        )

      case 5:
        return (
          <div className="card-container">
            <div className="container-content space-y-8 py-12">
              <p className="font-montserrat text-body-lg text-gray-700 max-w-3xl mx-auto leading-relaxed text-center">
                Let's explore your thoughts about <b>your current living situation.</b>
                {data.livingWith === "I live alone" &&
                  " Or, if you're living alone, would you like to continue living alone?"}
              </p>
              <div className="text-center space-y-6">
                <h2 className="font-merriweather text-heading-md text-primary font-bold">
                  Would you like to continue living with the people you're currently living with?
                </h2>
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
            <NavigationButtons
              onBack={data.currentStep > 0 ? handleBack : undefined}
              onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
              showBack={data.currentStep > 0}
              showNext={data.currentStep < getTotalSteps() - 1}
              nextDisabled={!canProceed()}
            />
          </div>
        )

      case 6:
        return (
          <div className="card-container">
            <div className="container-content text-center space-y-8 py-12">
              <div className="space-y-6">
                <h2 className="font-merriweather text-heading-lg text-primary font-bold">Relationship Warning Signs</h2>
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
                    When people hear the word <b>"abuse"</b>, they often think of physical violence, like hitting. But
                    abuse <b>can take many forms</b>—emotional, verbal, financial, and more.
                  </p>
                  <p className="font-montserrat text-body-md text-red-600 font-semibold">
                    No matter the form, abuse is never okay.
                  </p>
                  <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
                    <b> It can be difficult to recognize and even harder to deal with</b>, but you don't have to go
                    through it alone.
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
                    <div className="relative w-32 h-32 mx-auto">
                      <Image src="/images/red-flag.jpg" alt="Red flag warning" fill className="object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <NavigationButtons
              onBack={data.currentStep > 0 ? handleBack : undefined}
              onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
              showBack={data.currentStep > 0}
              showNext={data.currentStep < getTotalSteps() - 1}
              nextDisabled={!canProceed()}
            />
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

        // Partner intro
        if (hasPartner && data.currentStep === stepOffset) {
          return (
            <div className="card-container">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    👉 Every woman's situation is unique.
                  </h2>
                  <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    These following questions will help me better understand what you're going through. The more you
                    share, the more personalized support I can offer.
                  </p>
                  <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    Several risk factors have been associated with increased risk of severe violence injuries or
                    homicides of immigrant women in violent relationships.
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
              <NavigationButtons
                onBack={data.currentStep > 0 ? handleBack : undefined}
                onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
                showBack={data.currentStep > 0}
                showNext={data.currentStep < getTotalSteps() - 1}
                nextDisabled={!canProceed()}
              />
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
            <div className="card-container">
              <div className="text-center">
                <h4 className="font-merriweather text-heading-lg text-primary font-bold">
                  About your Husband or Partner
                </h4>
                <QuestionCard
                  question={question}
                  answer={answer}
                  onAnswer={handleAnswer}
                  showSubQuestion={question.subQuestion && answer === true}
                  subAnswer={subAnswer}
                  onSubAnswer={handleSubAnswer}
                />
              </div>
              <NavigationButtons
                onBack={data.currentStep > 0 ? handleBack : undefined}
                onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
                showBack={data.currentStep > 0}
                showNext={data.currentStep < getTotalSteps() - 1}
                nextDisabled={!canProceed()}
              />
            </div>
          )
        }

        stepOffset += hasPartner ? partnerQuestions.length : 0


        //         // Partner results
        //         if (hasPartner && data.currentStep === stepOffset) {
        //           if (!data.results.partner) {
        //             calculateResults()
        //             return <div>Calculating results...</div>
        //           }

        //           const riskLevel = data.results.partner
        //           const riskImages = {
        //             variable: "/images/stay-alert.jpg",
        //             moderate: "/images/be-alert.jpg",
        //             high: "/images/dont-wait.jpg",
        //             extreme: "/images/seek-immediately.jpg",
        //           }

        //           const riskTitles = {
        //             variable: "Variable Risk",
        //             moderate: "Moderate Risk",
        //             high: "High Risk",
        //             extreme: "Extreme Risk",
        //           }

        //           const riskSubtitles = {
        //             variable: "Stay Alert",
        //             moderate: "Be Alert and Plan for Your Safety",
        //             high: "Don't Wait, Seek Support",
        //             extreme: "Seek Support Immediately",
        //           }

        //           const riskDescriptions = {
        //             variable: "You may not be in immediate danger, but it's important to stay alert",
        //             moderate: "Your safety may be at a greater risk",
        //             high: "You may be in serious danger",
        //             extreme: "You may be in immediate and extreme danger",
        //           }

        //           const riskActions = {
        //             variable: [
        //               "Know that risks can change quickly, even if things seem calm right now.",
        //               "Trust your instincts — if something feels off, it probably is.",
        //               "Stay connected to your support system and keep watching for any warning signs.",
        //               "Create or review a safety plan and check in regularly with someone you trust.",
        //             ],
        //             moderate: [
        //               "Please pay close attention to any signs that things are escalating.",
        //               "This is a time to increase your safety planning and be more cautious.",
        //               "Talk to a trusted advocate or professional.",
        //               "Keep a record of concerning behavior and have a plan for where to go and who to call if you need help quickly.",
        //             ],
        //             high: [
        //               "We strongly encourage you to work closely with professionals to create a detailed safety plan.",
        //               "You may need immediate protection. Support from the courts, law enforcement, or other agencies could be critical.",
        //               "Please don't wait—your safety is urgent.",
        //             ],
        //             extreme: [
        //               "We need to act now to protect you.",
        //               "This may involve calling emergency services or getting immediate legal or professional help.",
        //               "The situation is very serious, and your safety is the top priority.",
        //               "Any support available — including strict legal measures — should be used.",
        //             ],
        //           }

        //           return (

        //             <div className="card-container">
        //               <div className="text-center space-y-6">
        //                 <div className="space-y-4">
        //                   <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed ">
        //                     <b>Thank you for taking the time to complete this questionnaire. By doing so, you're already taking an
        //                       important step toward caring for your safety and well-being. </b>
        //                   </p>
        //                   <p className="text-base text-gray-600 max-w-3xl mx-auto">
        //                     On the next page, you'll see results based on your responses. These insights are meant to help you
        //                     better understand your situation and explore your options.
        //                   </p>
        //                   <NavigationButtons
        //                     onBack={data.currentStep > 0 ? handleBack : undefined}
        //                     onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
        //                     showBack={data.currentStep > 0}
        //                     showNext={data.currentStep < getTotalSteps() - 1}
        //                     nextDisabled={!canProceed()}
        //                   />
        //                 </div>


        //               </div>

        //             </div>
        //           )
        //         }

        // Partner results
        if (hasPartner && data.currentStep === stepOffset) {
          if (!data.results?.partner) {
            calculateResults()
            return <div>Calculating results...</div>
          }

          const riskLevel = data.results.partner
          const riskImages = {
            variable: "/images/stay-alert.jpg",
            increased: "/images/be-alert.jpg",
            severe: "/images/dont-wait.jpg",
            extreme: "/images/seek-immediately.jpg",
          }

          const riskTitles = {
            variable: "Variable Risk",
            increased: "Increased Risk",
            severe: "Severe Risk",
            extreme: "Extreme Risk",
          }

          const riskDescriptions = {
            variable: "You may not be in immediate danger, but it's important to stay alert",
            increased: "Your safety may be at a greater risk",
            severe: "You may be in serious danger",
            extreme: "You may be in immediate and extreme danger",
          }

          const riskActions = {
            variable: [
              "Know that risks can change quickly, even if things seem calm right now.",
              "Trust your instincts — if something feels off, it probably is.",
              "Stay connected to your support system and keep watching for any warning signs.",
              "Create or review a safety plan and check in regularly with someone you trust.",
            ],
            increased: [
              "Please pay close attention to any signs that things are escalating.",
              "This is a time to increase your safety planning and be more cautious.",
              "Talk to a trusted advocate or professional.",
              "Keep a record of concerning behavior and have a plan for where to go and who to call if you need help quickly.",
            ],
            severe: [
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
            // <div className="card-container space-y-8">
            //   <div className="space-y-2 text-center">
            //     <p className="font-merriweather text-heading-lg text-gray-900 font-bold">
            //       Based on your answers, you scored:
            //     </p>
            //     <h3 className="font-merriweather text-heading-xl text-primary font-bold">{riskTitles[riskLevel]}</h3>
            //     <p className="font-montserrat text-body-md  text-gray-900 font-bold">{riskDescriptions[riskLevel]}</p>
            //   </div>
            //   <Card className="max-w-2xl mx-auto">
            //     <CardContent className="space-y-6 p-8">
            //       <div className="text-left space-y-4">
            //         <div>
            //           <h4 className="font-merriweather text-base font-semibold text-gray-900 mb-3">What you can do:</h4>
            //           <ul className="space-y-2 list-disc list-inside">
            //             {riskActions[riskLevel].map((action, i) => (
            //               <li key={i} className="font-montserrat text-sm text-gray-700">
            //                 {action}
            //               </li>
            //             ))}
            //           </ul>
            //         </div>
            //       </div>
            //       <div className="relative w-full max-w-sm mx-auto h-32">
            //         <Image
            //           src={riskImages[riskLevel] || "/placeholder.svg"}
            //           alt={`${riskLevel} risk level`}
            //           fill
            //           className="object-contain"
            //         />
            //       </div>
            //     </CardContent>
            //   </Card>
            //   <NavigationButtons
            //     onBack={handleBack}
            //     onNext={handleNext}
            //     showBack
            //     showNext
            //     nextDisabled={!canProceed()}
            //   />
            // </div>


            //           return (

            <div className="card-container">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed ">
                    <b>Thank you for taking the time to complete this questionnaire. By doing so, you're already taking an
                      important step toward caring for your safety and well-being. </b>
                  </p>
                  <p className="text-base text-gray-600 max-w-3xl mx-auto">
                    On the next page, you'll see results based on your responses. These insights are meant to help you
                    better understand your situation and explore your options.
                  </p>
                  <NavigationButtons
                    onBack={data.currentStep > 0 ? handleBack : undefined}
                    onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
                    showBack={data.currentStep > 0}
                    showNext={data.currentStep < getTotalSteps() - 1}
                    nextDisabled={!canProceed()}
                  />
                </div>


              </div>

            </div>
          )
        }

        stepOffset += hasPartner ? 1 : 0;   // move past thank-you


        if (hasPartner && data.currentStep === stepOffset) {
          if (!data.results?.partner) {
            calculateResults()
            return <div>Calculating results...</div>
          }

          const riskLevel = data.results.partner
          const riskImages = {
            variable: "/images/stay-alert.jpg",
            increased: "/images/be-alert.jpg",
            severe: "/images/dont-wait.jpg",
            extreme: "/images/seek-immediately.jpg",
          }

          const riskTitles = {
            variable: "Variable Risk",
            increased: "Increased Risk",
            severe: "Severe Risk",
            extreme: "Extreme Risk",
          }

          const riskDescriptions = {
            variable: "You may not be in immediate danger, but it's important to stay alert",
            increased: "Your safety may be at a greater risk",
            severe: "You may be in serious danger",
            extreme: "You may be in immediate and extreme danger",
          }

          const riskActions = {
            variable: [
              "Know that risks can change quickly, even if things seem calm right now.",
              "Trust your instincts — if something feels off, it probably is.",
              "Stay connected to your support system and keep watching for any warning signs.",
              "Create or review a safety plan and check in regularly with someone you trust.",
            ],
            increased: [
              "Please pay close attention to any signs that things are escalating.",
              "This is a time to increase your safety planning and be more cautious.",
              "Talk to a trusted advocate or professional.",
              "Keep a record of concerning behavior and have a plan for where to go and who to call if you need help quickly.",
            ],
            severe: [
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
            <div className="card-container space-y-8">
              <div className="space-y-2 text-center">
                <p className="font-merriweather text-heading-lg text-gray-900 font-bold">
                  Based on your answers, you scored:
                </p>
                <h3 className="font-merriweather text-heading-xl text-primary font-bold">{riskTitles[riskLevel]}</h3>
                <p className="font-montserrat text-body-md  text-gray-900 font-bold">{riskDescriptions[riskLevel]}</p>
              </div>
              <Card className="max-w-2xl mx-auto">
                <CardContent className="space-y-6 p-8">
                  <div className="text-left space-y-4">
                    <div>
                      <h4 className="font-merriweather text-lg md:text-xl font-semibold text-gray-900 mb-3">What you can do:</h4>
                      <ul className="space-y-2 list-disc list-inside">
                        {riskActions[riskLevel].map((action, i) => (
                          <li key={i} className="font-montserrat text-sm text-gray-700">
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="relative w-full max-w-sm mx-auto h-32">
                    <Image
                      src={riskImages[riskLevel] || "/placeholder.svg"}
                      alt={`${riskLevel} risk level`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
              <NavigationButtons
                onBack={handleBack}
                onNext={handleNext}
                showBack
                showNext
                nextDisabled={!canProceed()}
              />
            </div>



          )
        }
        stepOffset += hasPartner ? 1 : 0

        // In-laws intro
        if (hasInLaws && data.currentStep === stepOffset) {
          return (
            <div className="card-container">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">About Your In-Laws</h2>
                  <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    Now let's talk about your relationship with your in-laws. These questions will help us understand
                    any concerns you may have about your safety and well-being in relation to your in-laws.
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    Please answer "Yes" or "No" to the following questions.
                  </p>
                </div>
              </div>
              <NavigationButtons
                onBack={data.currentStep > 0 ? handleBack : undefined}
                onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
                showBack={data.currentStep > 0}
                showNext={data.currentStep < getTotalSteps() - 1}
                nextDisabled={!canProceed()}
              />
            </div>
          )
        }

        stepOffset += hasInLaws ? 1 : 0

        // In-laws questions
        if (hasInLaws && data.currentStep >= stepOffset && data.currentStep < stepOffset + inLawsQuestions.length) {
          const questionIndex = data.currentStep - stepOffset

          console.log("Current Step:", data.currentStep, "Step Offset:", stepOffset, "Question Index:", questionIndex)
          const question = inLawsQuestions[questionIndex]
          const answer = data.inLawsQuestions[question.id]
          const subAnswer = question.subQuestion ? data.inLawsQuestions[question.subQuestion.id] : undefined

          console.log("Question:", question, "Answer:", answer, "Sub-Answer:", subAnswer)

          return (
            <div className="card-container">
              <div className="text-center">
                <h4 className="font-merriweather text-heading-lg text-primary font-bold">About Your In-Laws</h4>
                <QuestionCard
                  question={question}
                  answer={answer}
                  onAnswer={handleAnswer}
                  showSubQuestion={question.subQuestion && answer === true}
                  subAnswer={subAnswer}
                  onSubAnswer={handleSubAnswer}
                />
              </div>
              <NavigationButtons
                onBack={handleBack}
                onNext={handleNext}
                showBack
                showNext
                nextDisabled={!canProceed()}
              />
            </div>
          )
        }

        stepOffset += hasInLaws ? inLawsQuestions.length : 0

        // In-laws results
        if (hasInLaws && data.currentStep === stepOffset) {
          if (!data.results?.inLaws) {
            calculateResults()
            return <div>Calculating results...</div>
          }

          const riskLevel = data.results.inLaws
          const riskTitles = {
            some: "Some Level of Risk",
            high: "High Risk",
          }

          const riskDescriptions = {
            some: "You may not be in physical danger, but you may be in a harmful situation that could escalate. The situations you indicated may still cause lasting emotional, psychological, or financial harm.",
            high: "You may be in immediate danger.",
          }
          // what can you do 
          const riskImages = {
            some: "/images/recognize-abuse.jpg",
            high: "/images/seek-immediately.jpg",
          }

          const riskActions = {
            some: [
              "Recognize this is abuse.No cultural or family expectation justifies harm or humiliation",
              "Talk to someone who understands.Seek culturally sensitive counseling or support services.",
              "Explore your rights.Some countries have laws protecting against dowry harassment and reproductive coercion.",
            ],
            high: [
              "Get help immediately: Contact a domestic violence hotline or shelter",
              "Make a safety plan: Know where to go and who to call",
              "Tell someone you trust",
              "Consider legal protection(like a restraining order or emergency support)",
            ],
          }

          return (
            // <div className="card-container space-y-8">
            //   <div className="space-y-2 text-center">
            //     <p className="font-merriweather text-heading-lg text-gray-900 font-bold">Based on your answers, you may be at </p>
            //     <h3 className="font-merriweather text-heading-xl text-primary font-bold">{riskTitles[riskLevel]}</h3>
            //     <p className="font-montserrat text-body-md text-gray-900 font-bold">{riskDescriptions[riskLevel]}</p>
            //   </div>
            //   <NavigationButtons
            //     onBack={handleBack}
            //     onNext={handleNext}
            //     showBack
            //     showNext
            //     nextDisabled={!canProceed()}
            //   />
            // </div>
            <div className="card-container space-y-8">
              <div className="space-y-2 text-center">
                <p className="font-merriweather text-heading-lg text-gray-900 font-bold">
                  Based on your answers, you scored:
                </p>
                <h3 className="font-merriweather text-heading-xl text-primary font-bold">{riskTitles[riskLevel]}</h3>
                <p className="font-montserrat text-body-md  text-gray-900 font-bold">{riskDescriptions[riskLevel]}</p>
              </div>
              <Card className="max-w-2xl mx-auto">
                <CardContent className="space-y-6 p-8">
                  <div className="text-left space-y-4">
                    <div>
                      <h4 className="font-merriweather text-lg md:text-xl font-semibold text-gray-900 mb-3">What you can do:</h4>
                      <ul className="space-y-2 list-disc list-inside">
                        {riskActions[riskLevel].map((action, i) => (
                          <li key={i} className="font-montserrat text-sm text-gray-700">
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="relative w-full max-w-sm mx-auto h-32">
                    <Image
                      src={riskImages[riskLevel] || "/placeholder.svg"}
                      alt={`${riskLevel} risk level`}
                      fill
                      className="object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
              <NavigationButtons
                onBack={handleBack}
                onNext={handleNext}
                showBack
                showNext
                nextDisabled={!canProceed()}
              />
            </div>


          )
        }

        stepOffset += hasInLaws ? 1 : 0

        // Family intro
        if (hasFamily && data.currentStep === stepOffset) {
          return (
            <div className="card-container">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">About Your Family Members</h2>
                  <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    Now let's talk about your relationship with other family members. These questions will help us
                    understand any concerns you may have about your safety and well-being in relation to your family.
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    Please answer "Yes" or "No" to the following questions.
                  </p>
                </div>
              </div>
              <NavigationButtons
                onBack={data.currentStep > 0 ? handleBack : undefined}
                onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
                showBack={data.currentStep > 0}
                showNext={data.currentStep < getTotalSteps() - 1}
                nextDisabled={!canProceed()}
              />
            </div>
          )
        }

        stepOffset += hasFamily ? 1 : 0

        // Family questions
        if (hasFamily && data.currentStep >= stepOffset && data.currentStep < stepOffset + familyQuestions.length) {
          const questionIndex = data.currentStep - stepOffset
          const question = familyQuestions[questionIndex]
          const answer = data.familyQuestions[question.id]
          const subAnswer = question.subQuestion ? data.familyQuestions[question.subQuestion.id] : undefined

          return (
            <div className="card-container">
              <div className="text-center">
                <h4 className="font-merriweather text-heading-lg text-primary font-bold">About Your Family Members</h4>
                <QuestionCard
                  question={question}
                  answer={answer}
                  onAnswer={handleAnswer}
                  showSubQuestion={question.subQuestion && answer === true}
                  subAnswer={subAnswer}
                  onSubAnswer={handleSubAnswer}
                />
              </div>
              <NavigationButtons
                onBack={handleBack}
                onNext={handleNext}
                showBack
                showNext
                nextDisabled={!canProceed()}
              />
            </div>
          )
        }

        stepOffset += hasFamily ? familyQuestions.length : 0

        // Family results
        if (hasFamily && data.currentStep === stepOffset) {
          if (!data.results?.family) {
            calculateResults()
            return <div>Calculating results...</div>
          }

          const riskLevel = data.results.family
          const riskTitles = {
            some: "Some Level of Risk",
            high: "High Risk",
          }

          const riskDescriptions = {
            some: "Based on your responses, you may be experiencing some level of risk from your family members.",
            high: "Based on your responses, you may be at high risk from your family members.",
          }

          return (
            <div className="card-container space-y-8">
              <div className="space-y-2 text-center">
                <p className="font-merriweather text-heading-lg text-gray-900 font-bold">Family Risk Assessment:</p>
                <h3 className="font-merriweather text-heading-xl text-primary font-bold">{riskTitles[riskLevel]}</h3>
                <p className="font-montserrat text-body-md text-gray-900 font-bold">{riskDescriptions[riskLevel]}</p>
              </div>
              <NavigationButtons
                onBack={handleBack}
                onNext={handleNext}
                showBack
                showNext
                nextDisabled={!canProceed()}
              />
            </div>
          )
        }

        stepOffset += hasFamily ? 1 : 0

        // Final summary
        if (data.currentStep === stepOffset) {
          if (!data.results) {
            calculateResults()
            return <div>Calculating results...</div>
          }

          const partnerRiskImages = {
            variable: "/images/stay-alert.jpg",
            increased: "/images/be-alert.jpg",
            severe: "/images/dont-wait.jpg",
            extreme: "/images/seek-immediately.jpg",
          }


          const inLawsAndFamilyRiskImages = {
            some: "/images/recognize-abuse.jpg",
            high: "/images/seek-immediately.jpg",
          }


          return (
            <div className="card-container space-y-8">
              <div className="text-center space-y-2">
                <h2 className="font-merriweather text-4xl text-primary font-bold">Summary of Your Risk Assessment</h2>
                <p className="font-montserrat text-body-md text-gray-700 max-w-3xl mx-auto">
                  Below are the current risk assessments for the relationships you've expressed concerns about.
                </p>
              </div>

              <div className="divide-y divide-gray-200 space-y-8">
                {data.results.partner && (
                  <div>
                    <h3 className="font-merriweather text-xl font-semibold text-gray-900 mb-2">Husband or partner:</h3>
                    <p className="font-montserrat text-body-md text-gray-700">
                      Based on your responses, you may be at:
                    </p>
                    <section className="pt-6 text-center">
                      <div className="mt-4 flex flex-col items-center ">
                        <span className="font-montserrat text-4xl text-primary font-bold capitalize">
                          {data.results.partner} Risk
                        </span>
                        <div className="relative w-48 h-32">
                          <Image
                            src={partnerRiskImages[data.results.partner] || "/placeholder.svg"}
                            alt={`${data.results.partner} risk`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {data.results.inLaws && (
                  <section className="pt-6">
                    <h3 className="font-merriweather text-xl font-semibold text-gray-900 mb-2">In-laws:</h3>
                    <p className="font-montserrat text-body-md text-gray-700 mb-4">
                      Based on your responses, you may be at:{" "}
                    </p>
                    <section className="pt-6 text-center">
                      <div className="mt-4 flex flex-col items-center ">
                        <span className="font-montserrat text-4xl text-primary font-bold capitalize">
                          {data.results.partner} Risk
                        </span>
                        <div className="relative w-48 h-32">
                          <Image
                            src={inLawsAndFamilyRiskImages[data.results.inLaws] || "/placeholder.svg"}
                            alt={`${data.results.inLaws} risk`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </section>
                  </section>
                )}

                {data.results.family && (
                  <section className="pt-6 pb-6">
                    <h3 className="font-merriweather text-xl font-semibold text-gray-900 mb-2">
                      Other Family Members:
                    </h3>
                    <p className="font-montserrat text-body-md text-gray-700">
                      Based on your responses, you may be at:{" "}
                      <strong className="text-2xl text-primary capitalize">{data.results.family} Risk</strong>
                    </p>
                  </section>
                )}
              </div>

              <div className="text-center space-y-4">
                <p className="font-montserrat text-body-md text-gray-700 max-w-2xl mx-auto">
                  These results reflect where you are now, but your story is still unfolding. Recognizing where you are
                  today is progress towards where you want to be.
                </p>
                <p className="font-montserrat text-body-md text-gray-700 max-w-2xl mx-auto">
                  You are the expert on your life, and we're here to walk with you. If you're ready to create a
                  personalized safety plan, click below and the BSHAPE team will guide you through it.
                </p>
                <div className="space-y-6 text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || hasSubmitted}
                    className={`btn–heartbeat mx-auto bg-[#FFF1C7] text-black font-semibold font-montserrat text-lg px-4 py-2 rounded-3xl border-4 border-[#FE6901] hover:bg-[#FFE7A2] transition whitespace-normal text-center max-w-[16rem] ${isSubmitting || hasSubmitted ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : hasSubmitted
                        ? "Submitted!"
                        : "Create a Safety Plan that Works for Me"}
                  </button>
                  <div className="space-y-1">
                    <p className="text-body-md font-montserrat text-gray-900">You are not alone, we are here for you</p>
                    <p className="text-body-md font-montserrat text-gray-900">You can contact us at</p>
                    <p className="text-2xl font-bryndan text-primary font-bold">
                      <a href="mailto:bshape@jhu.edu">
                        bshape@jhu.edu
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <NavigationButtons
                onBack={handleBack}
                showBack={true}
                showNext={true}
                className="text-1xl"
                nextText="Create my Safety Plan"
                nextLink="http://localhost:3001"
              />
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
        const section = getCurrentSection()
        const sectionKey = getSectionKey() as keyof QuestionnaireData

        console.log("Checking canProceed for section:", sectionKey, "at step:", data.currentStep)


        if (!section.length || !sectionKey) return true

        // Calculate which question we're on within the current section
        const hasPartner = data.relationshipConcerns.some(
          (concern) => concern.includes("husband") || concern.includes("partner"),
        )
        const hasInLaws = data.relationshipConcerns.includes("My in-laws")
        const hasFamily =
          data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

        let stepOffset = 7
        let questionIndex = -1

        // stepOffset += hasPartner
        //   ? 1                    // intro
        //   + partnerQuestions.length
        //   + 2                  // thank-you + results   ← was +1
        //   : 0;


        // stepOffset += hasInLaws
        //   ? 1                    // intro
        //   + inLawsQuestions.length
        //   + 2                  // thank-you + results   ← was +1
        //   : 0;
        // stepOffset += hasFamily
        //   ? 1                    // intro
        //   + familyQuestions.length
        //   + 2                  // thank-you + results   ← was +1
        //   : 0;


        // log 
        console.log("hasPartner:", hasPartner, "hasInLaws:", hasInLaws, "hasFamily:", hasFamily)

        if (hasPartner && sectionKey === "partnerQuestions") {
          const partnerStart = stepOffset + 1
          questionIndex = data.currentStep - partnerStart
          // log 
          console.log("Partner questions start at:", partnerStart, "Current step:", data.currentStep, "Question index:", questionIndex)
        } else {
          // stepOffset += hasPartner ? 1 + partnerQuestions.length + 1 : 0
          stepOffset += hasPartner ? 1 + partnerQuestions.length + 2 : 0;  // intro + Qs + 2 pages

          if (hasInLaws && sectionKey === "inLawsQuestions") {
            // log
            console.log("In-laws questions section detected")
            // log 

            const inLawsStart = stepOffset + 1
            questionIndex = data.currentStep - inLawsStart
            // log
            console.log("In-laws questions start at:", inLawsStart, "Current step:", data.currentStep, "Question index:", questionIndex)
          } else {
            // stepOffset += hasInLaws ? 1 + inLawsQuestions.length + 1 : 0
            stepOffset += hasInLaws ? 1 + inLawsQuestions.length + 2 : 0;    // intro + Qs + 2 pages

            if (hasFamily && sectionKey === "familyQuestions") {
              const familyStart = stepOffset + 1
              questionIndex = data.currentStep - familyStart
              // log
              console.log("Family questions start at:", familyStart, "Current step:", data.currentStep, "Question index:", questionIndex)
            }
          }
        }

        if (questionIndex < 0 || questionIndex >= section.length) {
          return true
        }

        const question = section[questionIndex]
        const answers = (data as any)[sectionKey]
        const main = answers[question.id]

        if (question.subQuestion && main === true) {
          const sub = answers[question.subQuestion.id]
          return sub !== undefined
        }

        return main !== undefined
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center">
      <div className="w-full max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl flex flex-col flex-1">
        {data.currentStep > 0 && <ProgressBar currentStep={data.currentStep + 1} totalSteps={getTotalSteps()} />}
        <div className="flex-1">{renderStep()}</div>
      </div>
    </div>
  )
}
