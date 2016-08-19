import { API, ChangeSet, Callback } from "./API";
import { Project } from "./types";

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
            let res = await fetch("/api/list");
            projects = await res.json() as Project[];
        } catch (e) {}

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

    async updateOwner(repo: string, branch: string, owner: string) {
        await fetch("/api/setOwner", {
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
    async updateDesc(repo: string, branch: string, desc: string) {
        await fetch("/api/setDesc", {
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
}
