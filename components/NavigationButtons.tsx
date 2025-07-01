// // "use client"

// // import { Button } from "@/components/ui/button"
// // import { ChevronLeft, ChevronRight } from "lucide-react"

// // interface NavigationButtonsProps {
// //   onBack?: () => void
// //   onNext?: () => void
// //   showBack?: boolean
// //   showNext?: boolean
// //   nextDisabled?: boolean
// //   nextText?: string
// //   backText?: string
// // }

// // export default function NavigationButtons({
// //   onBack,
// //   onNext,
// //   showBack = true,
// //   showNext = true,
// //   nextDisabled = false,
// //   nextText = "Continue",
// //   backText = "Back",
// // }: NavigationButtonsProps) {
// //   return (
// //     <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12 pt-8">
// //       {showBack ? (
// //         <Button
// //           variant="outline"
// //           onClick={onBack}
// //           className="w-full sm:w-auto bg-white text-gray-700 border-gray-300 hover:bg-gray-50 font-montserrat font-medium px-6 py-3"
// //         >
// //           <ChevronLeft className="w-4 h-4 mr-2" />
// //           {backText}
// //         </Button>
// //       ) : (
// //         <div />
// //       )}

// //       {showNext && (
// //         <Button
// //           onClick={onNext}
// //           disabled={nextDisabled}
// //           className="w-full sm:w-auto btn-primary px-8 py-3 text-base font-semibold"
// //         >
// //           {nextText}
// //           <ChevronRight className="w-4 h-4 ml-2" />
// //         </Button>
// //       )}
// //     </div>
// //   )
// // }


// "use client"

// import { Button } from "@/components/ui/button"
// import { ChevronLeft, ChevronRight } from "lucide-react"

// interface NavigationButtonsProps {
//   onBack?: () => void
//   onNext?: () => void
//   showBack?: boolean
//   showNext?: boolean
//   nextDisabled?: boolean
//   nextText?: string
//   backText?: string
//   nextLink?: string
//   backLink?: string
// }

// export default function NavigationButtons({
//   onBack,
//   onNext,
//   showBack = true,
//   showNext = true,
//   nextDisabled = false,
//   nextText = "Continue",
//   backText = "Back",
//   nextLink,
//   backLink,

// }: NavigationButtonsProps) {
//   return (
//     <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12 pt-8">
//       {showBack ? (
//         <Button

//           onClick={onBack}
//           className="w-full sm:w-auto bg-[#FFF1C7] text-[#FE6901] font-semibold font-montserrat text-base px-6 py-3 rounded-xl hover:bg-[#ffe7a2] transition"
//         >
//           ← <span className="ml-2">{backText}</span>

//         </Button>
//       ) : (
//         <div />
//       )}

//       {showNext && (
//         <Button
//           onClick={onNext}
//           disabled={nextDisabled}
//           className="w-full sm:w-auto bg-[#F28132] text-white font-semibold font-montserrat text-base px-8 py-3 rounded-xl hover:brightness-105 transition"
//         >
//           <span className="mr-2">{nextText}</span> →
//         </Button>
//       )}
//     </div>
//   )
// }
// components/NavigationButtons.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface NavigationButtonsProps {
  onBack?: () => void
  onNext?: () => void
  showBack?: boolean
  showNext?: boolean
  nextDisabled?: boolean
  nextText?: string
  backText?: string
  nextLink?: string
  backLink?: string
  className?: string
}

export default function NavigationButtons({
  onBack,
  onNext,
  showBack = true,
  showNext = true,
  nextDisabled = false,
  nextText = "Continue",
  backText = "Back",
  nextLink,
  backLink,
  className
}: NavigationButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-12 pt-8">
      {showBack && (
        backLink ? (
          <Link href={backLink} legacyBehavior>
            <a>
              <Button className="w-full sm:w-auto bg-[#FFF1C7] text-[#FE6901] font-semibold font-montserrat text-base px-6 py-3 rounded-xl hover:bg-[#ffe7a2] transition">
                ← <span className="ml-2">{backText}</span>
              </Button>
            </a>
          </Link>
        ) : (
          <Button
            onClick={onBack}
            className="w-full sm:w-auto bg-[#FFF1C7] text-[#FE6901] font-semibold font-montserrat text-base px-6 py-3 rounded-xl hover:bg-[#ffe7a2] transition"
          >
            ← <span className="ml-2">{backText}</span>
          </Button>
        )
      )}

      {showNext && (
        nextLink ? (
          <Link href={nextLink} legacyBehavior>
            <a>
              <Button className={`w-full sm:w-auto bg-[#F28132] text-white font-semibold font-montserrat text-base px-8 py-3 rounded-xl hover:brightness-105 transition ${className}`}>
                <span className="mr-2">{nextText}</span> →
              </Button>
            </a>
          </Link>
        ) : (
          <Button
            onClick={onNext}
            disabled={nextDisabled}
            className="w-full sm:w-auto bg-[#F28132] text-white font-semibold font-montserrat text-base px-8 py-3 rounded-xl hover:brightness-105 transition disabled:opacity-50"
          >
            <span className="mr-2">{nextText}</span> →
          </Button>
        )
      )}
    </div>
  )
}
