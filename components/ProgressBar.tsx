"use client"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = Math.round((currentStep / totalSteps) * 100)

  return (
    // <div className="w-full bg-white py-4 px-6 shadow-sm border-b border-gray-100 mb-6">
    <div className="w-full max-w-[500px] mx-auto bg-white py-2 px-6 shadow-sm border-b border-gray-100 mb-6">
      <div className="container-main">
        <div className="flex justify-between items-center mb-3">
          {/* 
          <span className="text-sm font-montserrat text-gray-600">
            Step {currentStep} of {totalSteps}
          </span> 
          */}
          {/* <span className="text-sm font-montserrat font-semibold text-primary">
            {progress}% Complete
          </span> */}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
