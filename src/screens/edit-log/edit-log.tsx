import { useGetSessionDetails } from "@/hooks/useWorkoutLogging"
import { Route } from "@/routes/edit-log/$sessionId"

const EditLog = () => {
    const { sessionId } = Route.useParams()
    const { sessionDetails } = useGetSessionDetails(Number(sessionId))

    console.log(
        "sessionDetails", sessionDetails
    )

    return (
        <div>EditLog</div>
    )
}

export default EditLog