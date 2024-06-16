const TypingIndicator = () => {
    return (
        <>
            {/* Animation CSS is located at app.css */}
            <svg
                height="20"
                width="40"
                className="loader ml-2 border-2 border-gray-400 bg-gray-400 dark:border-gray-600 dark:bg-gray-600"
            >
                <circle className="dot bg-gray-300" cx="8" cy="8" r="3" />
                <circle className="dot bg-gray-300" cx="18" cy="8" r="3" />
                <circle className="dot bg-gray-300" cx="28" cy="8" r="3" />
            </svg>
        </>
    )
}

export default TypingIndicator
