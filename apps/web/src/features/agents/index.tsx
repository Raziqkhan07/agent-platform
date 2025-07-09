import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "./components/page-header";
import { TemplatesList } from "./components/templates-list";
import { AgentDashboard } from "./components/agent-dashboard";

export default function AgentsInterfaceV2() {
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Agents"
        description="Manage your agents across different templates"
      />

      <Tabs
        defaultValue="templates"
        className="mt-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted text-muted-foreground">
          <TabsTrigger value="templates" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
            Templates
          </TabsTrigger>
          <TabsTrigger value="all-agents" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
            All Agents
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="templates"
          className="mt-6"
        >
          <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
            <TemplatesList />
          </Suspense>
        </TabsContent>

        <TabsContent
          value="all-agents"
          className="mt-6"
        >
          <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
            <AgentDashboard />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
