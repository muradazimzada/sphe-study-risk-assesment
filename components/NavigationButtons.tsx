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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="container-main flex justify-between items-center">
        {showBack ? (
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 font-montserrat font-medium px-6 py-3 rounded-full"
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
            className="btn-primary px-8 py-3 text-base font-semibold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {nextText}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
