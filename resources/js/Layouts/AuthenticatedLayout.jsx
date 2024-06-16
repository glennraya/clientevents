import { HomeIcon, InboxIcon, DocIcon } from '@/Components/Icons'
import { Avatar, ScrollShadow, Switch, cn } from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import NavLink from '@/Components/NavLink'
import ProfileDropdown from '@/Components/ProfileDropdown'
import TypingIndicator from '@/Components/TypingIndicator'
import ConversationPanel from '@/Components/ConversationPanel'
import ElasticScroll from '@/Components/ElasticScroll'

const AuthenticatedLayout = ({ user, children }) => {
    // Emit an event to the conversation dialog to close it.
    const [isOpenConvo, setIsOpenConvo] = useState(false)
    const handleCloseConvo = () => {
        setIsOpenConvo(false)
    }

    // Load the user's conversation for the selected user.
    const [recipient, setRecipient] = useState(null)
    const handleSelectUser = recipient => {
        setIsOpenConvo(true)
        setRecipient(recipient)
    }

    // Listen for typing events.
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
    // End: Listen for typing events.

    const [team, setTeam] = useState([])
    useEffect(() => {
        axios.get('/team').then(response => {
            setTeam(response.data)
        })

        listenForTypingEvents(user.id)

        return () => {
            // Clear the timer when the component unmounts.
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
        }
    }, [])

    return (
        <>
            <div className="relative flex h-screen">
                <div className="fixed inset-y-0 left-0 hidden flex-grow md:flex">
                    <div className="flex w-80 flex-grow flex-col gap-y-8">
                        <div className="flex flex-grow flex-col gap-y-8">
                            <nav className="flex flex-col">
                                <h1 className="p-6 text-xl font-bold dark:text-white">
                                    Echo Whisperer
                                </h1>

                                <div className="flex flex-col gap-y-2 border-t border-gray-300 px-4 pt-8 font-medium dark:border-gray-900">
                                    <NavLink
                                        href={route('dashboard')}
                                        active={route().current('dashboard')}
                                        className="flex items-center gap-2"
                                    >
                                        <HomeIcon />
                                        <span className="pt-1">Home</span>
                                    </NavLink>
                                    <NavLink className="flex items-center gap-2">
                                        <InboxIcon />
                                        <span>Inbox</span>
                                    </NavLink>
                                    <NavLink className="flex items-center gap-2">
                                        <DocIcon />
                                        <span>Reports</span>
                                    </NavLink>
                                </div>
                            </nav>

                            <div className="flex h-full flex-grow flex-col overflow-y-scroll px-4">
                                <h2 className="mb-4 text-lg font-bold dark:text-white">
                                    Friends{' '}
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        (Who are secretly mad at you!)
                                    </span>
                                </h2>

                                <ElasticScroll>
                                    <ScrollShadow
                                        size={50}
                                        hideScrollBar
                                        className="flex h-[400px] flex-col gap-4 overflow-y-scroll scroll-smooth py-2"
                                    >
                                        {team.map(member => (
                                            <div
                                                className="flex cursor-pointer items-center gap-4 px-4 py-3"
                                                key={member.id}
                                                onClick={() =>
                                                    handleSelectUser(member)
                                                }
                                            >
                                                <Avatar
                                                    radius="full"
                                                    isBordered
                                                    color={
                                                        member.active === 1
                                                            ? 'success'
                                                            : 'default'
                                                    }
                                                    className={`flex-none shadow-lg ${member.active === 1 ? 'shadow-green-400' : null}`}
                                                    src={`https://ui-avatars.com/api/?size=256&name=${member.name}`}
                                                />
                                                <div className="relative flex w-full flex-col">
                                                    <span className="flex cursor-pointer text-medium font-medium dark:text-white">
                                                        {member.name}
                                                    </span>
                                                    <span className="w-full truncate text-sm text-default-500">
                                                        {member.role}
                                                    </span>
                                                    {isTyping &&
                                                        typingNotifRecipient ===
                                                            member.id && (
                                                            <span className="absolute -right-4 bottom-0">
                                                                <TypingIndicator />
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        ))}
                                    </ScrollShadow>
                                </ElasticScroll>
                            </div>

                            <ProfileDropdown user={user} />
                        </div>
                    </div>
                </div>

                {/* Chat box */}
                <ConversationPanel
                    user={user}
                    recipient={recipient}
                    isOpenConvo={isOpenConvo}
                    onCloseConvo={handleCloseConvo}
                />

                <main className="my-3 ml-0 mr-3 flex w-full rounded-xl border border-gray-200 bg-white shadow-sm md:ml-80 dark:border-gray-800 dark:bg-gray-800 dark:shadow-none">
                    {children}
                </main>
            </div>
        </>
    )
}

export default AuthenticatedLayout
