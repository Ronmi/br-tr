import { Project } from "./types";

export type Callback = (changeset: ChangeSet) => void;

export interface ChangeSet {
    modified?: Project[]; // including new projects
    deleted?: string[]; // only repo name
}

export interface User {
    id?: number;
    username: string;
    name: string;
    avatar: string;
}

export var Guest = {
    id: 0,
    username: "guest",
    name: "guest",
    avatar: "//patrolavia.com/logo64.png",
};

// onUpdate
export interface API {
    updateOwner(repo: string, branch: string, owner: string): Promise<void>;
    updateDesc(repo: string, branch: string, desc: string): Promise<void>;
    onUpdate(cb: Callback): void;
    me(): Promise<User>;
}
