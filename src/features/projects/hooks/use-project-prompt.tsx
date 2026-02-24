import model from "@/lib/gemini";
import {
  createProjectPrompt,
  createProjectTaskJson,
  validationPrompt,
} from "@/lib/prompt";

export const useValidateProjectPrompt = async ({
  userPrompt,
}: {
  userPrompt: string;
}) => {
  try {
    const result = await model.generateContent(validationPrompt(userPrompt));

    const validPrompt = result.response.text().trim();
    if (validPrompt.startsWith("valid")) {
      return { data: { valid: true, feedback: null } };
    } else if (validPrompt.startsWith("invalid")) {
      const feedback = validPrompt.replace("invalid:", "").trim();
      return { data: { valid: false, feedback: feedback } };
    } else {
      return {
        data: {
          valid: false,
          feedback: "Something went wrong",
        },
      };
    }
  } catch (error) {
    console.error(error);
    return { data: { valid: false, feedback: "Something went wrongs" } };
  }
};

export const useCreateProjectPrompt = async ({
  userPrompt,
}: {
  userPrompt: string;
}) => {
  const result = await model.generateContent(createProjectPrompt(userPrompt));

  const AIResponse = result.response.text();
  const result2 = await model.generateContent(
    createProjectTaskJson(userPrompt)
  );
  const jsonResponse = result2.response.text();
  const slicedResponse = jsonResponse.slice(8, -4);
  const objResponse = JSON.parse(slicedResponse);

  const projectName = objResponse.projectName;
  const projectTasks = objResponse.tasks as Array<{
    name: string;
    status: string;
    dueDate: string;
    description: string;
  }>;

  const project = await databases.createDocument(
    DATABASE_ID,
    PROJECTS_ID,
    ID.unique(),
    {
      name: projectName,
      imageUrl: uploadedImageUrl,
      workspaceId,
    }
  );
  console.log(projectName);

  await databases.createDocument(DATABASE_ID, CHATS_ID, ID.unique(), {
    userPrompt,
    AIResponse,
    projectId: project.$id,
  });
};

async function createTaskWithAi() {
  const tasks = projectTasks.map(async (task, index) => {
    const position = 1000 * (index + 1);
    await databases.createDocument(DATABASE_ID, TASKS_ID, ID.unique(), {
      name: task.name,
      status: TaskStatus.TODO,
      workspaceId,
      projectId: project.$id,
      dueDate: new Date(task.dueDate),
      assigneeId: user.$id,
      position,
      description: task.description,
    });
  });
  await Promise.all(tasks);
}
