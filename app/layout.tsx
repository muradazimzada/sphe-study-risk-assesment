import type React from "react"
import type { Metadata } from "next"
import { Merriweather, Montserrat } from "next/font/google"
import "./globals.css"

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "BSHAPE - Being Safe, Healthy and Positively Empowered",
  description: "Risk assessment questionnaire for relationship safety and well-being",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${merriweather.variable} ${montserrat.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bryndan+Write:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-montserrat bg-cream antialiased">{children}</body>
    </html>
  )
}
