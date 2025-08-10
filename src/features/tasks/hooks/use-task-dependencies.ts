import { parseAsString, useQueryState, } from "nuqs";

export const useTaskDependenciesModal = () => {
    const [taskId, setTaskId] = useQueryState(
        "task-dependency",
        parseAsString,
    )

    const open = (id: string) => setTaskId(id)
    const close = () => setTaskId(null)

    return {
        taskId,
        open,
        close,
        setTaskId
    }
}