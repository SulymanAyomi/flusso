"use client";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useChangeProfile } from "@/features/auth/api/use-change-profile";
import { cn } from "@/lib/utils";
import { useGetProfile } from "@/features/auth/api/use-get-profile";
import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { uploadFile } from "@/lib/upload";
import { toast } from "sonner";
import { useChangeEmailModal } from "@/features/auth/hook/use-change-email";
import { useConfirm } from "@/hooks/use-confirm";
import MobileBackButton from "@/components/mobile-back-button";

const ProfileClient = () => {
  const { data, isPending } = useGetProfile();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const currentSrc = preview || data?.user.imageUrl;
  const { mutate, isPending: isChangePending } = useChangeProfile();
  const { open } = useChangeEmailModal();
  const changeProfile = ({ value }: { value: string }) => {
    mutate({
      json: {
        name: value,
      },
    });
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        // instant preview
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);
        const { url, publicId } = await uploadFile(file, "avatar");
        mutate({
          json: {
            imageUrl: url,
            imagePublicId: publicId,
          },
        });
      } catch (error: any) {
        setPreview(null);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleRemove = async () => {
    try {
      setLoading(true);

      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avatarUrl: null,
          avatarPublicId: null,
        }),
      });
    } catch (err) {
      console.error(err);
      alert("Failed to remove avatar");
    } finally {
      setLoading(false);
    }
  };

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete account",
    "This action is permanent and cannot be undone.",
    "destructive",
  );
  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
  };
  if (isPending) {
    return <PageLoader />;
  }

  if (!data) {
    <PageError title="User not found." message="Something went wrong" />;
  }

  const isLoading = isChangePending || isPending;

  return (
    <div className="flex flex-col">
      <ConfirmDialog />
      <PageHeader
        header={"My profile"}
        subText="Manage your personal information, security, and workspace memberships."
        button={false}
        buttonType="dashboard"
      />
      <div className="p-3 w-full bg-neutral-100">
        <MobileBackButton />
        <div className="flex flex-col gap-y-4 w-full max-w-xl mx-auto">
          <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 space-y-0">
              <CardDescription>
                <CardTitle className="text-xl font-bold text-black">
                  Account
                </CardTitle>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-3 flex-wrap">
                <div className="relative">
                  <MemberAvatar
                    className={cn(
                      "size-14 bg-blue-300",
                      isLoading && "opacity-60",
                    )}
                    fallbackClassName="text-lg text-blue-700 bg-blue-100"
                    name={data?.user.name!}
                    imageUrl={currentSrc}
                    imgClassName="size-14"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <p className="text-sm font-medium">{data?.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {data?.user.email}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-[10px] text-muted-foreground">
                    JPG, PNG, SVG or JPEG, max 1mb
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      className="hidden"
                      type="file"
                      accept=".jpg, .png, .jpeg, .svg"
                      ref={inputRef}
                      disabled={isLoading}
                      onChange={handleImageChange}
                    />
                    <Button
                      type="button"
                      disabled={isLoading}
                      variant="teritary"
                      size="xs"
                      className="w-fit"
                      onClick={() => inputRef.current?.click()}
                    >
                      Upload image
                    </Button>
                    {data?.user.imageUrl && (
                      <Button
                        size="xs"
                        variant={"outline"}
                        className="text-xs text-[#a32d2d] border-[#f09595] hover:text-[#a32d2ds]"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <FieldRow
                label="Display name"
                value={data?.user.name!}
                actionName={"Edit"}
                isPending={isPending}
                changeProfile={changeProfile}
              />
              <div className="flex items-center px-5 py-3.5 border-t gap-4">
                <span className="text-xs text-muted-foreground w-[120px] flex-shrink-0">
                  Email
                </span>
                <span className="flex-1 text-[13px] text-black">
                  {data?.user.email}
                </span>
                <button
                  className="text-xs text-[#185FA5] bg-none border-none cursor-pointer p-0 whitespace-nowrap"
                  onClick={() => open()}
                >
                  Change
                </button>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full h-full border-none shadow-none">
            <CardContent className="p-7">
              <div className="flex flex-col">
                <h3 className="font-bold">Delete my account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account. You'll no longer be able to
                  access your workspaces or any other workspaces you belong to.
                </p>
                <Separator className="my-2" />

                <Button
                  className="mt-6 w-fit ml-auto"
                  size="sm"
                  variant="destructive"
                  type="button"
                  onClick={onDelete}
                >
                  Delete account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;

function FieldRow({
  label,
  value,
  changeProfile,
  isPending,
  actionName,
}: {
  label: string;
  value: string;
  actionName: string;
  isPending: boolean;
  changeProfile: ({ value }: { value: string }) => void;
}) {
  const [state, setState] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    changeProfile({ value: state });
  };
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        padding: "14px 20px",
        gap: 16,
        borderTop: "0.5px solid var(--color-border-tertiary, #e5e5e5)",
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "var(--color-text-secondary, #666)",
          width: 120,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      {!isEditing ? (
        <span
          style={{
            flex: 1,
            fontSize: 13,
            color: "var(--color-text-primary, #111)",
          }}
        >
          {state}
        </span>
      ) : (
        <Input
          onChange={(e) => setState(e.target.value)}
          value={state}
          type="text"
        />
      )}
      {!isEditing ? (
        <button
          onClick={handleClick}
          style={{
            fontSize: 12,
            color: "#185FA5",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            whiteSpace: "nowrap",
          }}
          disabled={isPending}
        >
          {actionName}
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handleClick}
            style={{
              fontSize: 12,
              color: "#185FA5",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              whiteSpace: "nowrap",
            }}
            disabled={isPending}
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            style={{
              fontSize: 12,
              color: "red",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              whiteSpace: "nowrap",
            }}
          >
            Cancle
          </button>
        </div>
      )}
    </div>
  );
}
