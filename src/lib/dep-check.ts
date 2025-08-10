import { db } from "./db"

export async function hasCircularDependency(taskId: string, dependencies: string[]): Promise<boolean> {
    const visited = new Set<string>()

    async function dfs(currentId: string): Promise<boolean> {
        if (visited.has(currentId)) return false
        visited.add(currentId)

        const task = await db.task.findUnique({
            where: { id: currentId },
            select: {
                id: true,
                dependencies: true
            }
        })

        if (!task) return false

        for (const dep of task.dependencies) {
            console.log(dep, taskId)
            if (dep.dependsOnId === taskId) return true
            if (await dfs(dep.dependsOnId)) return true
        }
        return false

    }
    for (const depId of dependencies) {
        if (await dfs(depId)) return true
    }
    return false
}