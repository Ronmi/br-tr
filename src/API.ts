import { Project } from "./types";

export type Callback = (changeset: ChangeSet) => void;

export interface ChangeSet {
    modified: Project[]; // including new projects
    deleted: Project[];
}

// onUpdate
export interface API {
    updateOwner(repo: string, owner: string): Promise<void>;
    updateDesc(repo: string, desc: string): Promise<void>;
    onUpdate(cb: Callback): void;
}
