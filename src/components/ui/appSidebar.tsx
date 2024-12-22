
import * as React from "react";
import { Plus, Trash2, Edit, RotateCcw, MoreHorizontal } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface AppSidebarProps {
  sessions: { [key: string]: SessionInfo };
  activeThread: string | null;
  setActiveThread: (threadId: string) => void;
  openNewThreadDialog: () => void;
  refreshSessions: () => void;
  onEditThread: (threadId: string, currentTitle: string) => void; // New prop for editing
  setThreadToDelete: (threadId: string) => void;
  setDeleteDialogOpen: (open: boolean) => void;
}

export function AppSidebar({
  sessions,
  activeThread,
  setActiveThread,
  openNewThreadDialog,
  refreshSessions,
  onEditThread,
  setThreadToDelete,
  setDeleteDialogOpen,
}: AppSidebarProps) {
  const { open: isSidebarOpen, toggleSidebar } = useSidebar();

  // Convert sessions object to array for ordering
  const sessionArray = Object.entries(sessions).map(([sessionId, session]) => ({
    id: sessionId,
    ...session,
  }));

  const handleDeleteSelect = (sessionId: string) => {
    setThreadToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  return (
    <Sidebar className="h-screen bg-[var(--background)] border-r border-[hsl(var(--ring))] text-[var(--text)] flex flex-col">
      {/* Sidebar Header */}
      <SidebarHeader className="p-5 bg-[var(--background)]">
        <h2 className="text-lg font-bold flex justify-center">Threads</h2>
        <div className="flex justify-end space-x-2">
          <Button
            onClick={openNewThreadDialog}
            className="w-auto bg-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-ring))] text-[hsl(var(--sidebar-primary))] border border-[hsl(var(--sidebar-border))] p-2 rounded"
            variant="outline"
            size="icon"
            aria-label="New Thread"
          >
            <Plus className="h-5 w-5" />
            New Thread
          </Button>
          <Button
            onClick={refreshSessions}
            variant="outline"
            size="icon"
            title="Refresh Threads"
            className="w-auto bg-[hsl(var(--sidebar-background))] hover:bg-[hsl(var(--sidebar-ring))] text-[hsl(var(--sidebar-primary))] border border-[hsl(var(--sidebar-border))] p-2 rounded"
            aria-label="Refresh Threads"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      {/* Sidebar Content */}
      <SidebarContent className="flex-1 overflow-y-auto bg-[hsl(var(--background))] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[hsl(var(--muted))] [&:hover]:scrollbar-thumb-[hsl(var(--muted-foreground))]">
        <SidebarMenu className="mt-4 px-2">
          {sessionArray.map((session) => (
            <SidebarMenuItem key={session.id} className="bg-[hsl(var(--background))] rounded">
              {/* Main Thread Selection */}
              <SidebarMenuButton
                asChild
                isActive={activeThread === session.id}
                onClick={() => setActiveThread(session.id)}
                className="bg-[hsl(var(--sidebar-background))] hover:bg-[hsl(var(--primary-hover))] text-[hsl(var(--foreground))] p-1 my-1 rounded"
                variant="outline"
                size="lg"
              >
                <div className="flex items-center justify-between p-4 cursor-pointer">
                  {/* Thread Title and Info */}
                  <div>
                    <span className="font-semibold text-lg text-[var(--text)]">
                      {session.title || "Untitled"}
                    </span>
                    <div className="text-sm text-[var(--text)] ">
                      {format(new Date(session.created_at), "M/d/yy h:mma")} -{" "}
                      {session.files.length} {session.files.length === 1 ? "file" : "files"}
                    </div>
                  </div>

                  {/* Action Dropdown */}
                  <div className="flex">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="ml-2 hover:bg-[var(--background)] rounded" aria-label="Actions">
                          <MoreHorizontal className="h-4 w-4 text-[var(--text)]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-popper-anchor-width] bg-[hsl(var(--muted))] border border-[hsl(var(--ring))]">
                        <DropdownMenuItem
                          onSelect={() => onEditThread(session.id, session.title || "Untitled")} 
                          className="flex items-center cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4 text-[var(--text)]" />
                          Edit title
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleDeleteSelect(session.id)}
                          className="flex items-center cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                          <span className="text-red-600">Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Sidebar Rail */}
      <SidebarRail></SidebarRail>
    </Sidebar>
  );
}