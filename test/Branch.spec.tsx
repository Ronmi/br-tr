/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/promises-a-plus/index.d.ts" />
/// <reference path="../typings/globals/chai-as-promised/index.d.ts" />

import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import Branch, { Props, State } from "../src/Branch";

const expect = chai.expect;

function s(n = "branch_name", o = "test_owner", d = "test description", c = false): ShallowWrapper<Props, State> {
    let props = {
	descChanged: sinon.spy(() => {return new Promise<void>((s,j) => s());}),
	ownerChanged: sinon.spy(() => {return new Promise<void>((s,j) => s());}),
	chosen: c,
	name: n,
	owner: o,
	desc: d,
    };

    return shallow(<Branch {...props} />);
}

describe("<Branch />", () => {
    it("is a div.branch, without .mine", () => {
	let wrapper = s();

	expect(wrapper.is("div.branch")).to.be.true;
	expect(wrapper.hasClass("mine")).to.be.false;
    });
    it("adds .mine if chosen", () => {
	let wrapper = s("", "", "", true);

	expect(wrapper.hasClass("mine")).to.be.true;
    });
    it("has an .name element for showing branch name", () => {
	let wrapper = s();

	expect(wrapper.find(".name")).to.have.length(1);
	expect(wrapper.find(".name").text()).to.equal("branch_name");
    });
    it("has an .owner element for showing owners", () => {
	let wrapper = s();

	expect(wrapper.find(".owner")).to.have.length(1);
	expect(wrapper.find(".owner").prop("value")).to.equal("test_owner");
    });
    it("has an .desc element for showing description", () => {
	let wrapper = s();

	expect(wrapper.find(".desc")).to.have.length(1);
	expect(wrapper.find(".desc").prop("value")).to.equal("test description");
    });
});
