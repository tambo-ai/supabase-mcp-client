import Link from "next/link";
import React from "react";

export interface Project {
  name?: string;
  id?: string;
  region?: string;
  status?: string;
  databaseHost?: string;
  createdAt?: string;
}

interface ProjectListProps {
  projects: Project[];
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects = [] }) => {
  return (
    <div className="grid gap-4 w-full max-w-xl">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.status === "ACTIVE_HEALTHY"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {project.status}
            </span>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="flex items-center">
              <span className="text-gray-500 w-32">ID:</span>
              <span className="font-mono">{project.id}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Region:</span>
              <span>{project.region}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Database Host:</span>
              <span className="font-mono">{project.databaseHost}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 w-32">Created At:</span>
              <span>
                {project.createdAt
                  ? new Date(project.createdAt).toLocaleDateString()
                  : ""}
              </span>
            </div>
            <div className="mt-4">
              <Link
                href={`https://supabase.com/dashboard/project/${project.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2  text-gray-500 rounded hover:bg-gray-100 transition-colors"
              >
                View Project
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
