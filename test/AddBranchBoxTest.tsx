/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/promises-a-plus/index.d.ts" />
/// <reference path="../typings/globals/chai-as-promised/index.d.ts" />

import * as React from "react";
import { shallow, ShallowWrapper, mount } from "enzyme";
import AddBranchBox, { Props } from "../src/AddBranchBox";

const expect = chai.expect;

describe("<AddBranchBox />", () => {
    let wrapper = shallow(<AddBranchBox branchCreated={async ()=>{}} />);
    it("is a form", () => {
	expect(wrapper.is("form")).to.be.true;
    });
    it("has three text inputs", () => {
	expect(wrapper.find('input[type="text"]')).to.have.length(3);
    });
    it("has a submit button", () => {
	expect(wrapper.find('[type="submit"]')).to.have.length(1);
    });
    it("has a promise visualizer", () => {
	expect(wrapper.find("Visualizer")).to.have.length(1);
    });
    it("calls props.branchCreated when submitting the form", () => {
	let spy = sinon.spy(async () => {});
	let wrapper = mount(<AddBranchBox branchCreated={spy} />);
	wrapper.find("form").simulate("submit");
	expect(spy).to.be.calledOnce;
    });
});
