import { Project } from "../src/types";
import { API, ChangeSet, Callback, User, Guest } from "../src/API";

export class ByMock implements API {
    private cbs: Callback[];
    private shouldSuccess: boolean;

    constructor() {
        this.cbs = [];
        this.shouldSuccess = true;
    }

    get should(): ByMock { return this; }
    get success(): ByMock {
        this.shouldSuccess = true;
        return this;
    }
    get fail(): ByMock {
        this.shouldSuccess = false;
        return this;
    }
    update(c: ChangeSet) {
        for (let cb of this.cbs) {
            cb(c);
        }
    }

    updateOwner(repo: string, branch: string, owner: string): Promise<void> {
        return new Promise<void>((res, rej) => {
            if (this.shouldSuccess) {
                res();
                return;
            }
            rej();
        });
    }
    updateDesc(repo: string, branch: string, desc: string): Promise<void> {
        return new Promise<void>((res, rej) => {
            if (this.shouldSuccess) {
                res();
                return;
            }
            rej();
        });
    }
    onUpdate(cb: Callback): void {
        this.cbs.push(cb);
    }
    me(): Promise<User> {
        return new Promise<User>((s, j) => {
            s(Guest);
        });
    }
}
