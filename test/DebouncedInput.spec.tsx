/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/promises-a-plus/index.d.ts" />
/// <reference path="../typings/globals/chai-as-promised/index.d.ts" />

import * as React from "react";
import { shallow } from "enzyme";
import { DebouncedInput } from "../src/DebouncedInput";

const expect = chai.expect;

describe("<DebouncedInput />", () => {
    it("is an input", () => {
	let wrapper = shallow(<DebouncedInput onChange={() => {}} debounce={100} />);
	expect(wrapper.is("input")).to.be.true;
    });
    it("changes value of input when props.value changes", () => {
	let wrapper = shallow(<DebouncedInput onChange={() => {}} debounce={100} value="test" />);
	expect(wrapper.find("input").prop("value")).to.equal("test");
    });
    it("changes value of input immediately after change event, regarding debounce settings", () => {
	let wrapper = shallow(<DebouncedInput onChange={() => {}} debounce={100} value="test" />);
	wrapper.simulate("change", {target: {value: "test2"}});
	expect(wrapper.find("input").prop("value")).to.equal("test2");
    });
    it("delays 100ms if debounce=100, discarding old one, onChange should not be called before that", async () => {
	let spy = sinon.spy();
	let wrapper = shallow(<DebouncedInput onChange={spy} debounce={100} />);
	wrapper.simulate("change", {target: {value: "test"}});
	await new Promise((s,j) => setTimeout(s, 50));
	expect(spy).not.to.be.called;
	
	wrapper.simulate("change", {target: {value: "test"}});
	await new Promise((s,j) => setTimeout(s, 50));
	expect(spy).not.to.be.called;
	
	await new Promise((s,j) => setTimeout(s, 50));
	expect(spy).to.be.calledOnce;
    });
    it("delivers newest result only", async () => {
	let spy = sinon.spy();
	let wrapper = shallow(<DebouncedInput onChange={spy} debounce={100} />);
	wrapper.simulate("change", {target: {value: "test"}});
	await new Promise((s,j) => setTimeout(s, 50));
	
	wrapper.simulate("change", {target: {value: "test2"}});
	await new Promise((s,j) => setTimeout(s, 100));
	
	expect(spy).to.be.calledWith("test2");
    });
});
