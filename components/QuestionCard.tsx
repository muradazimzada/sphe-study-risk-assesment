"use client"

import type { Question } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import NavigationButtons from "./NavigationButtons"

interface QuestionCardProps {
  question: Question
  answer: boolean | string | string[] | undefined
  onAnswer: (questionId: string, answer: boolean | string | string[]) => void
  showSubQuestion?: boolean
  subAnswer?: boolean | string
  onSubAnswer?: (subQuestionId: string, answer: boolean | string) => void
}

export default function QuestionCard({
  question,
  answer,
  onAnswer,
  showSubQuestion,
  subAnswer,
  onSubAnswer,
}: QuestionCardProps) {
  { console.log("loggong answer ", answer) }

  const handleYesNoAnswer = (value: boolean) => {
    onAnswer(question.id, value)
  }

  const handleCheckboxAnswer = (option: string, checked: boolean) => {
    const currentAnswers = Array.isArray(answer) ? answer : []
    if (checked) {
      onAnswer(question.id, [...currentAnswers, option])
    } else {
      onAnswer(
        question.id,
        currentAnswers.filter((a) => a !== option),
      )
    }
  }

  const handleRadioAnswer = (value: string) => {
    onAnswer(question.id, value)
  }

  const handleTextAnswer = (value: string) => {
    onAnswer(question.id, value)
  }


  return (
    <Card className="w-full max-w-3xl mx-auto bg-white shadow-lg border-0 rounded-2xl">
      <CardContent className="p-6 md:p-8">
        <div className="space-y-6">
          {question.text && (
            <h3 className="question-title">{question.text}</h3>
          )}

          {question.type === "yes-no" && (
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto pt-4">
              <Button
                variant={answer == true ? "default" : "outline"}
                onClick={() => handleYesNoAnswer(true)}
                className={`flex-1 py-4 text-lg font-semibold ${answer === true
                  ? "btn-primary"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  }`}
              >
                Yes
              </Button>
              <Button
                variant={answer == false ? "default" : "outline"}
                onClick={() => handleYesNoAnswer(false)}
                className={`flex-1 py-4 text-lg font-semibold ${answer === false
                  ? "btn-primary"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  }`}
              >
                No
              </Button>
            </div>
          )}

          {question.type === "checkbox" && question.options && (
            <div className="space-y-3 max-w-2xl mx-auto pt-4">
              {question.options.map((option) => (
                <div
                  key={option}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <Checkbox
                    id={`${question.id}-${option}`}
                    checked={Array.isArray(answer) && answer.includes(option)}
                    onCheckedChange={(checked) => handleCheckboxAnswer(option, checked as boolean)}
                    className="mt-1 data-[state=checked]:bg-button data-[state=checked]:border-button rounded-md"
                  />
                  <Label
                    htmlFor={`${question.id}-${option}`}
                    className="text-base font-montserrat leading-relaxed cursor-pointer flex-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {question.type === "radio" && question.options && (
            <RadioGroup
              value={answer as string}
              onValueChange={handleRadioAnswer}
              className="space-y-3 max-w-2xl mx-auto pt-4"
            >
              {question.options.map((option) => (
                <div
                  key={option}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <RadioGroupItem
                    value={option}
                    id={`${question.id}-${option}`}
                    className="mt-1 data-[state=checked]:bg-button data-[state=checked]:border-button"
                  />
                  <Label
                    htmlFor={`${question.id}-${option}`}
                    className="text-base font-montserrat leading-relaxed cursor-pointer flex-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === "text" && (
            <div className="pt-4">
              <Textarea
                value={(answer as string) || ""}
                onChange={(e) => handleTextAnswer(e.target.value)}
                placeholder="Please describe..."
                className="min-h-[120px] text-base font-bryndan border-2 border-gray-300 focus:border-button focus:ring-button rounded-xl"
              />
            </div>
          )}
          {showSubQuestion && question.subQuestion && onSubAnswer && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 max-w-xl mx-auto text-center space-y-6">

              {/* Sub-question Text */}
              <h4 className="question-title text-lg font-bold text-gray-900">
                {question.subQuestion.text}
              </h4>

              {/* Yes/No Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={() => onSubAnswer(question.subQuestion!.id, true)}
                  className={`flex-1 sm:max-w-[140px] py-3 font-semibold ${subAnswer === true
                    ? "btn-primary"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  Yes
                </Button>
                <Button
                  onClick={() => onSubAnswer(question.subQuestion!.id, false)}
                  className={`flex-1 sm:max-w-[140px] py-3 font-semibold ${subAnswer === false
                    ? "btn-primary"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  No
                </Button>
              </div>
            </div>
          )}

          {/* {showSubQuestion && question.subQuestion && onSubAnswer && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="question-title space-y-3">{question.subQuestion.text}</h4>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                <Button
                  variant={subAnswer === true ? "default" : "outline"}
                  onClick={() => onSubAnswer(question.subQuestion!.id, true)}
                  className={`flex-1 py-3 font-semibold ${subAnswer === true
                    ? "btn-primary"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  Yes
                </Button>
                <Button
                  variant={subAnswer === false ? "default" : "outline"}
                  onClick={() => onSubAnswer(question.subQuestion!.id, false)}
                  className={`flex-1 py-3 font-semibold ${subAnswer === false
                    ? "btn-primary"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  No
                </Button>
              </div>
            </div>
          )} */}
        </div>
      </CardContent>

    </Card>
  )
}
