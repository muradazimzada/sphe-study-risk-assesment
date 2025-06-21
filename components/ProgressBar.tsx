"use client"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="w-full bg-white py-4 px-6 shadow-sm border-b border-gray-100">
      <div className="container-main">
        <div className="flex justify-end items-center mb-3">
          <span className="text-sm font-montserrat font-semibold text-primary">{progress}% Complete</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
