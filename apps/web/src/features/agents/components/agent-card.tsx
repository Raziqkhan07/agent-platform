"use client";

import { useState } from "react";
import {
  Bot,
  Brain,
  Cloud,
  Edit,
  MessageSquare,
  User,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Agent } from "@/types/agent";
import { EditAgentDialog } from "./create-edit-agent-dialogs/edit-agent-dialog";
import _ from "lodash";
import NextLink from "next/link";
import { Badge } from "@/components/ui/badge";
import { getDeployments } from "@/lib/environment/deployments";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isUserCreatedDefaultAssistant } from "@/lib/agent-utils";

function SupportedConfigBadge({
  type,
}: {
  type: "rag" | "tools" | "supervisor";
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {type === "rag" && (
            <Badge variant="brand" className="bg-primary/10 text-primary">
              <Brain className="size-3.5" />
              RAG
            </Badge>
          )}
          {type === "tools" && (
            <Badge variant="info" className="bg-info/10 text-info">
              <Wrench className="size-3.5" />
              MCP Tools
            </Badge>
          )}
          {type === "supervisor" && (
            <Badge variant="brand" className="bg-primary/10 text-primary">
              <User className="size-3.5" />
              Supervisor
            </Badge>
          )}
        </TooltipTrigger>
        <TooltipContent className="bg-popover text-popover-foreground border-border">
          This agent supports {type}.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface AgentCardProps {
  agent: Agent;
  showDeployment?: boolean;
}

export function AgentCard({ agent, showDeployment }: AgentCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const deployments = getDeployments();
  const selectedDeployment = deployments.find(
    (d) => d.id === agent.deploymentId,
  );

  const isDefaultAgent = isUserCreatedDefaultAssistant(agent);

  return (
    <>
      <Card
        key={agent.assistant_id}
        className="overflow-hidden bg-card text-card-foreground border-border"
      >
        <CardHeader className="space-y-2 pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="flex w-full flex-wrap items-center gap-2 text-foreground">
              <p>{agent.name}</p>
              {showDeployment && selectedDeployment && (
                <div className="flex flex-wrap items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="bg-background text-foreground border-border">
                          <Cloud className="size-3.5" />
                          {selectedDeployment.name}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground border-border">
                        The deployment the graph & agent belongs to.
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="bg-background text-foreground border-border">
                          <Bot className="size-3.5" />
                          {agent.graph_id}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover text-popover-foreground border-border">
                        The graph the agent belongs to.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </CardTitle>
          </div>
          <div className="flex flex-0 flex-wrap items-center justify-start gap-2">
            {agent.metadata?.description &&
            typeof agent.metadata.description === "string" ? (
              <p className="text-muted-foreground mt-1 text-sm">
                {agent.metadata.description}
              </p>
            ) : null}
            {agent.supportedConfigs?.map((config) => (
              <SupportedConfigBadge
                key={`${agent.assistant_id}-${config}`}
                type={config}
              />
            ))}
          </div>
        </CardHeader>
        <CardFooter className="mt-auto flex w-full justify-between pt-2">
          {!isDefaultAgent && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              className="bg-background text-foreground border-border hover:bg-accent"
            >
              <Edit className="mr-2 size-3.5" />
              Edit
            </Button>
          )}
          <NextLink
            href={`/?agentId=${agent.assistant_id}&deploymentId=${agent.deploymentId}`}
            className="ml-auto"
          >
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <MessageSquare className="mr-2 size-3.5" />
              Chat
            </Button>
          </NextLink>
        </CardFooter>
      </Card>
      <EditAgentDialog
        agent={agent}
        open={showEditDialog}
        onOpenChange={(c) => setShowEditDialog(c)}
      />
    </>
  );
}
