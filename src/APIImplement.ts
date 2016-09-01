import { API, ChangeSet, Callback, User } from "./API";
import { Project } from "./types";

function wrap(path: string, opt: any): Promise<void> {
    return new Promise<void>((res, rej) => {
        fetch(path, opt).then(
            (resp) => {
                if (resp.status < 200 || resp.status >= 300) {
                    rej(resp.status);
                    return;
                }
                res();
            },
            () => { rej(); }
        );
    });
}
function wrapJSON<T>(path: string, opt: any): Promise<T> {
    return new Promise<T>((res, rej) => {
        fetch(path, opt).then(
            (resp) => {
                if (resp.status < 200 && resp.status >= 300) {
                    rej(resp.status);
                }
                return resp.json();
            },
            () => { rej(); }
        ).then(res, rej);
    });
}

// This class needs more abstraction to be tested. At this time, I'm too lazy to refactor it.
export class ByFetch implements API {
    private duration: number; // fetch update every "duration" seconds
    private fetching: boolean; // am I busying fetching?
    private pending: boolean; // is there pending requests?
    private callbacks: Callback[];
    private oldRepos: string[];
    constructor(d = 10) {
        this.duration = d;
        this.fetching = false;
        this.pending = false;
        this.callbacks = [];
        this.oldRepos = [];
    }

    private fetch: () => void = () => {
        if (this.fetching) {
            this.pending = true;
            return;
        }
        this.fetching = true;
        this.doFetch();
    }

    setupInterval() {
        this.fetch();
        setInterval(this.fetch, this.duration * 1000);
    }
    dispatch(p: Project[]) {
        let c: ChangeSet = {
            modified: p
        };
        let del: string[] = [];

        let repos: { [name: string]: boolean } = {};
        for (let i = 0; i < p.length; i++) {
            repos[p[i].name] = true;
        }

        for (let old in this.oldRepos) {
            if (!repos[old]) {
                del.push(old);
            }
        }
        if (del.length > 0) {
            c.deleted = del;
        }
        this.oldRepos = Object.keys(repos);

        for (let i = 0; i < this.callbacks.length; i++) {
            this.callbacks[i](c);
        }
    }
    async doFetch(): Promise<void> {
        let projects: Project[] = [];
        try {
            let res = await fetch("/api/list", {
                credentials: "same-origin",
            });
            projects = await res.json() as Project[];
        } catch (e) { }

        // finally
        if (projects.length > 0) {
            this.dispatch(projects);
        }

        if (this.pending) {
            this.pending = false;
            this.fetch();
            return;
        }
        this.fetching = false;
    }

    updateOwner(repo: string, branch: string, owner: string): Promise<void> {
        return wrap("/api/setOwner", {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                repo: repo,
                branch: branch,
                owner: owner,
            }),
        });
    }
    updateDesc(repo: string, branch: string, desc: string): Promise<void> {
        return wrap("/api/setDesc", {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                repo: repo,
                branch: branch,
                desc: desc,
            }),
        });
    }
    onUpdate(cb: Callback): void {
        this.callbacks.push(cb);

        // start periodical fetch after first cb registered
        this.setupInterval();
    }
    me(): Promise<User> {
        return wrapJSON<User>("/api/me", {
            credentials: "same-origin",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });
    }
    authURL(): Promise<string> {
        return wrapJSON("/api/auth", {
            credentials: "same-origin",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        });
    }
    addBranch(repo: string, branch: string, desc: string): Promise<void> {
        return wrap("/api/addBranch", {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                repo: repo,
                branch: branch,
                desc: desc,
            }),
        });
    }
}
