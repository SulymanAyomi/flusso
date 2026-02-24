import React from "react";
import { Badge } from "../ui/badge";

interface ProjectTagsProps {
  tags: {
    id: string;
    name: string;
  }[];
}
const ProjectTags = ({ tags }: ProjectTagsProps) => {
  return (
    <div className="flex gap-1 overflow-hidden">
      {tags.map((tag) => (
        <Badge
          variant="default"
          className="bg-green-200 text-green-800 hover:bg-green-200/80 hover:text-green-800 p-1 text-[8px]"
          key={tag.id}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
};

export default ProjectTags;
