/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/promises-a-plus/index.d.ts" />
/// <reference path="../typings/globals/chai-as-promised/index.d.ts" />

import * as React from "react";
import { shallow } from "enzyme";
import App from "../src/App";
import { ByMock } from "./FakeAPI";

const expect = chai.expect;

describe("<App />", () => {
    let api = new ByMock();
    
    let wrapper = shallow(<App API={api} />);
    api.update({
	modified: [
	    {
		name: "Ronmi/react-toy-router",
		branches: [
		    { name: "main", owner: "ronmi", desc: "stable" },
		    { name: "dev", owner: "ronmi", desc: "develop" },
		],
	    },
	    {
		name: "Ronmi/react-promise-visualizer",
		branches: [
		    { name: "main", owner: "ronmi", desc: "stable" },
		    { name: "dev", owner: "ronmi", desc: "develop" },
		    { name: "exp", owner: "fraina", desc: "experimental" },
		],
	    },
	    {
		name: "Ronmi/some-go-project",
		branches: [
		    { name: "main", owner: "ronmi", desc: "stable" },
		    { name: "dev", owner: "ronmi", desc: "develop" },
		],
	    },
	],
    });
    wrapper.update();

    it("is div", () => {
        expect(wrapper.is("div")).to.be.true;
    });
    it("has a Header", () => {
        expect(wrapper.find("Header")).to.have.length(1);
    });
    it("has a div.projects", () => {
        expect(wrapper.find("div.projects")).to.have.length(1);
    });
    it("contains correct number of Project elements in div.projects", () => {
        expect(wrapper.find("div.projects > Project")).to.have.length(3);
    });
});
