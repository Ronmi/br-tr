import { Project } from "./types";

export type Callback = (changeset: ChangeSet) => void;

export interface ChangeSet {
    modified?: Project[]; // including new projects
    deleted?: string[]; // only repo name
}

// onUpdate
export interface API {
    updateOwner(repo: string, branch: string, owner: string): Promise<void>;
    updateDesc(repo: string, branch: string, desc: string): Promise<void>;
    onUpdate(cb: Callback): void;
}
