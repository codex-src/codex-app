import areEqualTrees from "../areEqualTrees"
import React from "react"
import renderDOM from "utils/renderDOM"

describe("group 1", () => {
	test("", () => {
		const Component1 = props => (
			<div memo={0}>
				{/* ... */}
			</div>
		)
		const Component2 = props => (
			<div memo={1}>
				{/* ... */}
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		expect(areEqualTrees(rootNode1, rootNode2)).toBe(true)
	})
})

describe("group 2", () => {
	// NOTE: Use {" "} to create three text nodes.
	test("", () => {
		const Component1 = props => (
			<div>
				Hello,{" "}
				world!
			</div>
		)
		const Component2 = props => (
			<div>
				Hello,{" "}
				world!
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		expect(areEqualTrees(rootNode1, rootNode2)).toBe(true)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				Hello,{" "}
				world!
			</div>
		)
		const Component2 = props => (
			<div>
				Hello,{" "}
				darkness…
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		expect(areEqualTrees(rootNode1, rootNode2)).toBe(false)
	})
})

describe("group 3", () => {
	test("", () => {
		const Component1 = props => (
			<div>
				<em>
					*Hello*
				</em>
				{", "}
				<strong>
					**world**
				</strong>
				!
			</div>
		)
		const Component2 = props => (
			<div>
				<em>
					*Hello*
				</em>
				{", "}
				<strong>
					**world**
				</strong>
				!
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		expect(areEqualTrees(rootNode1, rootNode2)).toBe(true)
	})
	test("", () => {
		const Component1 = props => (
			<div>
				<em>
					*Hello*
				</em>
				{", "}
				<strong>
					**world**
				</strong>
				!
			</div>
		)
		const Component2 = props => (
			<div>
				<em>
					*Hello*
				</em>
				{", "}
				<strong>
					**darkness**
				</strong>
				…
			</div>
		)
		const rootNode1 = renderDOM(<Component1 />)
		const rootNode2 = renderDOM(<Component2 />)
		expect(areEqualTrees(rootNode1, rootNode2)).toBe(false)
	})
})