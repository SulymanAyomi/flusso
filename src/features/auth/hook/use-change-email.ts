import { useQueryState, parseAsBoolean } from "nuqs";

export const useChangeEmailModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "change-email",
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
    )

    const open = () => setIsOpen(true)
    const close = () => setIsOpen(false)

    return {
        isOpen,
        open,
        close,
        setIsOpen
    }
}