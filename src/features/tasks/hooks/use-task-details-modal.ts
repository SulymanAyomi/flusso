import { parseAsString, useQueryState, } from "nuqs";

export const useTaskDetailsModal = () => {
    const [taskDetailId, setTaskDetailId] = useQueryState(
        "task-details",
        parseAsString,
    )

    const open = (id: string) => setTaskDetailId(id)
    const close = () => setTaskDetailId(null)

    return {
        taskDetailId,
        open,
        close,
        setTaskDetailId
    }
}