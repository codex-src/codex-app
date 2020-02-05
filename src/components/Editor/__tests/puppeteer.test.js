import * as ppt from "./ppt"
import React from "react"
import ReactDOM from "react-dom"

let initialValue = ""
let page = null
let exit = null

// TODO:
//
// x Cut
// x Copy
// x Paste
// - IME
// - stress-test.md
// - readme.md
//
beforeAll(async () => {
	jest.setTimeout(180e3)
	const product = process.env.BROWSER
	;[page, exit] = await ppt.newPage(product, "http://localhost:3000")
	initialValue = await ppt.innerText(page)
})

afterAll(async () => {
	await exit()
})

test("cannot delete contenteditable", async () => {
	await ppt.reset(page)
	await ppt.backspace(page)
	await ppt.backspaceWord(page)
	await ppt.backspaceForwards(page)
	await ppt.backspaceWordForwards(page)
	const data = await ppt.innerText(page)
	expect(data).toBe("")
})

// # subgroup: face-smiling
//
// https://unicode.org/Public/emoji/13.0/emoji-test.txt
test("can type and delete emojis (1 of 3)", async () => {
	await ppt.reset(page)
	await ppt.type(page, "😀😃😄😁😆😅🤣😂🙂🙃😉😊😇")
	let data = await ppt.innerText(page)
	expect(data).toBe("😀😃😄😁😆😅🤣😂🙂🙃😉😊😇")
	for (let index = 0; index < 13; index++) {
		await ppt.backspace(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

// # subgroup: family
//
// https://unicode.org/Public/emoji/13.0/emoji-test.txt
test("can type and delete emojis (2 of 3)", async () => {
	await ppt.reset(page)
	await ppt.type(page, "🧑‍🤝‍🧑🧑🏻‍🤝‍🧑🏻🧑🏻‍🤝‍🧑🏼🧑🏻‍🤝‍🧑🏽🧑🏻‍🤝‍🧑🏾🧑🏻‍🤝‍🧑🏿🧑🏼‍🤝‍🧑🏻🧑🏼‍🤝‍🧑🏼🧑🏼‍🤝‍🧑🏽🧑🏼‍🤝‍🧑🏾🧑🏼‍🤝‍🧑🏿🧑🏽‍🤝‍🧑🏻🧑🏽‍🤝‍🧑🏼🧑🏽‍🤝‍🧑🏽🧑🏽‍🤝‍🧑🏾🧑🏽‍🤝‍🧑🏿🧑🏾‍🤝‍🧑🏻🧑🏾‍🤝‍🧑🏼🧑🏾‍🤝‍🧑🏽🧑🏾‍🤝‍🧑🏾🧑🏾‍🤝‍🧑🏿🧑🏿‍🤝‍🧑🏻🧑🏿‍🤝‍🧑🏼🧑🏿‍🤝‍🧑🏽🧑🏿‍🤝‍🧑🏾🧑🏿‍🤝‍🧑🏿")
	let data = await ppt.innerText(page)
	expect(data).toBe("🧑‍🤝‍🧑🧑🏻‍🤝‍🧑🏻🧑🏻‍🤝‍🧑🏼🧑🏻‍🤝‍🧑🏽🧑🏻‍🤝‍🧑🏾🧑🏻‍🤝‍🧑🏿🧑🏼‍🤝‍🧑🏻🧑🏼‍🤝‍🧑🏼🧑🏼‍🤝‍🧑🏽🧑🏼‍🤝‍🧑🏾🧑🏼‍🤝‍🧑🏿🧑🏽‍🤝‍🧑🏻🧑🏽‍🤝‍🧑🏼🧑🏽‍🤝‍🧑🏽🧑🏽‍🤝‍🧑🏾🧑🏽‍🤝‍🧑🏿🧑🏾‍🤝‍🧑🏻🧑🏾‍🤝‍🧑🏼🧑🏾‍🤝‍🧑🏽🧑🏾‍🤝‍🧑🏾🧑🏾‍🤝‍🧑🏿🧑🏿‍🤝‍🧑🏻🧑🏿‍🤝‍🧑🏼🧑🏿‍🤝‍🧑🏽🧑🏿‍🤝‍🧑🏾🧑🏿‍🤝‍🧑🏿")
	for (let index = 0; index < 26; index++) {
		await ppt.backspace(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

// # subgroup: subdivision-flag
//
// https://unicode.org/Public/emoji/13.0/emoji-test.txt
test("can type and delete emojis (3 of 3)", async () => {
	await ppt.reset(page)
	await ppt.type(page, "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}")
	let data = await ppt.innerText(page)
	expect(data).toBe("\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}")
	for (let index = 0; index < 3; index++) {
		await ppt.backspace(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete characters", async () => {
	await ppt.reset(page)
	await ppt.type(page, "Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	let data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	for (let index = 0; index < 52; index++) {
		await ppt.backspace(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete words", async () => {
	await ppt.reset(page)
	await ppt.type(page, "Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	let data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	await ppt.backspaceWord(page)
	data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀\n\nHello, world! 😀\n\nHello, ")
	await ppt.backspaceWord(page)
	data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀\n\nHello, world! 😀\n\n")
	await ppt.backspaceWord(page)
	data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀\n\nHello, world! 😀\n")
	await ppt.backspaceWord(page)
	data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀\n\nHello, world! 😀")
	await ppt.backspaceWord(page)
	data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀\n\nHello, ")
	await ppt.backspaceWord(page)
	data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀\n\n")
	await ppt.backspaceWord(page)
	data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀\n")
	await ppt.backspaceWord(page)
	data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀")
	await ppt.backspaceWord(page)
	data = await ppt.innerText(page)
	expect(data).toBe("Hello, ")
	await ppt.backspaceWord(page)
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete (forwards) characters", async () => {
	await ppt.reset(page)
	await ppt.type(page, "Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	let data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	for (let index = 0; index < 52; index++) {
		await ppt.press(page, "ArrowLeft")
	}
	for (let index = 0; index < 52; index++) {
		await ppt.backspaceForwards(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete (forwards) words", async () => {
	await ppt.reset(page)
	await ppt.type(page, "Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	let data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	for (let index = 0; index < 52; index++) {
		await ppt.press(page, "ArrowLeft")
	}
	await ppt.backspaceWordForwards(page)
	data = await ppt.innerText(page)
	expect(data).toBe(", world! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	await ppt.backspaceWordForwards(page)
	data = await ppt.innerText(page)
	expect(data).toBe("! 😀\n\nHello, world! 😀\n\nHello, world! 😀")
	await ppt.backspaceWordForwards(page)
	data = await ppt.innerText(page)
	expect(data).toBe("\n\nHello, world! 😀\n\nHello, world! 😀")
	await ppt.backspaceWordForwards(page)
	data = await ppt.innerText(page)
	expect(data).toBe("\nHello, world! 😀\n\nHello, world! 😀")
	await ppt.backspaceWordForwards(page)
	data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀\n\nHello, world! 😀")
	await ppt.backspaceWordForwards(page)
	data = await ppt.innerText(page)
	expect(data).toBe(", world! 😀\n\nHello, world! 😀")
	await ppt.backspaceWordForwards(page)
	data = await ppt.innerText(page)
	expect(data).toBe("! 😀\n\nHello, world! 😀")
	await ppt.backspaceWordForwards(page)
	data = await ppt.innerText(page)
	expect(data).toBe("\n\nHello, world! 😀")
	await ppt.backspaceWordForwards(page)
	data = await ppt.innerText(page)
	expect(data).toBe("\nHello, world! 😀")
	await ppt.backspaceWordForwards(page)
	data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀")
	await ppt.backspaceWordForwards(page)
	data = await ppt.innerText(page)
	expect(data).toBe(", world! 😀")
	await ppt.backspaceWordForwards(page)
	data = await ppt.innerText(page)
	expect(data).toBe("! 😀")
	await ppt.backspaceWordForwards(page)
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete 100x paragraphs", async () => {
	await ppt.reset(page)
	await ppt.type(page, "\n".repeat(100))
	let data = await ppt.innerText(page)
	expect(data).toBe("\n".repeat(100))
	for (let index = 0; index < 100; index++) {
		await ppt.press(page, "Backspace")
	}
	await ppt.press(page, "Backspace")
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can type and delete (forwards) 100x paragraphs", async () => {
	await ppt.reset(page)
	await ppt.type(page, "\n".repeat(100))
	let data = await ppt.innerText(page)
	expect(data).toBe("\n".repeat(100))
	for (let index = 0; index < 100; index++) {
		await ppt.press(page, "ArrowLeft")
	}
	for (let index = 0; index < 100; index++) {
		await ppt.press(page, "Delete")
	}
	await ppt.press(page, "Delete")
	data = await ppt.innerText(page)
	expect(data).toBe("")
})

test("can undo and redo", async () => {
	// https://stackoverflow.com/a/39914235
	await new Promise(r => setTimeout(r, 1e3)) // Store the current undo
	const currentValue = await ppt.innerText(page)
	for (let index = 0; index < 20; index++) {
		await ppt.undo(page)
	}
	let data = await ppt.innerText(page)
	expect(data).toBe(initialValue)
	for (let index = 0; index < 20; index++) {
		await ppt.redo(page)
	}
	data = await ppt.innerText(page)
	expect(data).toBe(currentValue)
})

test("can undo and overwrite redo", async () => {
	for (let index = 0; index < 20; index++) {
		await ppt.undo(page)
	}
	let data = await ppt.innerText(page)
	expect(data).toBe(initialValue)
	await ppt.type(page, "Hello, world! 😀")
	data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀")
	await ppt.redo(page)
	data = await ppt.innerText(page)
	expect(data).toBe("Hello, world! 😀")
})
