import { parseAsString, useQueryState, } from "nuqs";

export const useAssignProjectMemberModal = () => {
    const [memberId, setMember] = useQueryState(
        "assign-project",
        parseAsString,
    )

    const open = (id: string) => setMember(id)
    const close = () => setMember(null)

    return {
        memberId,
        open,
        close,
        setMember
    }
}

export const useAssignMemberModal = () => {
    const [projectId, setProjectId] = useQueryState(
        "assign-member",
        parseAsString,
    )

    const open = (id: string) => setProjectId(id)
    const close = () => setProjectId(null)

    return {
        projectId,
        open,
        close,
        setProjectId
    }
}