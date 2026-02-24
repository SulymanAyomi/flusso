import { addDays, formatISO, parseISO } from 'date-fns';

interface Task {
    id: string;
    dependsOn: string[];
    estimatedDays: number;
    dueDate?: string;
}


export function calculateProjectDates(
    estimatedDurationDays: number,
    userStartDate?: string
): {
    startDate: string;
    endDate: string;
} {
    const now = new Date();

    // Use provided start date or default to tomorrow
    const startDate = userStartDate
        ? parseISO(userStartDate)
        : addDays(now, 1);

    const endDate = addDays(startDate, estimatedDurationDays);

    return {
        startDate: formatISO(startDate, { representation: 'date' }),
        endDate: formatISO(endDate, { representation: 'date' })
    };
}


//   Calculate due dates for tasks based on dependencies

export function calculateTaskDates<T extends Task>(
    tasks: T[],
    projectStartDate: string
): T[] {
    const start = parseISO(projectStartDate);
    const taskDates = new Map<string, Date>();

    // Sort tasks topologically (dependencies first)
    const sorted = topologicalSort(tasks);

    sorted.forEach(task => {
        let taskStartDate = start;

        // If task has dependencies, start after the latest dependency finishes
        if (task.dependsOn.length > 0) {
            const dependencyDates = task.dependsOn
                .map(depId => taskDates.get(depId))
                .filter((date): date is Date => date !== undefined);

            if (dependencyDates.length > 0) {
                const latestDependency = new Date(
                    Math.max(...dependencyDates.map(d => d.getTime()))
                );
                taskStartDate = addDays(latestDependency, 1); // Start day after
            }
        }

        // Calculate due date
        const dueDate = addDays(taskStartDate, task.estimatedDays);
        taskDates.set(task.id, dueDate);
    });

    // Add due dates to tasks
    return tasks.map(task => ({
        ...task,
        dueDate: formatISO(taskDates.get(task.id)!, { representation: 'date' })
    }));
}

function topologicalSort<T extends Task>(tasks: T[]): T[] {
    const graph = new Map<string, T>();
    const inDegree = new Map<string, number>();

    tasks.forEach(task => {
        graph.set(task.id, task);
        inDegree.set(task.id, task.dependsOn.length);
    });

    const queue: T[] = [];
    tasks.forEach(task => {
        if (inDegree.get(task.id)! === 0) {
            queue.push(task);
        }
    });

    const sorted: T[] = [];

    while (queue.length > 0) {
        const task = queue.shift()!;
        sorted.push(task);

        tasks.forEach(t => {
            if (t.dependsOn.includes(task.id)) {
                const degree = inDegree.get(t.id)! - 1;
                inDegree.set(t.id, degree);
                if (degree === 0) {
                    queue.push(t);
                }
            }
        });
    }

    return sorted;
}