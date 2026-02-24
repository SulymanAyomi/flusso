interface Task {
    id?: string;
    title: string;
    dependsOn: string[];
    [key: string]: any;
}

/**
 * Resolve task dependencies from titles to IDs
 */
export function resolveDependencies<T extends Task>(tasks: T[]): T[] {
    // Step 1: Generate IDs and create title-to-ID mapping
    const taskMap = new Map<string, string>();

    const tasksWithIds = tasks.map((task, index) => ({
        ...task,
        id: task.id || `task-${index + 1}`
    }));

    tasksWithIds.forEach(task => {
        taskMap.set(task.title.toLowerCase().trim(), task.id!);
    });

    // Step 2: Convert dependency titles to IDs
    return tasksWithIds.map(task => ({
        ...task,
        dependsOn: task.dependsOn
            .map(titleOrId => {
                // Check if it's already an ID
                if (titleOrId.startsWith('task-')) return titleOrId;

                // Look up by title (case-insensitive)
                const id = taskMap.get(titleOrId.toLowerCase().trim());
                return id || null;
            })
            .filter((id): id is string => id !== null) // Remove nulls (invalid refs)
    }));
}

/**
 * Detect circular dependencies using DFS
 */
export function hasCircularDependencies<T extends Task>(tasks: T[]): boolean {
    const graph = new Map<string, string[]>();
    tasks.forEach(task => {
        graph.set(task.id!, task.dependsOn);
    });

    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    function dfs(taskId: string): boolean {
        visited.add(taskId);
        recursionStack.add(taskId);

        const dependencies = graph.get(taskId) || [];
        for (const depId of dependencies) {
            if (!visited.has(depId)) {
                if (dfs(depId)) return true;
            } else if (recursionStack.has(depId)) {
                return true; // Cycle detected
            }
        }

        recursionStack.delete(taskId);
        return false;
    }

    for (const task of tasks) {
        if (!visited.has(task.id!)) {
            if (dfs(task.id!)) return true;
        }
    }

    return false;
}

export function autoFixCircularDependencies<T extends Task>(tasks: T[]): T[] {
    let attempts = 0;
    const maxAttempts = 10;
    let currentTasks = [...tasks];

    while (hasCircularDependencies(currentTasks) && attempts < maxAttempts) {
        attempts++;

        // Find a cycle and break it
        const cycles = findAllCycles(currentTasks);
        if (cycles.length === 0) break;

        // Break the first cycle at the lowest priority task
        const cycle = cycles[0];
        const lowestPriorityTask = cycle.reduce((min, taskId) => {
            const task = currentTasks.find(t => t.id === taskId);
            const minTask = currentTasks.find(t => t.id === min);

            if (!task || !minTask) return min;

            const priorityOrder = { low: 0, medium: 1, high: 2 };
            const taskPriority = priorityOrder[task.priority as keyof typeof priorityOrder] || 0;
            const minPriority = priorityOrder[minTask.priority as keyof typeof priorityOrder] || 0;

            return taskPriority < minPriority ? taskId : min;
        });

        // Remove one dependency from the lowest priority task
        currentTasks = currentTasks.map(task => {
            if (task.id === lowestPriorityTask && task.dependsOn.length > 0) {
                return {
                    ...task,
                    dependsOn: task.dependsOn.slice(0, -1) // Remove last dependency
                };
            }
            return task;
        });
    }

    return currentTasks;
}

function findAllCycles<T extends Task>(tasks: T[]): string[][] {
    const graph = new Map<string, string[]>();
    tasks.forEach(task => graph.set(task.id!, task.dependsOn));

    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack: string[] = [];

    function dfs(taskId: string): void {
        visited.add(taskId);
        recursionStack.push(taskId);

        const dependencies = graph.get(taskId) || [];
        for (const depId of dependencies) {
            if (!visited.has(depId)) {
                dfs(depId);
            } else if (recursionStack.includes(depId)) {
                // Found a cycle
                const cycleStart = recursionStack.indexOf(depId);
                cycles.push(recursionStack.slice(cycleStart));
            }
        }

        recursionStack.pop();
    }

    for (const task of tasks) {
        if (!visited.has(task.id!)) {
            dfs(task.id!);
        }
    }

    return cycles;
}

/**
 * Topological sort for tasks (respects dependencies)
 */
export function topologicalSort<T extends Task>(tasks: T[]): T[] {
    const graph = new Map<string, T>();
    const inDegree = new Map<string, number>();

    // Build graph and calculate in-degrees
    tasks.forEach(task => {
        graph.set(task.id!, task);
        inDegree.set(task.id!, task.dependsOn.length);
    });

    // Find tasks with no dependencies
    const queue: T[] = [];
    tasks.forEach(task => {
        if (inDegree.get(task.id!) === 0) {
            queue.push(task);
        }
    });

    const sorted: T[] = [];

    while (queue.length > 0) {
        const task = queue.shift()!;
        sorted.push(task);

        // Reduce in-degree for dependent tasks
        tasks.forEach(t => {
            if (t.dependsOn.includes(task.id!)) {
                const degree = inDegree.get(t.id!)! - 1;
                inDegree.set(t.id!, degree);
                if (degree === 0) {
                    queue.push(t);
                }
            }
        });
    }

    return sorted;
}