"use client";

import { useEffect, useState } from "react";
import { forbidden } from "next/navigation";

import { wbsMembersSchema, wbsRoleSchema, wbsUsersSchema } from "../../_lib/schema";
import type { WbsMember, WbsUser } from "../../_lib/types";
import { authClient } from "@/lib/auth/auth-client";
import { partition } from "@/lib/array";

type Props = {
    wbsId: string;
};

const MemberList = ({
    wbsId,
}: Props) => {
    const [users, setUsers] = useState<WbsUser[]>([]);
    const [members, setMembers] = useState<WbsMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, isPending, error } = authClient.useSession();
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const res = await fetch(`/api/wbs/member/${wbsId}`);

            if (!res.ok) {
                console.error(await res.json());
                setIsLoading(false);
                return;
            }

            const { users, members } = await res.json();
            const parsedUsers = wbsUsersSchema.safeParse(users);
            const parsedMembers = wbsMembersSchema.safeParse(members);

            if (parsedUsers.success && parsedMembers.success) {
                setUsers(parsedUsers.data);
                setMembers(parsedMembers.data);
            } else {
                console.error(parsedUsers.error);
                console.error(parsedMembers.error);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [wbsId]);

    const handleClickAddMember = () => {
        if (!selectedUserId || !selectedRole) {
            alert("名前とロールを入力してください");
            return;
        }

        const parsedRole = wbsRoleSchema.safeParse(selectedRole);

        if (!parsedRole.success) {
            console.error("ロール", parsedRole);
            return;
        }

        setMembers((prev) => prev.concat({
            id: crypto.randomUUID(),
            userId: selectedUserId,
            userName: users.find((user) => user.id === selectedUserId)?.name || "",
            role: parsedRole.data,
        }));
        setSelectedUserId("");
        setSelectedRole("");
    };

    const handleClickSave = async () => {
        setIsSaving(true);

        const res = await fetch(`/api/wbs/member/${wbsId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                members,
            }),
        });

        if (res.ok) {
            alert("保存しました");
        } else {
            console.error(await res.json());
            alert("保存に失敗しました");
        }

        setIsSaving(false);
    };

    if (isLoading || isPending) {
        return (
            <div className="flex justify-center">
                <div className="animate-ping h-4 w-4 bg-blue-600 rounded-full"></div>
            </div>
        );
    }

    if (error || !session) {
        return (
            <div className="flex justify-center">
                <div>エラーが発生しました</div>
            </div>
        );
    }

    const [me, others] = partition(members, (member) => member.userId === session.user.id);

    if (me.length === 0) {
        forbidden();
    }

    return (
        <div className="px-4 space-y-4">
            <div>
                <div>自分</div>
                <div className="flex space-x-2">
                    <div className="flex-1">名前</div>
                    <div className="flex-1">ロール</div>
                    <div className="flex-1"></div>
                </div>
                <div className="flex space-x-2">
                    <div className="flex-1">{me[0].userName}</div>
                    <div className="flex-1">{me[0].role}</div>
                    <div className="flex-1"></div>
                </div>
            </div>
            <div>
                <div>メンバー</div>
                <div className="flex space-x-2">
                    <div className="flex-1">名前</div>
                    <div className="flex-1">ロール</div>
                    <div className="flex-1"></div>
                </div>
                {others.map((other) => (
                    <div key={other.id} className="flex space-x-2">
                        <div className="flex-1">{other.userName}</div>
                        <div className="flex-1">
                            <select
                                className="w-full p-1 border rounded"
                                value={other.role || ""}
                                onChange={(e) => {
                                    const parsedRole = wbsRoleSchema.safeParse(e.target.value);

                                    if (parsedRole.success) {
                                        setMembers((prev) => prev.map((member) => member.userId === other.userId
                                            ? { ...member, role: parsedRole.data }
                                            : member
                                        ));
                                    }
                                }}
                            >
                                <option value={"admin"}>admin</option>
                                <option value={"editor"}>editor</option>
                                <option value={"viewer"}>viewer</option>
                            </select>
                        </div>
                        <div className="flex-1"></div>
                    </div>
                ))}
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <select
                            className="w-full p-1 border rounded"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                        >
                            <option></option>
                            {users.filter((user) => !members.some((member) => member.userId === user.id)).map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <select
                            className="w-full p-1 border rounded"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option></option>
                            <option value={"admin"}>admin</option>
                            <option value={"editor"}>editor</option>
                            <option value={"viewer"}>viewer</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <button
                            type="button"
                            className="px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 rounded"
                            onClick={handleClickAddMember}
                        >
                            追加
                        </button>
                    </div>
                </div>
            </div>
            <button
                type="button"
                className={[
                    "px-2 py-1 select-none",
                    "bg-blue-500 text-white hover:bg-blue-600 rounded",
                    "disabled:bg-gray-500",
                ].join(" ")}
                disabled={isSaving}
                onClick={handleClickSave}
            >
                保存
            </button>
        </div>
    );
};

export default MemberList;