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
    it("is a div.plus", () => {
	expect(wrapper.is("div.plus")).to.be.true;
    });
    it("has an image of img/plus.svg", () => {
	expect(wrapper.find("img")).to.have.length(1);
	expect(wrapper.find("img").prop("src")).to.equal("img/plus.svg");
    });
    it("has a form", () => {
	expect(wrapper.find("form")).to.have.length(1);
    });

    describe("form", () => {
	it("has three text inputs", () => {
	    expect(wrapper.find('form input[type="text"]')).to.have.length(3);
	});
	it("has a submit button", () => {
	    expect(wrapper.find('form [type="submit"]')).to.have.length(1);
	});
	it("has a promise visualizer", () => {
	    expect(wrapper.find("form Visualizer")).to.have.length(1);
	});
	it("calls props.branchCreated when submitting the form", () => {
	    let spy = sinon.spy(async () => {});
	    let wrapper = mount(<AddBranchBox branchCreated={spy} />);
	    wrapper.find("form").simulate("submit");
	    expect(spy).to.be.calledOnce;
	});
    });
});
