import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { ProjectStatus } from "../types";

export const useProjectsFilters = () => {
    return useQueryStates({
        projectId: parseAsString,
        status: parseAsStringEnum(Object.values(ProjectStatus)),
        assigneeId: parseAsString,
        search: parseAsString,
        dueDate: parseAsString,
    })
}