/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/promises-a-plus/index.d.ts" />
/// <reference path="../typings/globals/chai-as-promised/index.d.ts" />

import * as React from "react";
import { shallow, ShallowWrapper, mount } from "enzyme";
import { Branch as br } from "../src/types";
import Project, { Props } from "../src/Project";

const expect = chai.expect;

function brs(): br[] {
    return [
        { name: "br1", owner: "o1", desc: "d1" },
        { name: "br2", owner: "", desc: "d2" },
        { name: "br3", owner: "o3", desc: "" },
        { name: "br0", owner: "o0", desc: "d0" },
    ];
}

function prop(n = "test/repo", b: br[] = brs()): Props {
    return {
        ownerChanged: (repo: string, br: string, owner: string) => {
            return new Promise<void>((s, j) => {
                s();
            });
        },
        descChanged: (repo: string, br: string, desc: string) => {
            return new Promise<void>((s, j) => {
                s();
            });
        },
        branchCreated: (repo: string, br: string, desc: string) => {
            return new Promise<void>((s, j) => {
                s();
            });
        },
        project: {
            name: n,
            branches: b,
        },
    };
}

describe("<Project />", () => {
    it("is a div.proj, without .mine", () => {
        let wrapper = shallow(<Project {...prop() } />);
        expect(wrapper.is("div.proj")).to.be.true;
        expect(wrapper.hasClass("mine")).to.be.false;
    });
    it("adds .mine to .title if keyword matches some part of repository name", () => {
        let props = prop();
        props.keyword = "test";
        let wrapper = shallow(<Project {...props} />);
        expect(wrapper.find(".title").hasClass("mine")).to.be.true;
    });
    it("has .mine on branches if keyword matches some part of branch name or description", () => {
        let props = prop();
        props.keyword = "br";
        let wrapper = shallow(<Project {...props} />);
        expect(wrapper.find(".branches").findWhere((c) => {
            return c.is("Branch") && c.prop("chosen");
        })).to.have.length(4);
    });
    it("does no searching if keyword is empty", () => {
        let props = prop();
        props.keyword = "";
        let wrapper = shallow(<Project {...props} />);
        expect(wrapper.find(".branches").findWhere((c) => {
            return c.is("Branch") && c.prop("chosen");
        })).to.have.length(0);
    });
    it("has a .name element for repository name", () => {
        let wrapper = shallow(<Project {...prop("test/repo", []) } />);
        expect(wrapper.find(".name")).to.have.length(1);
        expect(wrapper.find(".name").text()).to.equal("test/repo");
    });
    it("has an AddBranchBox in .title", () => {
        let wrapper = shallow(<Project {...prop("test/repo", []) } />);
        expect(wrapper.find(".title AddBranchBox")).to.have.length(1);
    })
    it("does not contain div or Branch element if branch info not exists", () => {
        let wrapper = shallow(<Project {...prop("test/repo", []) } />);
        expect(wrapper.find("branches")).to.have.length(0);
        expect(wrapper.find("branch")).to.have.length(0);
    });
    it("has a div.branches and correct numbers of Branch if branch info exists", () => {
        let wrapper = shallow(<Project {...prop() } />);
        expect(wrapper.find("div.branches")).to.have.length(1);
        expect(wrapper.find("Branch")).to.have.length(4);
    });
    it("adds .hidden to div.branches if it is not expanded (default not expanded)", () => {
        let wrapper = shallow(<Project {...prop() } />);
        expect(wrapper.find("div.branches.hidden")).to.have.length(1);
    });
    it("removes .hidden from div.branches if it is expanded (toggles by clicking on .title)", () => {
        let wrapper = shallow(<Project {...prop() } />);
        wrapper.find(".proj > .title").simulate("click", {});
        expect(wrapper.find("div.branches").hasClass("hidden")).to.be.false;
    });
    it("does not trigger expanding by clicking on .plus", () => {
        let wrapper = mount(<Project {...prop() } />);
        wrapper.find(".proj .plus").simulate("click");
        expect(wrapper.find("div.branches").hasClass("hidden")).to.be.true;
    });

    describe("searching", () => {
	function w(kw: string) {
	    let props = prop();
	    props.keyword = kw;
	    return shallow(<Project {...props} />);
	}
	it("adds .hidden to div.proj if name, branch name and branch desc do not matching keyword", () => {
	    let wrapper = w("non-exist");
	    expect(wrapper.is("div.hidden")).to.be.true;
	});
	it("expands when any branch matches to keyword", () => {
	    let wrapper = w("b");
	    expect(wrapper.find("div.branches").hasClass("hidden")).to.be.false;
	});
	it("collapses if no branch matches", () => {
	    let wrapper = w("repo");
	    expect(wrapper.find("div.branches").hasClass("hidden")).to.be.true;
	});
	it("expends when clicking on collapsed project", () => {
	    let wrapper = w("repo");
	    wrapper.find("div.title").simulate("click", {});
	    wrapper.update();
	    expect(wrapper.find("div.branches").hasClass("hidden")).to.be.false;
	});
	it("collapses when clicking on expanded project", () => {
	    let wrapper = w("b");
	    wrapper.find("div.title").simulate("click", {});
	    wrapper.update();
	    expect(wrapper.find("div.branches").hasClass("hidden")).to.be.true;
	});
    });

    describe("exported methods", () => {
        it("expands after calling expand()", () => {
            let wrapper = shallow(<Project {...prop() } />);
            (wrapper.instance() as Project).expand();
            wrapper.update();
            expect(wrapper.find("div.branches").hasClass("hidden")).to.be.false;
        });
        it("collapses after calling collapse()", () => {
            let wrapper = shallow(<Project {...prop() } />);
            wrapper.find(".proj > .title").simulate("click", {});
            (wrapper.instance() as Project).collapse();
            wrapper.update();
            expect(wrapper.find("div.branches").hasClass("hidden")).to.be.true;
        });
    });
});
