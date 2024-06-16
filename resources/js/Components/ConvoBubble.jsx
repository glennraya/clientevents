import { Avatar } from '@nextui-org/react'

const ConvoBubble = ({ user, thread }) => {
    return (
        <>
            <div
                className={`flex max-w-full gap-3 whitespace-pre-wrap ${user.id === thread.sender.id ? 'justify-end' : null}`}
            >
                <div className="flex max-w-[75%] flex-col">
                    <p
                        className={`-mt-4 whitespace-pre-wrap rounded-xl ${user.id === thread.sender.id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'} p-2 px-4 dark:text-white ${user.id === thread.sender.id ? 'text-white dark:bg-sky-800' : 'bg-gray-200'}`}
                    >
                        {thread.message}
                    </p>
                    {/* <span
                        className={`text-sm font-medium text-gray-400 ${user.id === thread.sender.id ? 'text-right' : 'text-left'} dark:text-gray-600`}
                    >
                        {thread.created_at}
                    </span> */}
                </div>
            </div>
        </>
    )
}

export default ConvoBubble
