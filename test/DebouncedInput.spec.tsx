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
});
