import { parseAsString, useQueryState, } from "nuqs";

export const useMemberProfileModal = () => {
    const [memberId, setMember] = useQueryState(
        "open-profile",
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

