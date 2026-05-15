"use client";
import React, { useState } from "react";
import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import MobileBackButton from "@/components/mobile-back-button";

interface NotificationSettings {
  masterEmail: boolean;
  assignedTasks: boolean;
  mentions: boolean;
  comments: boolean;
  workspaceInvites: boolean;
  roleChanges: boolean;
  digest: boolean;
  digestFrequency: "daily" | "weekly";
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={cn(
        "w-9 h-5 rounded-lg border-none cursor-pointer relative flex-shrink-0 transition-all bg-[#d1d0cc]",
        on && "bg-brand1",
      )}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: on ? 19 : 3,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}
const NotificationClient = () => {
  const [notifs, setNotifs] = useState<NotificationSettings>({
    masterEmail: true,
    assignedTasks: true,
    mentions: true,
    comments: false,
    workspaceInvites: true,
    roleChanges: true,
    digest: true,
    digestFrequency: "weekly",
  });

  const toggle = (key: keyof NotificationSettings) =>
    setNotifs((prev) => ({
      ...prev,
      [key]: !prev[key as keyof NotificationSettings],
    }));

  const NotifRow = ({
    label,
    desc,
    field,
  }: {
    label: string;
    desc: string;
    field: keyof NotificationSettings;
  }) => (
    <div className="flex items-start justify-between py-3.5 px-5 gap-4">
      <div>
        <p className="text-sm font-medium text-black m-0">{label}</p>
        <p
          style={{
            fontSize: 12,
            color: "var(--color-text-secondary, #666)",
            margin: "2px 0 0",
          }}
          className="text-xs text-muted-foreground mt-0.5"
        >
          {desc}
        </p>
      </div>
      <Toggle on={notifs[field] as boolean} onToggle={() => toggle(field)} />
    </div>
  );

  return (
    <div className="flex flex-col">
      <PageHeader
        header={"Notifications Settings"}
        subText="Manage your notifications settings."
        button={false}
        buttonType="workspace"
      />
      <div className="flex p-3 font-semibold">
        <h2 className="text-xl">Security</h2>
      </div>
      <div className="p-3 w-full bg-neutral-100">
        <MobileBackButton />
        <div className="flex flex-col gap-y-4 w-full max-w-xl mx-auto">
          <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 space-y-0">
              <CardDescription>
                <CardTitle className="text-xl font-bold text-black">
                  Email notifications{" "}
                </CardTitle>
                <p className="text-xs">Control which emails we send you.</p>
              </CardDescription>
            </CardHeader>
            <div className="px-7 mb-3">
              <Separator />
            </div>
            <CardContent>
              <NotifRow
                label="All email notifications"
                desc="Master switch — turns off all emails below"
                field="masterEmail"
              />
            </CardContent>
          </Card>

          <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 space-y-0">
              <CardDescription>
                <CardTitle className="text-xl font-bold text-black">
                  Activity
                </CardTitle>
                <p className="text-xs">
                  Notifications about things happening around you.
                </p>
              </CardDescription>
            </CardHeader>
            <div className="px-7 mb-3">
              <Separator />
            </div>
            <CardContent>
              <NotifRow
                label="Assigned tasks"
                desc="When someone assigns a task to you"
                field="assignedTasks"
              />
              <NotifRow
                label="Mentions"
                desc="When someone @mentions you in a comment or task"
                field="mentions"
              />
              <NotifRow
                label="Comments on your work"
                desc="Replies and reactions to your items"
                field="comments"
              />
            </CardContent>
          </Card>

          <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 space-y-0">
              <CardDescription>
                <CardTitle className="text-xl font-bold text-black">
                  Workspace
                </CardTitle>
                <p className="text-xs">
                  Changes to your workspace membership or role.
                </p>
              </CardDescription>
            </CardHeader>
            <div className="px-7 mb-3">
              <Separator />
            </div>
            <CardContent>
              <NotifRow
                label="Workspace invites"
                desc="When you're invited to join a workspace"
                field="workspaceInvites"
              />
              <NotifRow
                label="Removals & role changes"
                desc="When your access level changes"
                field="roleChanges"
              />
            </CardContent>
          </Card>

          <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 space-y-0">
              <CardDescription>
                <CardTitle className="text-xl font-bold text-black">
                  Digest
                </CardTitle>
                <p className="text-xs">
                  A summary of activity across your workspaces.{" "}
                </p>
              </CardDescription>
            </CardHeader>
            <div className="px-7 mb-3">
              <Separator />
            </div>
            <CardContent>
              <div className="flex items-start justify-between py-3.5 px-5 gap-4">
                <div>
                  <p className="text-sm font-medium text-black m-0">
                    Activity digest
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Periodic summary email
                  </p>
                  <div className="flex gap-2 mt-2.5">
                    {(["daily", "weekly"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() =>
                          setNotifs((p) => ({ ...p, digestFrequency: f }))
                        }
                        className={cn(
                          "text-xs py-1 px-3 rounded-2xl border cursor-pointer",
                          notifs.digestFrequency === f
                            ? "border-brand1 bg-brand1 text-white"
                            : "border-primary",
                        )}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <Toggle on={notifs.digest} onToggle={() => toggle("digest")} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationClient;
