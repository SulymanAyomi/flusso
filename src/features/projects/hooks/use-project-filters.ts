import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { ProjectsStatus } from "../types";

export const useProjectsFilters = () => {
    return useQueryStates({
        projectId: parseAsString,
        status: parseAsStringEnum(Object.values(ProjectsStatus)),
        assigneeId: parseAsString,
        search: parseAsString,
        dueDate: parseAsString,
    })
}