import { Project } from "../src/types";
import { API, ChangeSet, Callback, User, Guest } from "../src/API";

export class ByMock implements API {
    private cbs: Callback[];
    private shouldSuccess: boolean;
    private url: string;

    constructor() {
        this.cbs = [];
        this.shouldSuccess = true;
        this.url = "http://google.com";
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
    setURL(u: string) {
        this.url = u;
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
            if (this.shouldSuccess) {
                s(Guest);
                return;
            }
            j();
        });
    }
    authURL(): Promise<string> {
        return new Promise<string>((s, j) => {
            if (this.shouldSuccess) {
                s(this.url);
                return;
            }
            j();
        });
    }
    addBranch(repo: string, branch: string, ref: string, desc: string): Promise<void> {
        return new Promise<void>((res, rej) => {
            if (this.shouldSuccess) {
                res();
                return;
            }
            rej();
        });
    }
}
