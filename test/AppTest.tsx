/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/promises-a-plus/index.d.ts" />
/// <reference path="../typings/globals/chai-as-promised/index.d.ts" />

import * as React from "react";
import { shallow } from "enzyme";
import App from "../src/App";
import { ByMock } from "./FakeAPI";

const expect = chai.expect;
const defaultChangeset = {
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
};

describe("<App />", () => {
    let api = new ByMock();
    
    let wrapper = shallow(<App API={api} />);
    api.update(defaultChangeset);
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

    it("merges changeset into it", () => {
	let wrapper = shallow(<App API={api} />);
	api.update(defaultChangeset);
	wrapper.update();

	api.update({
	    deleted: ["Ronmi/some-go-project"],
	    modified: [
		// add another go projects
		{
		    name: "Ronmi/another-go-project",
		    branches: [
			{ name: "main", owner: "ronmi", desc: "stable" },
			{ name: "dev", owner: "ronmi", desc: "develop" },
		    ],
		},
		// delete a branch in toy router
		{
		    name: "Ronmi/react-toy-router",
		    branches: [
			{ name: "main", owner: "ronmi", desc: "stable" },
		    ],
		},
	    ],
	});
	wrapper.update();

        expect(wrapper.find("div.projects > Project")).to.have.length(3);
	expect(wrapper.find("div.projects > Project").findWhere((n) => {
	    if (!n.is("Project")) return false;
	    const info = n.prop("project");

	    return info.name === "Ronmi/react-toy-router" && info.branches.length === 1;
	})).to.have.length(1);
    });
});
