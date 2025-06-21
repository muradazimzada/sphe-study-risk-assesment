"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface NavigationButtonsProps {
  onBack?: () => void
  onNext?: () => void
  showBack?: boolean
  showNext?: boolean
  nextDisabled?: boolean
  nextText?: string
  backText?: string
}

export default function NavigationButtons({
  onBack,
  onNext,
  showBack = true,
  showNext = true,
  nextDisabled = false,
  nextText = "Continue",
  backText = "Back",
}: NavigationButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12 pt-8">
      {showBack ? (
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto bg-white text-gray-700 border-gray-300 hover:bg-gray-50 font-montserrat font-medium px-6 py-3"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {backText}
        </Button>
      ) : (
        <div />
      )}

      {showNext && (
        <Button
          onClick={onNext}
          disabled={nextDisabled}
          className="w-full sm:w-auto btn-primary px-8 py-3 text-base font-semibold"
        >
          {nextText}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  )
}
