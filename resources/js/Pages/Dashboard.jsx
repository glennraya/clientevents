import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="container mx-auto p-8 sm:px-6 lg:px-8 dark:text-white">
                Laborum aliqua velit excepteur irure enim ut amet sint fugiat
                velit reprehenderit elit. Ea laborum quis ea consequat eiusmod.
                Dolore dolore deserunt dolore enim aute mollit Lorem excepteur.
                <br />
                <br />
                Nisi mollit sunt eiusmod exercitation. Eu velit cillum commodo
                consequat velit consequat nostrud commodo adipisicing deserunt.
                Excepteur voluptate eiusmod in veniam esse Lorem aute laborum
                sunt.
            </div>
        </AuthenticatedLayout>
    )
}
