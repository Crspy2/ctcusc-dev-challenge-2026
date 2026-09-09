import { getRestaurant, getVisits } from '@/lib/apiClient'

export default async function HomePage({ params }: { params: { id: string } }) {
    const restaurant = await getRestaurant(params.id)
    if (!!(restaurant as { error: string}).error) return (
        <div className="flex flex-col gap-y-4 justify-center items-center">
            <span className="text-red-500 text-3xl font-semibold">Restaurant does not exist</span>
            <a href="/" className="bg-green-500 text-white px-4 py-1.5 rounded-lg">Back to restaurant listing</a>
        </div>
    )

    const visits = await getVisits(+params.id)
    if (visits.length == 0) return (
        <div className="flex flex-col gap-y-4 justify-center items-center">
            <span className="text-3xl font-semibold">Restaurant has no visits logged yet</span>
            <a href="/" className="bg-green-500 text-white px-4 py-1.5 rounded-lg">Back to restaurant listing</a>
        </div>
    )

    return (
        <div>
            <div className="flex justify-between items-center">
                <h2 className="mb-4 text-lg font-medium">Restaurant Visits: {restaurant.name}</h2>
                <a href="/" className="bg-green-500 text-white px-4 py-1.5 rounded-lg">Back to restaurant listing</a>
            </div>
            <ul className="space-y-3">
                {(visits || []).map((visit) => (
                    <li
                        key={restaurant.id}
                        className="rounded-lg border border-gray-200 bg-white p-4"
                    >
                        <div className="flex items-baseline justify-between">
                            <span className="font-medium">Amount spent: ${visit.amountSpent?.toFixed(2)}</span>
                            <span className="text-sm text-gray-500">
                                {visit.date}
                            </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                            {visit.notes}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
