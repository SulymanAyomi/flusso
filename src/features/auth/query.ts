import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const getCurrent = async () => {
    try {
        const session = await getServerSession(authOptions);
        return session?.user
    } catch (e) {
        console.log(e)
    }
}