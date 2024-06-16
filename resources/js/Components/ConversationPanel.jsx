import { useEffect, useRef, useState } from 'react'
import { Avatar, Button, ScrollShadow, Textarea } from '@nextui-org/react'
import ConvoBubble from './ConvoBubble'
import LoadingIcon from './LoadingIcon'
import TypingIndicator from './TypingIndicator'
import elasticScroll from 'elastic-scroll-polyfill'
import ElasticScroll from './ElasticScroll'

const ConversationPanel = ({ user, recipient, isOpenConvo, onCloseConvo }) => {
    // Chat box viewport reference.
    const chatContainerRef = useRef(null)

    // Scroll to the bottom of the chat box
    // viewport to view the latest message.
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight
        }
    }

    // Detect if we hit the ceiling of the chat box so
    // we can load the previous messages.
    const handleScroll = () => {
        if (chatContainerRef.current) {
            if (chatContainerRef.current.scrollTop === 0) {
                handleLoadPreviousMessages()
            }
        }
    }

    // Load previous messages when the user scrolls up
    // from the conversation panel.
    const [isLoadingPrevMessages, setIsLoadingPrevMessages] = useState(false)
    let nextPage = null

    const handleLoadPreviousMessages = async () => {
        setIsLoadingPrevMessages(true)
        if (nextPage)
            await axios.get(nextPage).then(response => {
                nextPage = response.data.messages.next_page_url
                setChatThread(prevChatThread => [
                    ...prevChatThread,
                    ...response.data.messages.data
                ])
                setIsLoadingPrevMessages(false)
            })
        setIsLoadingPrevMessages(false)
    }

    // Close the conversation dialog.
    const handleClose = () => {
        onCloseConvo(false)
        setChatThread(null)
        setMessage('')
    }

    // Send message to your friend (you hate).
    const [message, setMessage] = useState('')
    const handleSendMessage = async () => {
        await axios
            .post('/messages', {
                sender_id: user.id,
                recipient_id: recipient.id,
                message: message
            })
            .then(response => {
                console.log('Message Payload sending: ', response)
                setMessage('')

                setChatThread(prevChatThread => [
                    response.data,
                    ...prevChatThread
                ])

                // Scroll to the latest message.
                setTimeout(() => {
                    scrollToBottom()
                }, 100)
            })
    }

    // Fetch latest messages and put the messages in the chatThread state.
    const [chatThread, setChatThread] = useState([])
    const fetchMessages = () => {
        axios.get('/get-messages/' + recipient.id).then(response => {
            // console.log('Thread: ', response.data)
            setChatThread(response.data.messages.data)
            nextPage = response.data.messages.next_page_url

            // Scroll to the latest message.
            setTimeout(() => {
                scrollToBottom()
            }, 100)
        })
    }

    // Send Typing event
    const sendTypingEvent = () => {
        Echo.private(`messages.${recipient.id}`).whisper('typing', {
            sender_id: user.id
        })
    }

    // Function to listen for typing events
    const [isTyping, setIsTyping] = useState(false)
    const typingTimeoutRef = useRef(null)
    const [typingNotifRecipient, setTypingNotifRecipient] = useState(null)
    const listenForTypingEvents = () => {
        Echo.private(`messages.${user.id}`).listenForWhisper(
            'typing',
            event => {
                setIsTyping(true)
                setTypingNotifRecipient(event.sender_id)

                // Clear any existing timeout to prevent multiple timers
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current)
                }

                // Set a new timeout to hide the typing indicator after 2 seconds
                typingTimeoutRef.current = setTimeout(() => {
                    setIsTyping(false)
                }, 2000)
            }
        )
    }

    useEffect(() => {
        if (recipient && isOpenConvo) {
            // Fetch the messages when the conversation dialog was opened.
            fetchMessages()
            listenForTypingEvents(recipient.id)
        } else {
            // Clear the chatThread state when convesation dialog is closed.
            setChatThread([])
        }

        // Add scroll listener to the chat box to detect if it hits the top.
        const chatContainer = chatContainerRef.current
        if (chatContainer) {
            chatContainer.addEventListener('scroll', handleScroll)
        }

        // Listen to incoming messages...
        const channel = Echo.private(`messages.${user.id}`).listen(
            'MessageSent',
            event => {
                console.log('Message Payload: ', event)
                setChatThread(prevChatThread => [
                    event.message,
                    ...prevChatThread
                ])

                setTimeout(() => {
                    scrollToBottom()
                }, 100)
            }
        )

        return () => {
            if (chatContainer) {
                chatContainer.removeEventListener('scroll', handleScroll)
            }

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }

            setMessage('')
            setTypingNotifRecipient(null)

            // Cleanup function, stop listening to messages and leave channel
            // after closing the conversation dialog.
            channel.stopListening('MessageSent')
            Echo.leaveChannel(`message.${user.id}`)
        }
    }, [isOpenConvo, recipient, user.id])

    return (
        <>
            {isOpenConvo && (
                <div className="absolute bottom-8 right-8 flex max-h-[600px] min-h-[500px] w-96 flex-col overflow-hidden rounded-xl border border-gray-300 bg-white shadow-2xl dark:border-gray-600 dark:bg-gray-700">
                    <div className="flex w-full items-center justify-between border-b border-gray-200 px-4 py-4 shadow-sm dark:border-gray-600">
                        <div className="flex w-[75%] gap-4">
                            <Avatar
                                radius="full"
                                isBordered
                                size="sm"
                                color="default"
                                src={`https://ui-avatars.com/api/?size=256&name=${recipient.name}`}
                            />
                            <span className="flex-1 truncate font-medium dark:text-white">
                                {recipient.name}
                            </span>
                        </div>

                        <Button
                            radius="sm"
                            size="lg"
                            color="none"
                            isIconOnly
                            onClick={() => handleClose(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="size-7 text-gray-500 transition duration-300 ease-in-out hover:scale-125"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </Button>
                    </div>

                    <ElasticScroll>
                        <ScrollShadow
                            data-elastic-wrapper
                            size={25}
                            ref={chatContainerRef}
                            className="flex min-h-96 w-full flex-col overflow-y-scroll overscroll-contain p-4 py-8"
                        >
                            <div className="flex min-h-96 w-full flex-col gap-8">
                                {isLoadingPrevMessages && <LoadingIcon />}
                                {chatThread.length > 0 ? (
                                    chatThread
                                        .slice()
                                        .reverse()
                                        .map(thread => (
                                            <ConvoBubble
                                                user={user} // -> The currently authenticated user.
                                                thread={thread}
                                                key={thread.id}
                                            />
                                        ))
                                ) : (
                                    <div className="m-auto text-center text-gray-600 dark:text-gray-500">
                                        You don't have any conversation with{' '}
                                        <span className="whitespace-nowrap font-medium text-black dark:text-white">
                                            {recipient.name}
                                        </span>{' '}
                                        yet. Why don't you say hi!
                                    </div>
                                )}
                            </div>
                        </ScrollShadow>
                    </ElasticScroll>

                    <div className="flex w-full flex-col gap-2 p-2">
                        {/* Typing indicator */}
                        {isTyping && recipient.id === typingNotifRecipient && (
                            <TypingIndicator className="p-3" />
                        )}
                        <div className="flex w-full items-center gap-2 p-2">
                            <Textarea
                                minRows="1"
                                maxRows="4"
                                variant="bordered"
                                radius="md"
                                size="sm"
                                className="dark:dark"
                                classNames={{
                                    inputWrapper:
                                        'dark:bg-gray-600 dark:border-gray-500 group-data-[focus=true]:border-gray-300 dark:group-data-[focus=true]:border-gray-500 dark:text-white'
                                }}
                                value={message}
                                onValueChange={setMessage}
                                onKeyDown={sendTypingEvent}
                            />
                            <Button
                                size="sm"
                                isIconOnly
                                variant="none"
                                onClick={handleSendMessage}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="size-7 text-blue-500 dark:text-blue-700"
                                >
                                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ConversationPanel
