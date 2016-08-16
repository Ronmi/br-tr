export interface Branch {
    name: string;
    owner?: string;
    desc?: string;
}

export interface Project {
    name: string;
    branches: Branch[];
}
