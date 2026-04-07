import { useState, useEffect, useRef } from "react"

export function useCountdown(seconds: number) {
    const [timeLeft, setTimeLeft] = useState(0)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const start = () => {
        setTimeLeft(seconds)
    }

    useEffect(() => {
        if (timeLeft <= 0) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            return
        }

        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [timeLeft])

    return { timeLeft, start, isRunning: timeLeft > 0 }
}