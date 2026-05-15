import { parseAsString, useQueryState, } from "nuqs";

export const useTransferWorkspaceModal = () => {
    const [workspaceId, setWorkspaceId] = useQueryState(
        "transfer-workspace",
        parseAsString,
    )

    const open = (id: string) => setWorkspaceId(id)
    const close = () => setWorkspaceId(null)

    return {
        workspaceId,
        open,
        close,
        setWorkspaceId
    }
}