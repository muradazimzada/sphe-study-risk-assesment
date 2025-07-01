// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import type { Question, QuestionnaireData } from "@/lib/types"
// import {
//   relationshipConcernOptions,
//   livingWithOptions,
//   partnerQuestions,
//   inLawsQuestions,
//   familyQuestions,
// } from "@/lib/questions"
// import { calculatePartnerScore, getPartnerRiskLevel, getInLawsRiskLevel, getFamilyRiskLevel, calculatePartnerScoreWithBreakdown, calculateInLawsScoreWithBreakdown, calculateFamilyScoreWithBreakdown } from "@/lib/scoring"
// import { saveToLocalStorage, loadFromLocalStorage, initializeQuestionnaire, clearLocalStorage } from "@/lib/storage"
// import QuestionCard from "@/components/QuestionCard"
// import NavigationButtons from "@/components/NavigationButtons"
// import ProgressBar from "@/components/ProgressBar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"

// export default function QuestionnairePage() {
//   const [data, setData] = useState<QuestionnaireData | null>(null)
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const [showResults, setShowResults] = useState(false)
//   useEffect(() => {

//     console.log("Data changed:", data)
//     console.log("Current Step:", data?.currentStep)
//     console.log("Total Steps:", getTotalSteps())
//     // log section key and current section
//     console.log("Current Section Key:", getSectionKey())
//     console.log("Current Section Questions:", getCurrentSection())

//     if (data && data.currentStep === getTotalSteps() - 1 && !isSubmitting) {
//       handleSubmit();
//     }
//   }, [data?.currentStep]);
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   }, [data?.currentStep])

//   useEffect(() => {
//     const stored = loadFromLocalStorage()
//     if (stored) {
//       setData(stored)
//     } else {
//       setData(initializeQuestionnaire())
//     }
//   }, [])

//   const updateData = (updates: Partial<QuestionnaireData>) => {
//     if (!data) return

//     const newData = { ...data, ...updates }
//     setData(newData)
//     saveToLocalStorage(newData)
//   }

//   const handleAnswer = (questionId: string, answer: boolean | string | string[]) => {

//     console.log("handleAnswer called with:", questionId, answer)
//     if (!data) return

//     const currentSection = getCurrentSection()

//     console.log("Current section:", currentSection)
//     const sectionKey = getSectionKey()
//     console.log("Section key:", sectionKey)

//     updateData({
//       [sectionKey]: {
//         // @ts-ignore
//         ...data[sectionKey as keyof QuestionnaireData],
//         [questionId]: answer,
//       },
//     })
//   }

//   const handleSubAnswer = (subQuestionId: string, answer: boolean | string) => {
//     if (!data) return

//     const sectionKey = getSectionKey()

//     updateData({
//       [sectionKey]: {
//         // @ts-ignore

//         ...data[sectionKey as keyof QuestionnaireData],
//         [subQuestionId]: answer,
//       },
//     })
//   }
//   // const getCurrentSection = () => {
//   //   if (!data) return []

//   //   if (data.currentStep <= 6) return []

//   //   const hasPartner = data.relationshipConcerns.some(
//   //     (concern) => concern.includes("husband") || concern.includes("partner"),
//   //   )
//   //   const hasInLaws = data.relationshipConcerns.includes("My in-laws")
//   //   const hasFamily =
//   //     data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

//   //   let stepOffset = 7 // Initial steps (0-6)

//   //   // Partner section: intro (1 step) + questions (27 steps) + result (1 step) = 29 steps
//   //   if (hasPartner) {
//   //     const partnerSectionEnd = stepOffset + 1 + partnerQuestions.length + 1 // intro + questions + result
//   //     if (data.currentStep < partnerSectionEnd) {
//   //       return partnerQuestions
//   //     }
//   //     stepOffset = partnerSectionEnd
//   //   }

//   //   // In-laws section: intro (1 step) + questions (11 steps) + result (1 step) = 13 steps
//   //   if (hasInLaws) {
//   //     const inLawsSectionEnd = stepOffset + 1 + inLawsQuestions.length + 1
//   //     if (data.currentStep < inLawsSectionEnd) {
//   //       return inLawsQuestions
//   //     }
//   //     stepOffset = inLawsSectionEnd
//   //   }

//   //   // Family section
//   //   if (hasFamily) {
//   //     return familyQuestions
//   //   }

//   //   return []
//   // }

//   // const getSectionKey = (): string => {
//   //   if (!data) return ""

//   //   if (data.currentStep <= 6) return ""

//   //   const hasPartner = data.relationshipConcerns.some(
//   //     (concern) => concern.includes("husband") || concern.includes("partner"),
//   //   )
//   //   const hasInLaws = data.relationshipConcerns.includes("My in-laws")
//   //   const hasFamily =
//   //     data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

//   //   let stepOffset = 7 // Initial steps (0-6)

//   //   // Partner section: intro (1 step) + questions (27 steps) + result (1 step) = 29 steps
//   //   if (hasPartner) {
//   //     const partnerSectionEnd = stepOffset + 1 + partnerQuestions.length + 1
//   //     if (data.currentStep < partnerSectionEnd) {
//   //       return "partnerQuestions"
//   //     }
//   //     stepOffset = partnerSectionEnd
//   //   }
//   //   console.log("Step offset after partner section:", stepOffset)
//   //   console.log({ hasInLaws, hasFamily })

//   //   // In-laws section: intro (1 step) + questions (11 steps) + result (1 step) = 13 steps
//   //   if (hasInLaws) {
//   //     const inLawsSectionEnd = stepOffset + 1 + inLawsQuestions.length + 1
//   //     if (data.currentStep < inLawsSectionEnd) {
//   //       return "inLawsQuestions"
//   //     }
//   //     stepOffset = inLawsSectionEnd
//   //   }

//   //   // Family section
//   //   if (hasFamily) {
//   //     return "familyQuestions"
//   //   }

//   //   return ""
//   // }
//   const getCurrentSection = () => {
//     console.log("getCurrentSection called")

//     if (!data) return []

//     if (data.currentStep <= 6) return []

//     const hasPartner = data.relationshipConcerns.some(
//       (concern) => concern.includes("husband") || concern.includes("partner"),
//     )
//     const hasInLaws = data.relationshipConcerns.includes("My in-laws")
//     const hasFamily =
//       data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")
//     console.log({ hasPartner, hasInLaws, hasFamily })
//     let stepOffset = 7
//     // log everything
//     if (hasPartner) {
//       const start = stepOffset
//       const end = start + partnerQuestions.length + 1
//       // log
//       console.log("Partner section start:", start, "end:", end)
//       console.log("Current step:", data.currentStep)

//       if (data.currentStep >= start && data.currentStep < end) {
//         return partnerQuestions
//       }
//       stepOffset = end
//     }

//     if (hasInLaws) {
//       // log stepOffset

//       const start = stepOffset
//       const end = start + 1 + inLawsQuestions.length + 1
//       if (data.currentStep >= start && data.currentStep < end) {
//         return inLawsQuestions
//       }
//       stepOffset = end
//     }

//     if (hasFamily) {
//       const start = stepOffset
//       const end = start + 1 + familyQuestions.length + 1
//       if (data.currentStep >= start && data.currentStep < end) {
//         return familyQuestions
//       }
//     }

//     return []
//   }

//   const getSectionKey = (): string => {

//     // log it called
//     console.log("getSectionKey called")
//     if (!data) return ""

//     if (data.currentStep <= 6) return ""

//     const hasPartner = data.relationshipConcerns.some(
//       (concern) => concern.includes("husband") || concern.includes("partner"),
//     )
//     const hasInLaws = data.relationshipConcerns.includes("My in-laws")
//     const hasFamily =
//       data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

//     let stepOffset = 7 // initial steps (0–6)

//     // Partner section: intro (1) + questions + result (1)
//     if (hasPartner) {
//       console.log("Checking partner section with stepOffset:", stepOffset)
//       const partnerStart = stepOffset
//       // log everything
//       console.log("Partner section starts at step:", partnerStart)
//       const partnerEnd = partnerStart + partnerQuestions.length + 1
//       console.log("Partner section ends at step:", partnerEnd)
//       console.log("Current step is in partner section:", data.currentStep)
//       console.log("Current step:", data.currentStep, "Partner start:", partnerStart, "Partner end:", partnerEnd)
//       if (data.currentStep >= partnerStart && data.currentStep < partnerEnd) {
//         // log current step
//         console.log("Current step is within partner section range")
//         return "partnerQuestions"

//       }
//       stepOffset = partnerEnd
//     }

//     // In-laws section: intro (1) + questions + result (1)
//     if (hasInLaws) {
//       const inLawsStart = stepOffset
//       const inLawsEnd = inLawsStart + 1 + inLawsQuestions.length + 1
//       if (data.currentStep >= inLawsStart && data.currentStep < inLawsEnd) {
//         console.log("Current step is within in-laws section range")
//         return "inLawsQuestions"
//       }
//       stepOffset = inLawsEnd
//     }

//     // Family section: intro (1) + questions + result (1)
//     if (hasFamily) {
//       const familyStart = stepOffset
//       const familyEnd = familyStart + 1 + familyQuestions.length + 1
//       if (data.currentStep >= familyStart && data.currentStep < familyEnd) {
//         console.log("Current step is within family section range")
//         return "familyQuestions"
//       }
//     }

//     return ""
//   }


//   const getTotalSteps = () => {
//     if (!data) return 10

//     let steps = 8 // Initial steps

//     const hasPartner = data.relationshipConcerns.some(
//       (concern) => concern.includes("husband") || concern.includes("partner"),
//     )
//     const hasInLaws = data.relationshipConcerns.includes("My in-laws")
//     const hasFamily =
//       data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

//     if (hasPartner) steps += partnerQuestions.length + 2
//     if (hasInLaws) steps += inLawsQuestions.length + 2
//     if (hasFamily) steps += familyQuestions.length + 2

//     steps += 1

//     return steps
//   }

//   const handleNext = () => {
//     if (!data) return

//     const newStep = data.currentStep + 1
//     updateData({ currentStep: newStep })
//   }

//   const handleBack = () => {
//     if (!data) return

//     const newStep = Math.max(0, data.currentStep - 1)
//     updateData({ currentStep: newStep })
//   }

//   const calculateResults = () => {

//     console.log("Calculating results...")
//     if (!data) return

//     const results: any = {}
//     const scores: any = {}

//     if (data.relationshipConcerns.some((concern) => concern.includes("husband") || concern.includes("partner"))) {
//       const breakdown = calculatePartnerScoreWithBreakdown(data.partnerQuestions)
//       scores.partner = {
//         total: breakdown.totalScore,
//         questions: breakdown.questions,
//       }
//       results.partner = getPartnerRiskLevel(breakdown.totalScore)

//       ///
//       // console.log("Calculating partner score...")
//       // const partnerScore = calculatePartnerScore(data.partnerQuestions)
//       // console.log("Partner score:", partnerScore)
//       // scores.partner = partnerScore
//       // console.log("Determining partner risk level...")
//       // results.partner = getPartnerRiskLevel(partnerScore)
//       // console.log("Partner risk level:", results.partner)
//     }

//     if (data.relationshipConcerns.includes("My in-laws")) {
//       // results.inLaws = getInLawsRiskLevel(data.inLawsQuestions)
//       // scores.inLaws = results.inLaws
//       const breakdown = calculateInLawsScoreWithBreakdown(data.inLawsQuestions)
//       scores.inLaws = {
//         total: breakdown.totalScore,
//         questions: breakdown.questions,
//       }
//       results.inLaws = getInLawsRiskLevel(data.inLawsQuestions)
//     }

//     if (data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")) {
//       // results.family = getFamilyRiskLevel(data.familyQuestions)
//       // scores.family = results.family

//     }
//     if (
//       data.relationshipConcerns.includes("Other family members") ||
//       data.relationshipConcerns.includes("Other")
//     ) {
//       const breakdown = calculateFamilyScoreWithBreakdown(data.familyQuestions)
//       scores.family = {
//         total: breakdown.totalScore,
//         questions: breakdown.questions,
//       }
//       results.family = getFamilyRiskLevel(data.familyQuestions)
//     }

//     updateData({ results, scores })
//   }

//   const handleSubmit = async () => {
//     if (!data) return

//     console.log("Submitting assessment...")

//     setIsSubmitting(true)

//     try {
//       const response = await fetch("/api/submit-assessment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...data,
//           completedAt: new Date(),
//         }),
//       })

//       if (response.ok) {
//         clearLocalStorage()
//         alert("Assessment submitted successfully!")
//       } else {
//         throw new Error("Failed to submit")
//       }
//     } catch (error) {
//       console.error("Error submitting assessment:", error)
//       alert("Error submitting assessment. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   if (!data) {
//     return (
//       <div className="min-h-screen bg-cream flex justify-center items-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-button mx-auto"></div>
//           <p className="mt-4 text-gray-600 font-montserrat">Loading BSHAPE Assessment...</p>
//         </div>
//       </div>
//     )
//   }

//   const renderStep = () => {
//     switch (data.currentStep) {
//       case 0:
//         // Welcome screen
//         return (
//           <div className="min-h-screen bg-cream flex items-center justify-center py-6 px-4">
//             <div className="bg-white rounded-[2rem] p-10 md:p-16 shadow-lg max-w-4xl w-full">
//               <div className="container-content text-center space-y-8">
//                 <div className="space-y-2">
//                   <h1 className="font-merriweather text-heading-xl text-primary font-bold">BSHAPE</h1>
//                   <p className="font-montserrat text-body-lg text-gray-700 font-medium">
//                     Being Safe, Healthy and Positively Empowered
//                   </p>
//                 </div>

//                 <div className="rounded-xl overflow-hidden shadow-md max-w-md mx-auto">
//                   <Image
//                     src="/images/bshape-logo.jpg"
//                     alt="BSHAPE Logo"
//                     width={350}
//                     height={300}
//                     className="object-cover w-full h-auto"
//                     priority
//                   />
//                 </div>

//                 <div className="space-y-6">
//                   <h2 className="font-merriweather text-heading-lg text-primary font-bold">Welcome to BSHAPE!</h2>
//                   <p className="font-montserrat text-body-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
//                     Everyone deserves to be healthy and safe in their relationships. BSHAPE is here to help you assess
//                     your well-being, explore safety strategies, and connect with resources that can support you.
//                   </p>
//                 </div>

//                 {/* <div className="pt-6">
//                   <Button className="rounded-md px-10 py-4 text-lg">Continue →</Button>
//                 </div> */}

//                 <Button
//                   onClick={handleNext}
//                   className="bg-[#F28132] text-white font-semibold text-lg px-10 py-4 rounded-xl hover:brightness-105 transition"
//                 >
//                   Continue →
//                 </Button>

//               </div>
//             </div>
//           </div>
//         )

//       case 1:
//         return (

//           <div className="card-container">
//             {/* <div className="container-content text-center space-y-8 py-12"> */}
//             {/* <div className="container-content text-center space-y-7 py-6 md:py-12"> */}
//             <div className="container-content text-center space-y-6 ">

//               {/* Heading */}
//               <h2 className="font-merriweather text-heading-lg text-primary font-bold">
//                 Recognizing Your Strengths
//               </h2>

//               {/* Top Paragraphs */}
//               <div className="space-y-6 max-w-3xl mx-auto text-body-lg text-gray-700 font-montserrat leading-relaxed">
//                 <p>
//                   Acknowledging your abilities and support systems can help you make
//                   informed decisions about your safety and well-being.
//                 </p>
//                 <p>
//                   Let’s take a moment to focus on what makes you unique and resilient.
//                 </p>
//                 <p>
//                   Everyone has strengths—qualities that help them overcome challenges and thrive.
//                 </p>
//               </div>

//               {/* Center Image */}
//               <div className="relative w-full max-w-md mx-auto h-48">
//                 <Image
//                   src="/images/tree-illustration.jpg"
//                   alt="Tree illustration"
//                   fill
//                   className="object-contain"
//                 />
//               </div>

//               {/* Bottom Paragraph */}
//               <p className="font-montserrat text-body-md text-gray-700 max-w-3xl mx-auto leading-relaxed">
//                 This conversation is about recognizing those strengths and how they contribute to
//                 your overall health, safety, and well-being.
//               </p>

//               {/* Navigation Buttons */}
//               <NavigationButtons
//                 onBack={data.currentStep > 0 ? handleBack : undefined}
//                 onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//                 showBack={data.currentStep > 0}
//                 showNext={data.currentStep < getTotalSteps() - 1}
//                 nextDisabled={!canProceed()}
//               />
//             </div>
//           </div>

//         )


//       case 2:
//         return (


//           <div className="card-container">
//             <div className="container-content text-center space-y-6 ">

//               {/* Heading */}
//               <h2 className="font-merriweather text-heading-lg text-primary font-bold ">
//                 Personalized Help for You
//               </h2>

//               {/* Intro Paragraph */}
//               <p className="font-montserrat text-body-lg text-gray-700 max-w-2xl mx-auto leading-relaxed space-y-6">
//                 In the next sections, I’ll help you reflect on your relationships and support you on your path to
//                 health, safety, and well-being.
//               </p>

//               {/* Bubble + Image */}
//               <div className="relative max-w-3xl mx-auto flex flex-col items-center space-y-6">


//                 {/* Woman Image */}
//                 <div className="relative mx-auto w-full max-w-md h-[22rem]">
//                   <Image
//                     src="/images/woman-speaking.jpg"
//                     alt="Woman speaking"
//                     fill
//                     className="object-contain"
//                   />
//                 </div>

//               </div>
//             </div>
//             {/* Navigation Buttons */}
//             <NavigationButtons
//               onBack={data.currentStep > 0 ? handleBack : undefined}
//               onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//               showBack={data.currentStep > 0}
//               showNext={data.currentStep < getTotalSteps() - 1}
//               nextDisabled={!canProceed()}
//             />
//           </div>

//         )

//       case 3:
//         return (
//           <div className="card-container">

//             <div className="container-content text-center  ">
//               <div className="text-center space-y-6">

//                 {/* Top Title */}
//                 <h2 className="font-merriweather text-heading-lg text-gray-900 font-bold">
//                   Let’s start by talking about your relationships.
//                 </h2>

//                 {/* Subheading */}
//                 <p className="font-montserrat text-body-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
//                   Everyone’s situation is different, and understanding your concerns is the first step
//                   toward finding the right support.
//                 </p>

//                 {/* Highlighted Question */}
//                 <h3 className="font-merriweather text-xl text-primary font-bold">
//                   Which relationship(s) are you concerned about?
//                 </h3>

//                 {/* Hint */}
//                 <p className="font-montserrat text-body-md text-gray-700 font-medium">
//                   (Select all that apply)
//                 </p>
//               </div>

//               {/* Checkbox Question */}
//               <QuestionCard
//                 question={{
//                   id: "relationship-concerns",
//                   text: "", // Already shown above
//                   type: "checkbox",
//                   options: relationshipConcernOptions,
//                 }}
//                 answer={data.relationshipConcerns}
//                 onAnswer={(_, answer) => updateData({ relationshipConcerns: answer as string[] })}
//               />
//             </div>
//             <NavigationButtons
//               onBack={data.currentStep > 0 ? handleBack : undefined}
//               onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//               showBack={data.currentStep > 0}
//               showNext={data.currentStep < getTotalSteps() - 1}
//               nextDisabled={!canProceed()}
//             />
//           </div>

//         )

//       case 4:
//         return (
//           <div className="card-container">

//             <div className="container-content text-center  ">
//               <div className="text-center space-y-6">
//                 <h2 className="font-merriweather text-heading-lg text-primary font-bold">Who do you live with?</h2>
//                 <p className="font-montserrat text-body-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
//                   Next, understanding <b>your living situation</b> can help us better understand your circumstances.
//                 </p>
//               </div>

//               <QuestionCard
//                 question={{
//                   id: "living-with",
//                   text: "",
//                   type: "radio",
//                   options: livingWithOptions,
//                 }}
//                 answer={data.livingWith}
//                 onAnswer={(_, answer) => updateData({ livingWith: answer as string })}
//               />
//             </div>
//             <NavigationButtons
//               onBack={data.currentStep > 0 ? handleBack : undefined}
//               onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//               showBack={data.currentStep > 0}
//               showNext={data.currentStep < getTotalSteps() - 1}
//               nextDisabled={!canProceed()}
//             />
//           </div>
//         )

//       case 5:
//         return (
//           <div className="card-container">

//             <div className="container-content space-y-8 py-12">
//               <p className="font-montserrat text-body-lg text-gray-700 max-w-3xl mx-auto leading-relaxed text-center">
//                 Let's explore your thoughts about <b>your current living situation.</b>
//                 {data.livingWith === "I live alone" &&
//                   " Or, if you're living alone, would you like to continue living alone?"}
//               </p>
//               <div className="text-center space-y-6">
//                 <h2 className="font-merriweather text-heading-md text-primary font-bold">
//                   Would you like to continue living with the people you're currently living with?
//                 </h2>

//               </div>

//               <QuestionCard
//                 question={{
//                   id: "living-preference",
//                   text: "",
//                   type: "radio",
//                   options: [
//                     "Yes, I would like to continue living with people in my household or to continue living alone",
//                     "No, I would prefer a change in my living situation",
//                   ],
//                 }}
//                 answer={data.livingPreference}
//                 onAnswer={(_, answer) => updateData({ livingPreference: answer as string })}
//               />

//               {data.livingPreference === "No, I would prefer a change in my living situation" && (
//                 <div className="mt-8">
//                   <QuestionCard
//                     question={{
//                       id: "living-change-description",
//                       text: "Please describe how you would like to change your living situation:",
//                       type: "text",
//                     }}
//                     answer={data.livingChangeDescription || ""}
//                     onAnswer={(_, answer) => updateData({ livingChangeDescription: answer as string })}
//                   />
//                 </div>
//               )}
//             </div>
//             <NavigationButtons
//               onBack={data.currentStep > 0 ? handleBack : undefined}
//               onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//               showBack={data.currentStep > 0}
//               showNext={data.currentStep < getTotalSteps() - 1}
//               nextDisabled={!canProceed()}
//             />
//           </div>
//         )

//       case 6:
//         return (
//           <div className="card-container">

//             <div className="container-content text-center space-y-8 py-12">
//               <div className="space-y-6">
//                 <h2 className="font-merriweather text-heading-lg text-primary font-bold">Relationship Warning Signs</h2>

//               </div>

//               <div className="text-left max-w-4xl mx-auto space-y-6">
//                 <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-button">
//                   <h3 className="font-merriweather text-xl font-bold text-primary mb-3">Your well-being matters!</h3>
//                   <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
//                     Unhealthy relationships can take a toll on your health and happiness. We're here to offer strategies
//                     and resources to help you stay safe and supported.
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
//                     When people hear the word <b>"abuse"</b>, they often think of physical violence, like hitting. But abuse <b>can
//                       take many forms</b>—emotional, verbal, financial, and more.
//                   </p>
//                   <p className="font-montserrat text-body-md text-red-600 font-semibold">
//                     No matter the form, abuse is never okay.
//                   </p>
//                   <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
//                     <b> It can be difficult to recognize and even harder to deal with</b>, but you don't have to go through it
//                     alone.
//                   </p>

//                   <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
//                     <p className="font-montserrat text-body-md text-green-700 font-semibold leading-relaxed">
//                       A healthy relationship should make you feel respected, valued, and good about yourself—you deserve
//                       that!
//                     </p>
//                   </div>

//                   <div className="text-center pt-4">
//                     <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
//                       Now, let's take a moment to check-in.
//                     </p>
//                     <p className="font-merriweather text-lg font-semibold text-primary mt-2">
//                       Are you noticing any red flags or warning signs in your relationship?
//                     </p>
//                     <div className="relative w-32 h-32 mx-auto">
//                       <Image src="/images/red-flag.jpg" alt="Red flag warning" fill className="object-contain" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <NavigationButtons
//               onBack={data.currentStep > 0 ? handleBack : undefined}
//               onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//               showBack={data.currentStep > 0}
//               showNext={data.currentStep < getTotalSteps() - 1}
//               nextDisabled={!canProceed()}
//             />
//           </div>
//         )

//       default:
//         // Handle questionnaire sections and results

//         // log everything 
//         // DEFAULT CASE
//         console.log("Default case for step:", data.currentStep)

//         const hasPartner = data.relationshipConcerns.some(
//           (concern) => concern.includes("husband") || concern.includes("partner"),
//         )

//         console.log("Has partner:", hasPartner)
//         const hasInLaws = data.relationshipConcerns.includes("My in-laws")
//         const hasFamily =
//           data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

//         console.log("Has in-laws:", hasInLaws)
//         console.log("Has family:", hasFamily)

//         let stepOffset = 7

//         // Partner questionnaire intro
//         if (hasPartner && data.currentStep === stepOffset) {
//           console.log("Rendering partner intro at step:", data.currentStep)
//           return (
//             <div className="card-container">

//               <div className="text-center space-y-6">
//                 <div className="space-y-4">

//                   <h2 className="text-2xl md:text-3xl font-bold text-gray-900">👉 Every woman's situation is unique.</h2>
//                   <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
//                     These following questions will help me better understand what
//                     you're going through. The more you share, the more personalized support I can offer.
//                   </p>
//                   <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
//                     Several risk factors have been associated with increased risk of severe violence injuries or homicides
//                     of immigrant women in violent relationships.
//                   </p>
//                   <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
//                     We cannot predict what will happen in your case, but we would like you to be aware of the danger of
//                     homicide in situations of abuse and for you to see how many of the risk factors apply to your
//                     situation.
//                   </p>
//                   <p className="text-base font-semibold text-gray-900">
//                     The following questions were designed by experts to help identify unhealthy patterns. Please answer
//                     "Yes" or "No."
//                   </p>
//                 </div>
//               </div>
//               <NavigationButtons
//                 onBack={data.currentStep > 0 ? handleBack : undefined}
//                 onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//                 showBack={data.currentStep > 0}
//                 showNext={data.currentStep < getTotalSteps() - 1}
//                 nextDisabled={!canProceed()}
//               />
//             </div>
//           )
//         }
//         console.log("Step offset after partner intro:", stepOffset)
//         stepOffset += hasPartner ? 1 : 0

//         // Partner questions
//         if (hasPartner && data.currentStep >= stepOffset && data.currentStep < stepOffset + partnerQuestions.length) {
//           const questionIndex = data.currentStep - stepOffset
//           const question = partnerQuestions[questionIndex]
//           const answer = data.partnerQuestions[question.id]
//           const subAnswer = question.subQuestion ? data.partnerQuestions[question.subQuestion.id] : undefined

//           return (
//             <div className="card-container">

//               <div className="text-center">
//                 <h4 className="font-merriweather text-heading-lg text-primary font-bold">
//                   About your Husband or Partner
//                 </h4>

//                 <QuestionCard
//                   question={question}
//                   answer={answer}

//                   onAnswer={handleAnswer}
//                   showSubQuestion={question.subQuestion && answer === true}
//                   subAnswer={subAnswer}
//                   onSubAnswer={handleSubAnswer}
//                 />

//               </div>
//               <NavigationButtons
//                 onBack={data.currentStep > 0 ? handleBack : undefined}
//                 onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//                 showBack={data.currentStep > 0}
//                 showNext={data.currentStep < getTotalSteps() - 1}
//                 nextDisabled={!canProceed()}
//               />
//             </div>
//           )
//         }

//         stepOffset += hasPartner ? 1 + partnerQuestions.length : 0
//         const inLawsStart = stepOffset + 1 // skip intro
//         if (hasInLaws && data.currentStep >= inLawsStart && data.currentStep < inLawsStart + inLawsQuestions.length) {
//           const questionIndex = data.currentStep - inLawsStart
//           const question = inLawsQuestions[questionIndex]
//           const answer = data.inLawsQuestions[question.id]
//           const subAnswer = question.subQuestion ? data.inLawsQuestions[question.subQuestion.id] : undefined

//           return (
//             <div className="card-container">
//               <div className="text-center">
//                 <h4 className="font-merriweather text-heading-lg text-primary font-bold">
//                   About Your In-Laws
//                 </h4>

//                 <QuestionCard
//                   question={question}
//                   answer={answer}
//                   onAnswer={handleAnswer}
//                   showSubQuestion={question.subQuestion && answer === true}
//                   subAnswer={subAnswer}
//                   onSubAnswer={handleSubAnswer}
//                 />
//               </div>
//               <NavigationButtons
//                 onBack={handleBack}
//                 onNext={handleNext}
//                 showBack
//                 showNext
//                 nextDisabled={!canProceed()}
//               />
//             </div>
//           )
//         }
//         stepOffset += 1 + inLawsQuestions.length + 1   // intro + Qs + result

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


//         // Similar logic for in-laws and family questionnaires...
//         // (Implementation continues with similar patterns for in-laws and family sections)

//         // Summary page
//         const totalSteps = getTotalSteps()
//         if (data.currentStep === totalSteps - 2) {
//           if (hasPartner && data.currentStep === stepOffset) {
//             if (!data.results.partner) {
//               console.log("Calculating results for summary...")
//               calculateResults()
//               return <div>Calculating results...</div>
//             }

//             const riskLevel = data.results.partner
//             const riskImages = {
//               variable: "/images/stay-alert.jpg",
//               moderate: "/images/be-alert.jpg",
//               high: "/images/dont-wait.jpg",
//               extreme: "/images/seek-immediately.jpg",
//             }

//             const riskTitles = {
//               variable: "Variable Risk",
//               moderate: "Moderate Risk",
//               high: "High Risk",
//               extreme: "Extreme Risk",
//             }

//             const riskDescriptions = {
//               variable: "You may not be in immediate danger, but it's important to stay alert",
//               moderate: "Your safety may be at a greater risk",
//               high: "You may be in serious danger",
//               extreme: "You may be in immediate and extreme danger",
//             }

//             const riskActions = {
//               variable: [
//                 "Know that risks can change quickly, even if things seem calm right now.",
//                 "Trust your instincts — if something feels off, it probably is.",
//                 "Stay connected to your support system and keep watching for any warning signs.",
//                 "Create or review a safety plan and check in regularly with someone you trust.",
//               ],
//               moderate: [
//                 "Please pay close attention to any signs that things are escalating.",
//                 "This is a time to increase your safety planning and be more cautious.",
//                 "Talk to a trusted advocate or professional.",
//                 "Keep a record of concerning behavior and have a plan for where to go and who to call if you need help quickly.",
//               ],
//               high: [
//                 "We strongly encourage you to work closely with professionals to create a detailed safety plan.",
//                 "You may need immediate protection. Support from the courts, law enforcement, or other agencies could be critical.",
//                 "Please don't wait—your safety is urgent.",
//               ],
//               extreme: [
//                 "We need to act now to protect you.",
//                 "This may involve calling emergency services or getting immediate legal or professional help.",
//                 "The situation is very serious, and your safety is the top priority.",
//                 "Any support available — including strict legal measures — should be used.",
//               ],
//             }

//             return (
//               <div className="card-container space-y-8">
//                 {/* Header + risk text */}
//                 <div className="space-y-2 text-center">
//                   <p className="font-merriweather text-heading-lg text-gray-900 font-bold">
//                     Based on your answers, you scored:
//                   </p>
//                   <h3 className="font-merriweather text-heading-xl text-primary font-bold">
//                     {riskTitles[riskLevel]}
//                   </h3>
//                   <p className="font-montserrat text-body-md  text-gray-900 font-bold">
//                     {riskDescriptions[riskLevel]}
//                   </p>
//                 </div>

//                 {/* Inner card with image + description */}
//                 <Card className="max-w-2xl mx-auto">
//                   <CardContent className="space-y-6 p-8">


//                     <div className="text-left space-y-4">

//                       <div>
//                         <h4 className="font-merriweather text-base font-semibold text-gray-900 mb-3">
//                           What you can do:
//                         </h4>
//                         <ul className="space-y-2 list-disc list-inside">
//                           {riskActions[riskLevel].map((action, i) => (
//                             <li key={i} className="font-montserrat text-sm text-gray-700">
//                               {action}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                     <div className="relative w-full max-w-sm mx-auto h-32">
//                       <Image
//                         src={riskImages[riskLevel] || "/placeholder.svg"}
//                         alt={`${riskLevel} risk level`}
//                         fill
//                         className="object-contain"
//                       />
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Navigation buttons */}
//                 <NavigationButtons
//                   onBack={handleBack}
//                   onNext={handleNext}
//                   showBack
//                   showNext
//                   nextDisabled={!canProceed()}
//                 />
//               </div>
//             )
//           }

//         }

//         if (data.currentStep === totalSteps - 1) {
//           const riskImages = {
//             variable: "/images/stay-alert.jpg",
//             moderate: "/images/be-alert.jpg",
//             high: "/images/dont-wait.jpg",
//             extreme: "/images/seek-immediately.jpg",
//           }
//           // pick the partner risk (default to “variable” if somehow missing)
//           const partnerLevel = (data.results.partner as string) || "variable"

//           return (
//             <div className="card-container space-y-8">
//               {/* Title + Subtitle */}
//               <div className="text-center space-y-2">
//                 <h2 className="font-merriweather text-4xl text-primary font-bold">
//                   Summary of Your Risk Assessment
//                 </h2>
//                 <p className="font-montserrat text-body-md text-gray-700 max-w-3xl mx-auto">
//                   Below are the current risk assessments for the relationships you’ve expressed concerns about.
//                 </p>
//               </div>

//               <div className="divide-y divide-gray-200 space-y-8">
//                 {/* Husband/Partner */}
//                 {data.results.partner && (
//                   <div>

//                     <h3 className="font-merriweather text-xl font-semibold text-gray-900 mb-2">
//                       Husband or partner:
//                     </h3>
//                     <p className="font-montserrat text-body-md text-gray-700">
//                       Based on your responses, you may be at:
//                     </p>

//                     <section className="pt-6 text-center">

//                       {/* center both the “Extreme Risk” text and the image together */}
//                       <div className="mt-4 flex flex-col items-center ">
//                         <span className="font-montserrat text-4xl text-primary font-bold capitalize">
//                           {data.results.partner} Risk
//                         </span>

//                         <div className="relative w-48 h-32">
//                           <Image
//                             src={riskImages[data.results.partner]}
//                             alt={`${data.results.partner} risk`}
//                             fill
//                             className="object-contain"
//                           />
//                         </div>
//                       </div>
//                     </section>
//                   </div>

//                 )}


//                 {/* In-laws */}
//                 {data.results.inLaws && (
//                   <section className="pt-6">
//                     <h3 className="font-merriweather text-xl font-semibold text-gray-900 mb-2">
//                       In-laws:
//                     </h3>
//                     <p className="font-montserrat text-body-md text-gray-700 mb-4">
//                       Based on your responses, you may be at:{" "}
//                       <strong className="text-2xl text-primary capitalize">
//                         {data.results.inLaws} Risk
//                       </strong>
//                     </p>

//                     {/* repeat risk-image step if you have one for in-laws */}
//                   </section>
//                 )}

//                 {/* Other Family */}
//                 {data.results.family && (
//                   <section className="pt-6 pb-6">
//                     <h3 className="font-merriweather text-xl font-semibold text-gray-900 mb-2">
//                       Other Family Members:
//                     </h3>
//                     <p className="font-montserrat text-body-md text-gray-700">
//                       Based on your responses, you may be at:{" "}
//                       <strong className="text-2xl text-primary capitalize">
//                         {data.results.family} Risk
//                       </strong>
//                     </p>
//                   </section>
//                 )}
//               </div>

//               {/* Footer call-to-action */}
//               <div className="text-center space-y-4">
//                 <p className="font-montserrat text-body-md text-gray-700 max-w-2xl mx-auto">
//                   These results reflect where you are now, but your story is still unfolding. Recognizing where you are
//                   today is progress towards where you want to be.
//                 </p>

//                 <p className="font-montserrat text-body-md text-gray-700 max-w-2xl mx-auto">
//                   You are the expert on your life, and we're here to walk with you. If you're ready to create a
//                   personalized safety plan, click below and the BSHAPE team will guide you through it.
//                 </p>
//                 <div className="space-y-6 text-center">
//                   <button
//                     onClick={handleSubmit}
//                     disabled={isSubmitting}
//                     className={` btn–heartbeat
//    mx-auto              /* center in its container */
//     bg-[#FFF1C7]
//     text-black
//     font-semibold font-montserrat text-lg
//     px-4 py-2
//     rounded-3xl
//     border-4 border-[#FE6901]
//     hover:bg-[#FFE7A2]
//     transition
//     whitespace-normal    /* allow wrapping */
//     text-center          /* center the wrapped lines */
//     max-w-[16rem]        /* cap the width so it wraps around here */
//     `}
//                   >
//                     {isSubmitting ? "Submitting..." : "Create a Safety Plan that Works for Me"}
//                   </button>

//                   <div className="space-y-1">
//                     <p className="text-body-md font-montserrat text-gray-900">
//                       You are not alone, we are here for you
//                     </p>
//                     <p className="text-body-md font-montserrat text-gray-900">
//                       You can contact us at
//                     </p>
//                     <p className="text-2xl font-bryndan text-primary font-bold">
//                       bshape@jhu.edu
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <NavigationButtons
//                 onBack={handleBack}
//                 showBack={true}
//                 showNext={true}
//                 className="text-1xl"
//                 nextText="Create my Safety Plan"
//                 nextLink="http://localhost:3001"  // opens the safety‐plan app
//               />
//             </div>
//           )
//           // return <div className="container-content py-12">Step not implemented yet</div>
//         }
//     }
//   }

//   const canProceed = () => {
//     switch (data.currentStep) {
//       case 3:
//         return data.relationshipConcerns.length > 0
//       case 4:
//         return data.livingWith !== ""
//       case 5:
//         return (
//           data.livingPreference !== "" &&
//           (data.livingPreference !== "No, I would prefer a change in my living situation" ||
//             data.livingChangeDescription)
//         )
//       // default:
//       //   return true
//       default:
//         const section = getCurrentSection()
//         const sectionKey = getSectionKey() as keyof QuestionnaireData
//         const DYNAMIC_START = 8  // <-- the step index where your first partner question lives
//         const questionIndex = data.currentStep - DYNAMIC_START

//         // if we're not in that block, let them through:
//         if (questionIndex < 0 || questionIndex >= section.length) {
//           return true
//         }

//         const question = section[questionIndex]
//         const answers = (data as any)[sectionKey]
//         const main = answers[question.id]

//         // if there's a subQuestion and the main answer is true, require subAnswer:
//         if (question.subQuestion && main === true) {
//           const sub = answers[question.subQuestion.id]
//           return sub !== undefined
//         }

//         // otherwise just require the main answer:
//         return main !== undefined
//     }
//   }

//   return (
//     <div className="min-h-screen bg-cream flex flex-col items-center">
//       <div className="w-full max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl flex flex-col flex-1">
//         {data.currentStep > 0 && (
//           <ProgressBar currentStep={data.currentStep + 1} totalSteps={getTotalSteps()} />
//         )}

//         <div className="flex-1">{renderStep()}</div>

//         {/* Uncomment if navigation is needed */}
//         {/* {data.currentStep > 0 && (
//         <div className="mt-4">
//           <NavigationButtons
//             onBack={data.currentStep > 0 ? handleBack : undefined}
//             onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//             showBack={data.currentStep > 0}
//             showNext={data.currentStep < getTotalSteps() - 1}
//             nextDisabled={!canProceed()}
//           />
//         </div>
//       )} */}
//       </div>
//     </div>
//   )

// }


// "use client"

// import { useState, useEffect, useCallback } from "react"
// import Image from "next/image"
// import type { QuestionnaireData } from "@/lib/types"
// import {
//   relationshipConcernOptions,
//   livingWithOptions,
//   partnerQuestions,
//   inLawsQuestions,
//   familyQuestions,
// } from "@/lib/questions"
// import {
//   getPartnerRiskLevel,
//   getInLawsRiskLevel,
//   getFamilyRiskLevel,
//   calculatePartnerScoreWithBreakdown,
//   calculateInLawsScoreWithBreakdown,
//   calculateFamilyScoreWithBreakdown,
// } from "@/lib/scoring"
// import { saveToLocalStorage, loadFromLocalStorage, initializeQuestionnaire, clearLocalStorage } from "@/lib/storage"
// import QuestionCard from "@/components/QuestionCard"
// import NavigationButtons from "@/components/NavigationButtons"
// import ProgressBar from "@/components/ProgressBar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"

// export default function QuestionnairePage() {
//   const [data, setData] = useState<QuestionnaireData | null>(null)
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [showResults, setShowResults] = useState(false)

//   const getTotalSteps = useCallback(() => {
//     if (!data) return 10

//     let steps = 7 // Initial steps (0-6)

//     const hasPartner = data.relationshipConcerns.some(
//       (concern) => concern.includes("husband") || concern.includes("partner"),
//     )
//     const hasInLaws = data.relationshipConcerns.includes("My in-laws")
//     const hasFamily =
//       data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

//     if (hasPartner) steps += 1 + partnerQuestions.length + 1 // intro + questions + result
//     if (hasInLaws) steps += 1 + inLawsQuestions.length + 1 // intro + questions + result
//     if (hasFamily) steps += 1 + familyQuestions.length + 1 // intro + questions + result

//     steps += 1 // final summary

//     return steps
//   }, [data])

//   const getSectionKey = useCallback((): string => {
//     console.log("getSectionKey called")
//     if (!data) return ""

//     if (data.currentStep <= 6) return ""

//     const hasPartner = data.relationshipConcerns.some(
//       (concern) => concern.includes("husband") || concern.includes("partner"),
//     )
//     const hasInLaws = data.relationshipConcerns.includes("My in-laws")
//     const hasFamily =
//       data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

//     let stepOffset = 7

//     // Partner section: intro (step 7) + questions (steps 8-34) + result (step 35)
//     if (hasPartner) {
//       const partnerQuestionsStart = stepOffset + 1 // step 8
//       const partnerQuestionsEnd = partnerQuestionsStart + partnerQuestions.length // step 35

//       console.log(
//         "Partner section check - Current step:",
//         data.currentStep,
//         "Questions range:",
//         partnerQuestionsStart,
//         "-",
//         partnerQuestionsEnd - 1,
//       )

//       if (data.currentStep >= partnerQuestionsStart && data.currentStep < partnerQuestionsEnd) {
//         console.log("Current step is within partner section range")
//         return "partnerQuestions"
//       }

//       stepOffset = partnerQuestionsEnd + 1 // step 36
//     }

//     // In-laws section: intro + questions + result
//     if (hasInLaws) {
//       const inLawsQuestionsStart = stepOffset + 1
//       const inLawsQuestionsEnd = inLawsQuestionsStart + inLawsQuestions.length

//       console.log(
//         "In-laws section check - Current step:",
//         data.currentStep,
//         "Questions range:",
//         inLawsQuestionsStart,
//         "-",
//         inLawsQuestionsEnd - 1,
//       )

//       if (data.currentStep >= inLawsQuestionsStart && data.currentStep < inLawsQuestionsEnd) {
//         console.log("Current step is within in-laws section range")
//         return "inLawsQuestions"
//       }

//       stepOffset = inLawsQuestionsEnd + 1
//     }

//     // Family section: intro + questions + result
//     if (hasFamily) {
//       const familyQuestionsStart = stepOffset + 1
//       const familyQuestionsEnd = familyQuestionsStart + familyQuestions.length

//       console.log(
//         "Family section check - Current step:",
//         data.currentStep,
//         "Questions range:",
//         familyQuestionsStart,
//         "-",
//         familyQuestionsEnd - 1,
//       )

//       if (data.currentStep >= familyQuestionsStart && data.currentStep < familyQuestionsEnd) {
//         console.log("Current step is within family section range")
//         return "familyQuestions"
//       }
//     }

//     return ""
//   }, [data])

//   const getCurrentSection = useCallback(() => {
//     console.log("getCurrentSection called")
//     if (!data) return []

//     if (data.currentStep <= 6) return []

//     const hasPartner = data.relationshipConcerns.some(
//       (concern) => concern.includes("husband") || concern.includes("partner"),
//     )
//     const hasInLaws = data.relationshipConcerns.includes("My in-laws")
//     const hasFamily =
//       data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

//     console.log({ hasPartner, hasInLaws, hasFamily })

//     let stepOffset = 7

//     // Partner section: intro (step 7) + questions (steps 8-34) + result (step 35)
//     if (hasPartner) {
//       const partnerIntro = stepOffset // step 7
//       const partnerQuestionsStart = stepOffset + 1 // step 8
//       const partnerQuestionsEnd = partnerQuestionsStart + partnerQuestions.length // step 35
//       const partnerResult = partnerQuestionsEnd // step 35

//       console.log(
//         "Partner section - Intro:",
//         partnerIntro,
//         "Questions:",
//         partnerQuestionsStart,
//         "-",
//         partnerQuestionsEnd - 1,
//         "Result:",
//         partnerResult,
//       )

//       if (data.currentStep >= partnerQuestionsStart && data.currentStep < partnerQuestionsEnd) {
//         return partnerQuestions
//       }

//       stepOffset = partnerQuestionsEnd + 1 // step 36
//     }

//     // In-laws section: intro + questions + result
//     if (hasInLaws) {
//       const inLawsIntro = stepOffset
//       const inLawsQuestionsStart = stepOffset + 1
//       const inLawsQuestionsEnd = inLawsQuestionsStart + inLawsQuestions.length
//       const inLawsResult = inLawsQuestionsEnd

//       console.log(
//         "In-laws section - Intro:",
//         inLawsIntro,
//         "Questions:",
//         inLawsQuestionsStart,
//         "-",
//         inLawsQuestionsEnd - 1,
//         "Result:",
//         inLawsResult,
//       )

//       if (data.currentStep >= inLawsQuestionsStart && data.currentStep < inLawsQuestionsEnd) {
//         return inLawsQuestions
//       }

//       stepOffset = inLawsQuestionsEnd + 1
//     }

//     // Family section: intro + questions + result
//     if (hasFamily) {
//       const familyIntro = stepOffset
//       const familyQuestionsStart = stepOffset + 1
//       const familyQuestionsEnd = familyQuestionsStart + familyQuestions.length
//       const familyResult = familyQuestionsEnd

//       console.log(
//         "Family section - Intro:",
//         familyIntro,
//         "Questions:",
//         familyQuestionsStart,
//         "-",
//         familyQuestionsEnd - 1,
//         "Result:",
//         familyResult,
//       )

//       if (data.currentStep >= familyQuestionsStart && data.currentStep < familyQuestionsEnd) {
//         return familyQuestions
//       }
//     }

//     return []
//   }, [data])

//   const handleNext = () => {
//     if (!data) return

//     updateData({ currentStep: data.currentStep + 1 })
//   }

//   const handleBack = () => {
//     if (!data) return

//     updateData({ currentStep: data.currentStep - 1 })
//   }
//   useEffect(() => {

//     console.log("Data changed:", data)
//     console.log("Current Step:", data?.currentStep)
//     console.log("Total Steps:", getTotalSteps())
//     // log section key and current section
//     console.log("Current Section Key:", getSectionKey())
//     console.log("Current Section Questions:", getCurrentSection())

//     if (data && data.currentStep === getTotalSteps() - 1 && !isSubmitting) {
//       handleSubmit();
//     }
//   }, [data?.currentStep]);
//   // useEffect(() => {
//   //   console.log("Data changed:", data)
//   //   console.log("Current Step:", data?.currentStep)
//   //   console.log("Total Steps:", getTotalSteps())
//   //   console.log("Current Section Key:", getSectionKey())
//   //   console.log("Current Section Questions:", getCurrentSection())

//   //   if (data && data.currentStep === getTotalSteps() - 1 && !isSubmitting) {
//   //     handleSubmit()
//   //   }
//   // }, [data, getTotalSteps, isSubmitting])

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   }, [data?.currentStep])

//   useEffect(() => {
//     const stored = loadFromLocalStorage()
//     if (stored) {
//       setData(stored)
//     } else {
//       setData(initializeQuestionnaire())
//     }
//   }, [])

//   const updateData = (updates: Partial<QuestionnaireData>) => {
//     if (!data) return

//     const newData = { ...data, ...updates }
//     setData(newData)
//     saveToLocalStorage(newData)
//   }

//   const handleAnswer = (questionId: string, answer: boolean | string | string[]) => {
//     console.log("handleAnswer called with:", questionId, answer)
//     if (!data) return

//     const currentSection = getCurrentSection()
//     console.log("Current section:", currentSection)
//     const sectionKey = getSectionKey()
//     console.log("Section key:", sectionKey)

//     updateData({
//       [sectionKey]: {
//         // @ts-ignore
//         ...data[sectionKey as keyof QuestionnaireData],
//         [questionId]: answer,
//       },
//     })
//   }

//   const handleSubAnswer = (subQuestionId: string, answer: boolean | string) => {
//     if (!data) return

//     const sectionKey = getSectionKey()

//     updateData({
//       [sectionKey]: {
//         // @ts-ignore
//         ...data[sectionKey as keyof QuestionnaireData],
//         [subQuestionId]: answer,
//       },
//     })
//   }

//   const calculateResults = () => {
//     console.log("Calculating results...")
//     if (!data) return

//     const results: any = {}
//     const scores: any = {}

//     if (data.relationshipConcerns.some((concern) => concern.includes("husband") || concern.includes("partner"))) {
//       const breakdown = calculatePartnerScoreWithBreakdown(data.partnerQuestions)
//       scores.partner = {
//         total: breakdown.totalScore,
//         questions: breakdown.questions,
//       }
//       results.partner = getPartnerRiskLevel(breakdown.totalScore)
//     }

//     if (data.relationshipConcerns.includes("My in-laws")) {
//       const breakdown = calculateInLawsScoreWithBreakdown(data.inLawsQuestions)
//       scores.inLaws = {
//         total: breakdown.totalScore,
//         questions: breakdown.questions,
//       }
//       results.inLaws = getInLawsRiskLevel(data.inLawsQuestions)
//     }

//     if (data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")) {
//       const breakdown = calculateFamilyScoreWithBreakdown(data.familyQuestions)
//       scores.family = {
//         total: breakdown.totalScore,
//         questions: breakdown.questions,
//       }
//       results.family = getFamilyRiskLevel(data.familyQuestions)
//     }

//     updateData({ results, scores })
//   }

//   const handleSubmit = async () => {
//     if (!data) return

//     console.log("Submitting assessment...")
//     setIsSubmitting(true)

//     try {
//       const response = await fetch("/api/submit-assessment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...data,
//           completedAt: new Date(),
//         }),
//       })

//       if (response.ok) {
//         clearLocalStorage()
//         alert("Assessment submitted successfully!")
//       } else {
//         throw new Error("Failed to submit")
//       }
//     } catch (error) {
//       console.error("Error submitting assessment:", error)
//       alert("Error submitting assessment. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   if (!data) {
//     return (
//       <div className="min-h-screen bg-cream flex justify-center items-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-button mx-auto"></div>
//           <p className="mt-4 text-gray-600 font-montserrat">Loading BSHAPE Assessment...</p>
//         </div>
//       </div>
//     )
//   }

//   const renderStep = () => {
//     switch (data.currentStep) {
//       case 0:
//         // Welcome screen
//         return (
//           <div className="min-h-screen bg-cream flex items-center justify-center py-6 px-4">
//             <div className="bg-white rounded-[2rem] p-10 md:p-16 shadow-lg max-w-4xl w-full">
//               <div className="container-content text-center space-y-8">
//                 <div className="space-y-2">
//                   <h1 className="font-merriweather text-heading-xl text-primary font-bold">BSHAPE</h1>
//                   <p className="font-montserrat text-body-lg text-gray-700 font-medium">
//                     Being Safe, Healthy and Positively Empowered
//                   </p>
//                 </div>

//                 <div className="rounded-xl overflow-hidden shadow-md max-w-md mx-auto">
//                   <Image
//                     src="/images/bshape-logo.jpg"
//                     alt="BSHAPE Logo"
//                     width={350}
//                     height={300}
//                     className="object-cover w-full h-auto"
//                     priority
//                   />
//                 </div>

//                 <div className="space-y-6">
//                   <h2 className="font-merriweather text-heading-lg text-primary font-bold">Welcome to BSHAPE!</h2>
//                   <p className="font-montserrat text-body-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
//                     Everyone deserves to be healthy and safe in their relationships. BSHAPE is here to help you assess
//                     your well-being, explore safety strategies, and connect with resources that can support you.
//                   </p>
//                 </div>

//                 <Button
//                   onClick={handleNext}
//                   className="bg-[#F28132] text-white font-semibold text-lg px-10 py-4 rounded-xl hover:brightness-105 transition"
//                 >
//                   Continue →
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )

//       case 1:
//         return (
//           <div className="card-container">
//             <div className="container-content text-center space-y-6 ">
//               <h2 className="font-merriweather text-heading-lg text-primary font-bold">Recognizing Your Strengths</h2>

//               <div className="space-y-6 max-w-3xl mx-auto text-body-lg text-gray-700 font-montserrat leading-relaxed">
//                 <p>
//                   Acknowledging your abilities and support systems can help you make informed decisions about your
//                   safety and well-being.
//                 </p>
//                 <p>Let's take a moment to focus on what makes you unique and resilient.</p>
//                 <p>Everyone has strengths—qualities that help them overcome challenges and thrive.</p>
//               </div>

//               <div className="relative w-full max-w-md mx-auto h-48">
//                 <Image src="/images/tree-illustration.jpg" alt="Tree illustration" fill className="object-contain" />
//               </div>

//               <p className="font-montserrat text-body-md text-gray-700 max-w-3xl mx-auto leading-relaxed">
//                 This conversation is about recognizing those strengths and how they contribute to your overall health,
//                 safety, and well-being.
//               </p>

//               <NavigationButtons
//                 onBack={data.currentStep > 0 ? handleBack : undefined}
//                 onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//                 showBack={data.currentStep > 0}
//                 showNext={data.currentStep < getTotalSteps() - 1}
//                 nextDisabled={!canProceed()}
//               />
//             </div>
//           </div>
//         )

//       case 2:
//         return (
//           <div className="card-container">
//             <div className="container-content text-center space-y-6 ">
//               <h2 className="font-merriweather text-heading-lg text-primary font-bold ">Personalized Help for You</h2>

//               <p className="font-montserrat text-body-lg text-gray-700 max-w-2xl mx-auto leading-relaxed space-y-6">
//                 In the next sections, I'll help you reflect on your relationships and support you on your path to
//                 health, safety, and well-being.
//               </p>

//               <div className="relative max-w-3xl mx-auto flex flex-col items-center space-y-6">
//                 <div className="relative mx-auto w-full max-w-md h-[22rem]">
//                   <Image src="/images/woman-speaking.jpg" alt="Woman speaking" fill className="object-contain" />
//                 </div>
//               </div>
//             </div>

//             <NavigationButtons
//               onBack={data.currentStep > 0 ? handleBack : undefined}
//               onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//               showBack={data.currentStep > 0}
//               showNext={data.currentStep < getTotalSteps() - 1}
//               nextDisabled={!canProceed()}
//             />
//           </div>
//         )

//       case 3:
//         return (
//           <div className="card-container">
//             <div className="container-content text-center  ">
//               <div className="text-center space-y-6">
//                 <h2 className="font-merriweather text-heading-lg text-gray-900 font-bold">
//                   Let's start by talking about your relationships.
//                 </h2>

//                 <p className="font-montserrat text-body-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
//                   Everyone's situation is different, and understanding your concerns is the first step toward finding
//                   the right support.
//                 </p>

//                 <h3 className="font-merriweather text-xl text-primary font-bold">
//                   Which relationship(s) are you concerned about?
//                 </h3>

//                 <p className="font-montserrat text-body-md text-gray-700 font-medium">(Select all that apply)</p>
//               </div>

//               <QuestionCard
//                 question={{
//                   id: "relationship-concerns",
//                   text: "",
//                   type: "checkbox",
//                   options: relationshipConcernOptions,
//                 }}
//                 answer={data.relationshipConcerns}
//                 onAnswer={(_, answer) => updateData({ relationshipConcerns: answer as string[] })}
//               />
//             </div>
//             <NavigationButtons
//               onBack={data.currentStep > 0 ? handleBack : undefined}
//               onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//               showBack={data.currentStep > 0}
//               showNext={data.currentStep < getTotalSteps() - 1}
//               nextDisabled={!canProceed()}
//             />
//           </div>
//         )

//       case 4:
//         return (
//           <div className="card-container">
//             <div className="container-content text-center  ">
//               <div className="text-center space-y-6">
//                 <h2 className="font-merriweather text-heading-lg text-primary font-bold">Who do you live with?</h2>
//                 <p className="font-montserrat text-body-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
//                   Next, understanding <b>your living situation</b> can help us better understand your circumstances.
//                 </p>
//               </div>

//               <QuestionCard
//                 question={{
//                   id: "living-with",
//                   text: "",
//                   type: "radio",
//                   options: livingWithOptions,
//                 }}
//                 answer={data.livingWith}
//                 onAnswer={(_, answer) => updateData({ livingWith: answer as string })}
//               />
//             </div>
//             <NavigationButtons
//               onBack={data.currentStep > 0 ? handleBack : undefined}
//               onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//               showBack={data.currentStep > 0}
//               showNext={data.currentStep < getTotalSteps() - 1}
//               nextDisabled={!canProceed()}
//             />
//           </div>
//         )

//       case 5:
//         return (
//           <div className="card-container">
//             <div className="container-content space-y-8 py-12">
//               <p className="font-montserrat text-body-lg text-gray-700 max-w-3xl mx-auto leading-relaxed text-center">
//                 Let's explore your thoughts about <b>your current living situation.</b>
//                 {data.livingWith === "I live alone" &&
//                   " Or, if you're living alone, would you like to continue living alone?"}
//               </p>
//               <div className="text-center space-y-6">
//                 <h2 className="font-merriweather text-heading-md text-primary font-bold">
//                   Would you like to continue living with the people you're currently living with?
//                 </h2>
//               </div>

//               <QuestionCard
//                 question={{
//                   id: "living-preference",
//                   text: "",
//                   type: "radio",
//                   options: [
//                     "Yes, I would like to continue living with people in my household or to continue living alone",
//                     "No, I would prefer a change in my living situation",
//                   ],
//                 }}
//                 answer={data.livingPreference}
//                 onAnswer={(_, answer) => updateData({ livingPreference: answer as string })}
//               />

//               {data.livingPreference === "No, I would prefer a change in my living situation" && (
//                 <div className="mt-8">
//                   <QuestionCard
//                     question={{
//                       id: "living-change-description",
//                       text: "Please describe how you would like to change your living situation:",
//                       type: "text",
//                     }}
//                     answer={data.livingChangeDescription || ""}
//                     onAnswer={(_, answer) => updateData({ livingChangeDescription: answer as string })}
//                   />
//                 </div>
//               )}
//             </div>
//             <NavigationButtons
//               onBack={data.currentStep > 0 ? handleBack : undefined}
//               onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//               showBack={data.currentStep > 0}
//               showNext={data.currentStep < getTotalSteps() - 1}
//               nextDisabled={!canProceed()}
//             />
//           </div>
//         )

//       case 6:
//         return (
//           <div className="card-container">
//             <div className="container-content text-center space-y-8 py-12">
//               <div className="space-y-6">
//                 <h2 className="font-merriweather text-heading-lg text-primary font-bold">Relationship Warning Signs</h2>
//               </div>

//               <div className="text-left max-w-4xl mx-auto space-y-6">
//                 <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-button">
//                   <h3 className="font-merriweather text-xl font-bold text-primary mb-3">Your well-being matters!</h3>
//                   <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
//                     Unhealthy relationships can take a toll on your health and happiness. We're here to offer strategies
//                     and resources to help you stay safe and supported.
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
//                     When people hear the word <b>"abuse"</b>, they often think of physical violence, like hitting. But
//                     abuse <b>can take many forms</b>—emotional, verbal, financial, and more.
//                   </p>
//                   <p className="font-montserrat text-body-md text-red-600 font-semibold">
//                     No matter the form, abuse is never okay.
//                   </p>
//                   <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
//                     <b> It can be difficult to recognize and even harder to deal with</b>, but you don't have to go
//                     through it alone.
//                   </p>

//                   <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
//                     <p className="font-montserrat text-body-md text-green-700 font-semibold leading-relaxed">
//                       A healthy relationship should make you feel respected, valued, and good about yourself—you deserve
//                       that!
//                     </p>
//                   </div>

//                   <div className="text-center pt-4">
//                     <p className="font-montserrat text-body-md text-gray-700 leading-relaxed">
//                       Now, let's take a moment to check-in.
//                     </p>
//                     <p className="font-merriweather text-lg font-semibold text-primary mt-2">
//                       Are you noticing any red flags or warning signs in your relationship?
//                     </p>
//                     <div className="relative w-32 h-32 mx-auto">
//                       <Image src="/images/red-flag.jpg" alt="Red flag warning" fill className="object-contain" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <NavigationButtons
//               onBack={data.currentStep > 0 ? handleBack : undefined}
//               onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//               showBack={data.currentStep > 0}
//               showNext={data.currentStep < getTotalSteps() - 1}
//               nextDisabled={!canProceed()}
//             />
//           </div>
//         )

//       default:
//         // Handle questionnaire sections and results
//         console.log("Default case for step:", data.currentStep)
//         const hasPartner = data.relationshipConcerns.some(
//           (concern) => concern.includes("husband") || concern.includes("partner"),
//         )
//         const hasInLaws = data.relationshipConcerns.includes("My in-laws")
//         const hasFamily =
//           data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

//         console.log("Has partner:", hasPartner, "Has in-laws:", hasInLaws, "Has family:", hasFamily)

//         let stepOffset = 7

//         // Partner questionnaire intro (step 7)
//         if (hasPartner && data.currentStep === stepOffset) {
//           console.log("Rendering partner intro at step:", data.currentStep)
//           return (
//             <div className="card-container">
//               <div className="text-center space-y-6">
//                 <div className="space-y-4">
//                   <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
//                     👉 Every woman's situation is unique.
//                   </h2>
//                   <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
//                     These following questions will help me better understand what you're going through. The more you
//                     share, the more personalized support I can offer.
//                   </p>
//                   <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
//                     Several risk factors have been associated with increased risk of severe violence injuries or
//                     homicides of immigrant women in violent relationships.
//                   </p>
//                   <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
//                     We cannot predict what will happen in your case, but we would like you to be aware of the danger of
//                     homicide in situations of abuse and for you to see how many of the risk factors apply to your
//                     situation.
//                   </p>
//                   <p className="text-base font-semibold text-gray-900">
//                     The following questions were designed by experts to help identify unhealthy patterns. Please answer
//                     "Yes" or "No."
//                   </p>
//                 </div>
//               </div>
//               <NavigationButtons
//                 onBack={data.currentStep > 0 ? handleBack : undefined}
//                 onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//                 showBack={data.currentStep > 0}
//                 showNext={data.currentStep < getTotalSteps() - 1}
//                 nextDisabled={!canProceed()}
//               />
//             </div>
//           )
//         }

//         stepOffset += hasPartner ? 1 : 0

//         // Partner questions (steps 8-34)
//         if (hasPartner && data.currentStep >= stepOffset && data.currentStep < stepOffset + partnerQuestions.length) {
//           const questionIndex = data.currentStep - stepOffset
//           const question = partnerQuestions[questionIndex]
//           const answer = data.partnerQuestions[question.id]
//           const subAnswer = question.subQuestion ? data.partnerQuestions[question.subQuestion.id] : undefined

//           console.log("Rendering partner question", questionIndex + 1, "at step:", data.currentStep)

//           return (
//             <div className="card-container">
//               <div className="text-center">
//                 <h4 className="font-merriweather text-heading-lg text-primary font-bold">
//                   About your Husband or Partner
//                 </h4>

//                 <QuestionCard
//                   question={question}
//                   answer={answer}
//                   onAnswer={handleAnswer}
//                   showSubQuestion={question.subQuestion && answer === true}
//                   subAnswer={subAnswer}
//                   onSubAnswer={handleSubAnswer}
//                 />
//               </div>
//               <NavigationButtons
//                 onBack={data.currentStep > 0 ? handleBack : undefined}
//                 onNext={data.currentStep < getTotalSteps() - 1 ? handleNext : undefined}
//                 showBack={data.currentStep > 0}
//                 showNext={data.currentStep < getTotalSteps() - 1}
//                 nextDisabled={!canProceed()}
//               />
//             </div>
//           )
//         }

//         stepOffset += hasPartner ? partnerQuestions.length : 0

//         // Partner results (step 35)
//         if (hasPartner && data.currentStep === stepOffset) {
//           console.log("Rendering partner results at step:", data.currentStep)

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
//             <div className="card-container space-y-8">
//               <div className="space-y-2 text-center">
//                 <p className="font-merriweather text-heading-lg text-gray-900 font-bold">
//                   Based on your answers, you scored:
//                 </p>
//                 <h3 className="font-merriweather text-heading-xl text-primary font-bold">{riskTitles[riskLevel]}</h3>
//                 <p className="font-montserrat text-body-md  text-gray-900 font-bold">{riskDescriptions[riskLevel]}</p>
//               </div>

//               <Card className="max-w-2xl mx-auto">
//                 <CardContent className="space-y-6 p-8">
//                   <div className="text-left space-y-4">
//                     <div>
//                       <h4 className="font-merriweather text-base font-semibold text-gray-900 mb-3">What you can do:</h4>
//                       <ul className="space-y-2 list-disc list-inside">
//                         {riskActions[riskLevel].map((action, i) => (
//                           <li key={i} className="font-montserrat text-sm text-gray-700">
//                             {action}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                   <div className="relative w-full max-w-sm mx-auto h-32">
//                     <Image
//                       src={riskImages[riskLevel] || "/placeholder.svg"}
//                       alt={`${riskLevel} risk level`}
//                       fill
//                       className="object-contain"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <NavigationButtons
//                 onBack={handleBack}
//                 onNext={handleNext}
//                 showBack
//                 showNext
//                 nextDisabled={!canProceed()}
//               />
//             </div>
//           )
//         }

//         stepOffset += hasPartner ? 1 : 0

//         // In-laws questionnaire intro
//         if (hasInLaws && data.currentStep === stepOffset) {
//           console.log("Rendering in-laws intro at step:", data.currentStep)
//           return (
//             <div className="card-container">
//               <div className="text-center space-y-6">
//                 <div className="space-y-4">
//                   <h2 className="text-2xl md:text-3xl font-bold text-gray-900">About your In-Laws</h2>
//                   <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
//                     The following questions ask about experiences of abuse or harm from in-laws—such as your
//                     mother-in-law, father-in-law, siblings-in-law, or other relatives through marriage.
//                   </p>
//                   <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
//                     These questions are meant to understand your safety and well-being in your current or past in-law
//                     relationships.
//                   </p>
//                 </div>
//               </div>
//               <NavigationButtons
//                 onBack={handleBack}
//                 onNext={handleNext}
//                 showBack
//                 showNext
//                 nextDisabled={!canProceed()}
//               />
//             </div>
//           )
//         }

//         stepOffset += hasInLaws ? 1 : 0

//         // In-laws questions
//         if (hasInLaws && data.currentStep >= stepOffset && data.currentStep < stepOffset + inLawsQuestions.length) {
//           const questionIndex = data.currentStep - stepOffset
//           const question = inLawsQuestions[questionIndex]
//           const answer = data.inLawsQuestions[question.id]
//           const subAnswer = question.subQuestion ? data.inLawsQuestions[question.subQuestion.id] : undefined

//           console.log("Rendering in-laws question", questionIndex + 1, "at step:", data.currentStep)

//           return (
//             <div className="card-container">
//               <div className="text-center">
//                 <h4 className="font-merriweather text-heading-lg text-primary font-bold">About Your In-Laws</h4>

//                 <QuestionCard
//                   question={question}
//                   answer={answer}
//                   onAnswer={handleAnswer}
//                   showSubQuestion={question.subQuestion && answer === true}
//                   subAnswer={subAnswer}
//                   onSubAnswer={handleSubAnswer}
//                 />
//               </div>
//               <NavigationButtons
//                 onBack={handleBack}
//                 onNext={handleNext}
//                 showBack
//                 showNext
//                 nextDisabled={!canProceed()}
//               />
//             </div>
//           )
//         }

//         stepOffset += hasInLaws ? inLawsQuestions.length : 0

//         // In-laws results
//         if (hasInLaws && data.currentStep === stepOffset) {
//           console.log("Rendering in-laws results at step:", data.currentStep)

//           if (!data.results.inLaws) {
//             calculateResults()
//             return <div>Calculating results...</div>
//           }

//           const riskLevel = data.results.inLaws
//           const riskImages = {
//             some: "/images/recognize-abuse.jpg",
//             high: "/images/seek-immediately.jpg",
//           }

//           return (
//             <div className="card-container space-y-8">
//               <div className="space-y-2 text-center">
//                 <p className="font-merriweather text-heading-lg text-gray-900 font-bold">
//                   Based on your answers, you may be at:
//                 </p>
//                 <h3 className="font-merriweather text-heading-xl text-primary font-bold">
//                   {riskLevel === "some" ? "Some Level of Risk" : "High Risk"}
//                 </h3>
//               </div>

//               <Card className="max-w-2xl mx-auto">
//                 <CardContent className="space-y-6 p-8">
//                   <div className="relative w-full max-w-sm mx-auto h-32">
//                     <Image
//                       src={riskImages[riskLevel] || "/placeholder.svg"}
//                       alt={`${riskLevel} risk level`}
//                       fill
//                       className="object-contain"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <NavigationButtons
//                 onBack={handleBack}
//                 onNext={handleNext}
//                 showBack
//                 showNext
//                 nextDisabled={!canProceed()}
//               />
//             </div>
//           )
//         }

//         stepOffset += hasInLaws ? 1 : 0

//         // Family questionnaire intro
//         if (hasFamily && data.currentStep === stepOffset) {
//           console.log("Rendering family intro at step:", data.currentStep)
//           return (
//             <div className="card-container">
//               <div className="text-center space-y-6">
//                 <div className="space-y-4">
//                   <h2 className="text-2xl md:text-3xl font-bold text-gray-900">About Other Family Members</h2>
//                   <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
//                     The following questions ask about experiences of abuse or harm from family members other than a
//                     partner or in-laws—such as parents, siblings, aunts, uncles, cousins, or other relatives.
//                   </p>
//                   <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
//                     These questions are meant to help understand your experiences and support your safety and
//                     well-being.
//                   </p>
//                 </div>
//               </div>
//               <NavigationButtons
//                 onBack={handleBack}
//                 onNext={handleNext}
//                 showBack
//                 showNext
//                 nextDisabled={!canProceed()}
//               />
//             </div>
//           )
//         }

//         stepOffset += hasFamily ? 1 : 0

//         // Family questions
//         if (hasFamily && data.currentStep >= stepOffset && data.currentStep < stepOffset + familyQuestions.length) {
//           const questionIndex = data.currentStep - stepOffset
//           const question = familyQuestions[questionIndex]
//           const answer = data.familyQuestions[question.id]
//           const subAnswer = question.subQuestion ? data.familyQuestions[question.subQuestion.id] : undefined

//           console.log("Rendering family question", questionIndex + 1, "at step:", data.currentStep)

//           return (
//             <div className="card-container">
//               <div className="text-center">
//                 <h4 className="font-merriweather text-heading-lg text-primary font-bold">About Other Family Members</h4>

//                 <QuestionCard
//                   question={question}
//                   answer={answer}
//                   onAnswer={handleAnswer}
//                   showSubQuestion={question.subQuestion && answer === true}
//                   subAnswer={subAnswer}
//                   onSubAnswer={handleSubAnswer}
//                 />
//               </div>
//               <NavigationButtons
//                 onBack={handleBack}
//                 onNext={handleNext}
//                 showBack
//                 showNext
//                 nextDisabled={!canProceed()}
//               />
//             </div>
//           )
//         }

//         stepOffset += hasFamily ? familyQuestions.length : 0

//         // Family results
//         if (hasFamily && data.currentStep === stepOffset) {
//           console.log("Rendering family results at step:", data.currentStep)

//           if (!data.results.family) {
//             calculateResults()
//             return <div>Calculating results...</div>
//           }

//           const riskLevel = data.results.family
//           const riskImages = {
//             some: "/images/recognize-abuse.jpg",
//             high: "/images/seek-immediately.jpg",
//           }

//           return (
//             <div className="card-container space-y-8">
//               <div className="space-y-2 text-center">
//                 <p className="font-merriweather text-heading-lg text-gray-900 font-bold">
//                   Based on your answers, you may be at:
//                 </p>
//                 <h3 className="font-merriweather text-heading-xl text-primary font-bold">
//                   {riskLevel === "some" ? "Some Level of Risk" : "High Risk"}
//                 </h3>
//               </div>

//               <Card className="max-w-2xl mx-auto">
//                 <CardContent className="space-y-6 p-8">
//                   <div className="relative w-full max-w-sm mx-auto h-32">
//                     <Image
//                       src={riskImages[riskLevel] || "/placeholder.svg"}
//                       alt={`${riskLevel} risk level`}
//                       fill
//                       className="object-contain"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <NavigationButtons
//                 onBack={handleBack}
//                 onNext={handleNext}
//                 showBack
//                 showNext
//                 nextDisabled={!canProceed()}
//               />
//             </div>
//           )
//         }

//         stepOffset += hasFamily ? 1 : 0

//         // Final summary page
//         const totalSteps = getTotalSteps()
//         if (data.currentStep === totalSteps - 1) {
//           console.log("Rendering final summary at step:", data.currentStep)

//           const riskImages = {
//             variable: "/images/stay-alert.jpg",
//             moderate: "/images/be-alert.jpg",
//             high: "/images/dont-wait.jpg",
//             extreme: "/images/seek-immediately.jpg",
//           }

//           return (
//             <div className="card-container space-y-8">
//               <div className="text-center space-y-2">
//                 <h2 className="font-merriweather text-4xl text-primary font-bold">Summary of Your Risk Assessment</h2>
//                 <p className="font-montserrat text-body-md text-gray-700 max-w-3xl mx-auto">
//                   Below are the current risk assessments for the relationships you've expressed concerns about.
//                 </p>
//               </div>

//               <div className="divide-y divide-gray-200 space-y-8">
//                 {data.results.partner && (
//                   <div>
//                     <h3 className="font-merriweather text-xl font-semibold text-gray-900 mb-2">Husband or partner:</h3>
//                     <p className="font-montserrat text-body-md text-gray-700">
//                       Based on your responses, you may be at:
//                     </p>

//                     <section className="pt-6 text-center">
//                       <div className="mt-4 flex flex-col items-center ">
//                         <span className="font-montserrat text-4xl text-primary font-bold capitalize">
//                           {data.results.partner} Risk
//                         </span>

//                         <div className="relative w-48 h-32">
//                           <Image
//                             src={riskImages[data.results.partner] || "/placeholder.svg"}
//                             alt={`${data.results.partner} risk`}
//                             fill
//                             className="object-contain"
//                           />
//                         </div>
//                       </div>
//                     </section>
//                   </div>
//                 )}

//                 {data.results.inLaws && (
//                   <section className="pt-6">
//                     <h3 className="font-merriweather text-xl font-semibold text-gray-900 mb-2">In-laws:</h3>
//                     <p className="font-montserrat text-body-md text-gray-700 mb-4">
//                       Based on your responses, you may be at:{" "}
//                       <strong className="text-2xl text-primary capitalize">
//                         {data.results.inLaws === "some" ? "Some Level of" : "High"} Risk
//                       </strong>
//                     </p>
//                   </section>
//                 )}

//                 {data.results.family && (
//                   <section className="pt-6 pb-6">
//                     <h3 className="font-merriweather text-xl font-semibold text-gray-900 mb-2">
//                       Other Family Members:
//                     </h3>
//                     <p className="font-montserrat text-body-md text-gray-700">
//                       Based on your responses, you may be at:{" "}
//                       <strong className="text-2xl text-primary capitalize">
//                         {data.results.family === "some" ? "Some Level of" : "High"} Risk
//                       </strong>
//                     </p>
//                   </section>
//                 )}
//               </div>

//               <div className="text-center space-y-4">
//                 <p className="font-montserrat text-body-md text-gray-700 max-w-2xl mx-auto">
//                   These results reflect where you are now, but your story is still unfolding. Recognizing where you are
//                   today is progress towards where you want to be.
//                 </p>

//                 <p className="font-montserrat text-body-md text-gray-700 max-w-2xl mx-auto">
//                   You are the expert on your life, and we're here to walk with you. If you're ready to create a
//                   personalized safety plan, click below and the BSHAPE team will guide you through it.
//                 </p>

//                 <div className="space-y-6 text-center">
//                   <button
//                     onClick={handleSubmit}
//                     disabled={isSubmitting}
//                     className="btn–heartbeat mx-auto bg-[#FFF1C7] text-black font-semibold font-montserrat text-lg px-4 py-2 rounded-3xl border-4 border-[#FE6901] hover:bg-[#FFE7A2] transition whitespace-normal text-center max-w-[16rem]"
//                   >
//                     {isSubmitting ? "Submitting..." : "Create a Safety Plan that Works for Me"}
//                   </button>

//                   <div className="space-y-1">
//                     <p className="text-body-md font-montserrat text-gray-900">You are not alone, we are here for you</p>
//                     <p className="text-body-md font-montserrat text-gray-900">You can contact us at</p>
//                     <p className="text-2xl font-bryndan text-primary font-bold">bshape@jhu.edu</p>
//                   </div>
//                 </div>
//               </div>

//               <NavigationButtons
//                 onBack={handleBack}
//                 showBack={true}
//                 showNext={true}
//                 className="text-1xl"
//                 nextText="Create my Safety Plan"
//                 nextLink="http://localhost:3001"
//               />
//             </div>
//           )
//         }

//         // Fallback
//         return (
//           <div className="card-container">
//             <div className="text-center">
//               <p>Step {data.currentStep} not implemented yet</p>
//               <p>
//                 Debug info: hasPartner={hasPartner.toString()}, hasInLaws={hasInLaws.toString()}, hasFamily=
//                 {hasFamily.toString()}
//               </p>
//             </div>
//             <NavigationButtons onBack={handleBack} onNext={handleNext} showBack showNext nextDisabled={!canProceed()} />
//           </div>
//         )
//     }
//   }

//   const canProceed = () => {
//     switch (data.currentStep) {
//       case 3:
//         return data.relationshipConcerns.length > 0
//       case 4:
//         return data.livingWith !== ""
//       case 5:
//         return (
//           data.livingPreference !== "" &&
//           (data.livingPreference !== "No, I would prefer a change in my living situation" ||
//             data.livingChangeDescription)
//         )
//       default:
//         const section = getCurrentSection()
//         const sectionKey = getSectionKey() as keyof QuestionnaireData

//         // If we're not in a questionnaire section, allow proceeding
//         if (section.length === 0 || !sectionKey) {
//           return true
//         }

//         // Calculate which question we're on within the current section
//         const hasPartner = data.relationshipConcerns.some(
//           (concern) => concern.includes("husband") || concern.includes("partner"),
//         )
//         const hasInLaws = data.relationshipConcerns.includes("My in-laws")
//         const hasFamily =
//           data.relationshipConcerns.includes("Other family members") || data.relationshipConcerns.includes("Other")

//         let stepOffset = 7

//         // Determine the question index based on current section
//         let questionIndex = -1

//         if (hasPartner && sectionKey === "partnerQuestions") {
//           const partnerQuestionsStart = stepOffset + 1
//           questionIndex = data.currentStep - partnerQuestionsStart
//         } else if (hasInLaws && sectionKey === "inLawsQuestions") {
//           stepOffset += hasPartner ? 1 + partnerQuestions.length + 1 : 0
//           const inLawsQuestionsStart = stepOffset + 1
//           questionIndex = data.currentStep - inLawsQuestionsStart
//         } else if (hasFamily && sectionKey === "familyQuestions") {
//           stepOffset += hasPartner ? 1 + partnerQuestions.length + 1 : 0
//           stepOffset += hasInLaws ? 1 + inLawsQuestions.length + 1 : 0
//           const familyQuestionsStart = stepOffset + 1
//           questionIndex = data.currentStep - familyQuestionsStart
//         }

//         if (questionIndex < 0 || questionIndex >= section.length) {
//           return true
//         }

//         const question = section[questionIndex]
//         const answers = (data as any)[sectionKey]
//         const main = answers[question.id]

//         // Check if main question is answered
//         if (main === undefined) {
//           return false
//         }

//         // Check sub-question if applicable
//         if (question.subQuestion && main === true) {
//           const sub = answers[question.subQuestion.id]
//           return sub !== undefined
//         }

//         return true
//     }
//   }

//   return (
//     <div className="min-h-screen bg-cream flex flex-col items-center">
//       <div className="w-full max-w-[90%] sm:max-w-xl md:max-w-2xl lg:max-w-4xl flex flex-col flex-1">
//         {data.currentStep > 0 && <ProgressBar currentStep={data.currentStep + 1} totalSteps={getTotalSteps()} />}

//         <div className="flex-1">{renderStep()}</div>
//       </div>
//     </div>
//   )
// }


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
    if (!data) return
    const newData = { ...data, ...updates }
    setData(newData)
    saveToLocalStorage(newData)
  }

  const handleAnswer = (questionId: string, answer: boolean | string | string[]) => {
    if (!data) return
    const sectionKey = getSectionKey()
    updateData({
      [sectionKey]: {
        // @ts-ignore
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

    // Partner section: intro (1) + questions (27) + results (1) = 29 steps
    if (hasPartner) {
      const partnerStart = stepOffset
      const partnerQuestionsStart = partnerStart + 1
      const partnerQuestionsEnd = partnerQuestionsStart + partnerQuestions.length

      if (data.currentStep >= partnerQuestionsStart && data.currentStep < partnerQuestionsEnd) {
        return partnerQuestions
      }
      stepOffset = partnerQuestionsEnd + 1 // +1 for results page
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
      stepOffset = partnerQuestionsEnd + 1
    }

    // In-laws section
    if (hasInLaws) {
      const inLawsStart = stepOffset
      const inLawsQuestionsStart = inLawsStart + 1
      const inLawsQuestionsEnd = inLawsQuestionsStart + inLawsQuestions.length

      if (data.currentStep >= inLawsQuestionsStart && data.currentStep < inLawsQuestionsEnd) {
        return "inLawsQuestions"
      }
      stepOffset = inLawsQuestionsEnd + 1
    }

    // Family section
    if (hasFamily) {
      const familyStart = stepOffset
      const familyQuestionsStart = familyStart + 1
      const familyQuestionsEnd = familyQuestionsStart + familyQuestions.length

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

    if (hasPartner) steps += 1 + partnerQuestions.length + 1 // intro + questions + results
    if (hasInLaws) steps += 1 + inLawsQuestions.length + 1 // intro + questions + results
    if (hasFamily) steps += 1 + familyQuestions.length + 1 // intro + questions + results

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
          const question = inLawsQuestions[questionIndex]
          const answer = data.inLawsQuestions[question.id]
          const subAnswer = question.subQuestion ? data.inLawsQuestions[question.subQuestion.id] : undefined

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
            some: "Based on your responses, you may be experiencing some level of risk from your in-laws.",
            high: "Based on your responses, you may be at high risk from your in-laws.",
          }

          return (
            <div className="card-container space-y-8">
              <div className="space-y-2 text-center">
                <p className="font-merriweather text-heading-lg text-gray-900 font-bold">In-Laws Risk Assessment:</p>
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

          const riskImages = {
            variable: "/images/stay-alert.jpg",
            moderate: "/images/be-alert.jpg",
            high: "/images/dont-wait.jpg",
            extreme: "/images/seek-immediately.jpg",
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
                            src={riskImages[data.results.partner] || "/placeholder.svg"}
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
                      <strong className="text-2xl text-primary capitalize">{data.results.inLaws} Risk</strong>
                    </p>
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

        if (hasPartner && sectionKey === "partnerQuestions") {
          const partnerStart = stepOffset + 1
          questionIndex = data.currentStep - partnerStart
        } else {
          stepOffset += hasPartner ? 1 + partnerQuestions.length + 1 : 0
          if (hasInLaws && sectionKey === "inLawsQuestions") {
            const inLawsStart = stepOffset + 1
            questionIndex = data.currentStep - inLawsStart
          } else {
            stepOffset += hasInLaws ? 1 + inLawsQuestions.length + 1 : 0
            if (hasFamily && sectionKey === "familyQuestions") {
              const familyStart = stepOffset + 1
              questionIndex = data.currentStep - familyStart
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
