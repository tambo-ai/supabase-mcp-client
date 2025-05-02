/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your components and tools with Tambo.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { ProjectList } from "@/components/project-list";
import { Table } from "@/components/table";
import { TableList } from "@/components/table-list";
import { Graph } from "@/components/ui/graph";
import type { TamboComponent } from "@tambo-ai/react";
import { z } from "zod";

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "supabaseTableList",
    description:
      "A component that displays a list of Supabase database tables with their details, relationships, and metadata. Use this when displaying a list of tables.",
    component: TableList,
    propsSchema: z.object({
      tables: z
        .array(
          z.object({
            id: z.number().describe("The table ID"),
            schema: z.string().describe("The schema name"),
            name: z.string().describe("The table name"),
            rls_enabled: z.boolean().describe("Whether RLS is enabled"),
            rls_forced: z.boolean().describe("Whether RLS is forced"),
            replica_identity: z
              .string()
              .describe("The replica identity setting"),
            bytes: z.number().describe("Size in bytes"),
            size: z.string().describe("Human readable size"),
            live_rows_estimate: z
              .number()
              .describe("Estimated number of live rows"),
            dead_rows_estimate: z
              .number()
              .describe("Estimated number of dead rows"),
            comment: z.string().nullable().describe("Table comment"),
            primary_keys: z
              .array(
                z.object({
                  name: z.string().describe("Primary key name"),
                  schema: z.string().describe("Schema name"),
                  table_id: z.number().describe("Table ID"),
                  table_name: z.string().describe("Table name"),
                })
              )
              .describe("Array of primary keys"),
            relationships: z
              .array(
                z.object({
                  id: z.number().describe("Relationship ID"),
                  source_schema: z.string().describe("Source schema"),
                  constraint_name: z.string().describe("Constraint name"),
                  source_table_name: z.string().describe("Source table name"),
                  target_table_name: z.string().describe("Target table name"),
                  source_column_name: z.string().describe("Source column name"),
                  target_column_name: z.string().describe("Target column name"),
                  target_table_schema: z.string().describe("Target schema"),
                })
              )
              .describe("Array of relationships"),
          })
        )
        .describe("Array of tables to display"),
    }),
  },
  {
    name: "supabaseProjectList",
    description:
      "A component that displays a list of Supabase projects with their details. Use this when displaying a list of projects.",
    component: ProjectList,
    propsSchema: z.object({
      projects: z
        .array(
          z.object({
            name: z.string().describe("The name of the project"),
            id: z.string().describe("The project ID"),
            region: z
              .string()
              .describe("The region where the project is hosted"),
            status: z.string().describe("The current status of the project"),
            databaseHost: z.string().describe("The database host URL"),
            createdAt: z.string().describe("The creation date of the project"),
          })
        )
        .describe("Array of projects to display"),
    }),
  },
  {
    name: "sqlResult",
    description:
      "A component to show the results of a supabase sql query. Use this when displaying the results of a sql query. Do not use this when displaying a list of projects or a list of supabase tables.",
    component: Table,
    propsSchema: z.object({
      headers: z
        .array(z.string())
        .describe("Array of column headers for the table"),
      rows: z
        .array(z.array(z.string()))
        .describe(
          "Array of rows where each row is an array of strings corresponding to the headers"
        ),
      striped: z
        .boolean()
        .optional()
        .default(true)
        .describe("Whether to show alternating row colors"),
      hoverable: z
        .boolean()
        .optional()
        .default(true)
        .describe("Whether to show hover effects on rows"),
    }),
  },
  {
    name: "graph",
    description:
      "A versatile chart component that can render bar, line, and pie charts with customizable styling and data visualization options. Use this when you need to display data in a graphical format.",
    component: Graph,
    propsSchema: z.object({
      data: z
        .object({
          type: z
            .enum(["bar", "line", "pie"])
            .describe("Type of chart to render"),
          labels: z
            .array(z.string())
            .describe("Labels for the x-axis or data points"),
          datasets: z
            .array(
              z.object({
                label: z.string().describe("Label for the dataset"),
                data: z.array(z.number()).describe("Array of numerical values"),
                color: z
                  .string()
                  .optional()
                  .describe("Optional custom color for the dataset"),
              })
            )
            .describe("Array of datasets to display"),
        })
        .describe("Data configuration for the chart"),
      title: z.string().optional().describe("Optional title for the chart"),
      variant: z
        .enum(["default", "solid", "bordered"])
        .optional()
        .describe("Visual style variant"),
      size: z
        .enum(["default", "sm", "lg"])
        .optional()
        .describe("Size variant of the chart"),
      showLegend: z
        .boolean()
        .optional()
        .describe("Whether to show the chart legend"),
      className: z
        .string()
        .optional()
        .describe("Optional additional CSS classes"),
    }),
  },
  // Add more components here
];
