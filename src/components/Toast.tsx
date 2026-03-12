import { useEffect } from "react"
import { motion } from "motion/react"

interface ToastProps {
    message: string
    type: "error" | "success" | "info"
    onDismiss: () => void
    duration?: number
}

export default function Toast({ message, type, onDismiss, duration = 5000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, duration)
        return () => clearTimeout(timer)
    }, [onDismiss, duration])

    return (
        <div className="toast-container">
            <motion.div
                className={`toast toast-${type}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.2 }}
            >
                <p style={{ flex: 1, color: "inherit" }}>{message}</p>
                <button onClick={onDismiss} aria-label="Dismiss">x</button>
            </motion.div>
        </div>
    )
}
