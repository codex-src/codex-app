import DebugEditor from "./DebugEditor"
import getCoordsScrollTo from "lib/getCoordsScrollTo"
import newGreedyRange from "./helpers/newGreedyRange"
import React from "react"
import ReactDOM from "react-dom"
import shortcut from "./shortcut"
import StatusBar from "components/Note"
import text from "lib/encoding/text"
import useEditor from "./EditorReducer"

import {
	newFPSStyleString,
	perfDOMCursor,
	perfDOMRenderer,
	perfParser,
	perfReactRenderer,
} from "./__perf"

import {
	innerText,
	isBreakNode,
} from "./nodeFns"

import {
	ascendToDOMNode,
	recurseToDOMCursor,
	recurseToVDOMCursor,
} from "./traverseDOM"

import "./editor.css"

export const Context = React.createContext()

// NOTE: Reference-based components rerender much faster
// anonymous components.
//
// https://twitter.com/dan_abramov/status/691306318204923905
function Components(props) {
	return props.components
}

export function Editor(props) {
	const ref = React.useRef()
	const seletionchange = React.useRef()
	const greedy = React.useRef()

	const [state, dispatch] = useEditor(`1
2
3
4
5
6`)

	// 	const [state, dispatch] = useEditor(`# How to build a beautiful blog
	//
	// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	//
	// ## How to build a beautiful blog
	//
	// \`\`\`go
	// package main
	//
	// import "fmt"
	//
	// func main() {
	// 	fmt.Println("hello, world!")
	// }
	// \`\`\`
	//
	// ### How to build a beautiful blog
	//
	// > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	// >
	// > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	// >
	// > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	//
	// #### How to build a beautiful blog
	//
	// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	//
	// ##### How to build a beautiful blog
	//
	// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	//
	// ###### How to build a beautiful blog
	//
	// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`)

	// Should render:
	React.useLayoutEffect(
		React.useCallback(() => {
			perfReactRenderer.restart()
			ReactDOM.render(<Components components={state.Components} />, state.reactDOM, () => {
				perfReactRenderer.stop()
				perfDOMRenderer.restart()
				// https://bugs.chromium.org/p/chromium/issues/detail?id=138439#c10
				const selection = document.getSelection()
				selection.removeAllRanges()

				// const g1 = greedy.current.pos1.greedyDOMNodeIndex
				// const g2 = greedy.current.pos2.greedyDOMNodeIndex

				;[...ref.current.childNodes].map(each => each.remove())          // TODO
				ref.current.append(...state.reactDOM.cloneNode(true).childNodes) // TODO

				perfDOMRenderer.stop()
				dispatch.renderDOMCursor()
			})
		}, [state, dispatch]),
		[state.shouldRender],
	)

	// Should render DOM cursor:
	React.useLayoutEffect(
		React.useCallback(() => {
			if (!state.hasFocus) {
				// No-op.
				return
			}
			perfDOMCursor.restart()
			const selection = document.getSelection()
			const range = document.createRange()
			let { node, offset } = recurseToDOMCursor(ref.current, state.pos1.pos)
			if (isBreakNode(node)) { // Firefox.
				node = ascendToDOMNode(ref.current, node)
			}
			range.setStart(node, offset)
			range.collapse()
			// (Range eagerly dropped)
			selection.addRange(range)
			const coords = getCoordsScrollTo({ bottom: 28 })
			if (coords.y !== -1) {
				window.scrollTo(0, coords.y)
			}
			perfDOMCursor.stop()

			const p = perfParser.duration()
			const r = perfReactRenderer.duration()
			const d = perfDOMRenderer.duration()
			const c = perfDOMCursor.duration()
			const sum = p + r + d + c
			console.log(`%cparser=${p} react=${r} dom=${d} cursor=${c} (${sum})`, newFPSStyleString(sum))
		}, [state]),
		[state.shouldRenderDOMCursor],
	)

	// Start history process (on focus):
	//
	// TODO: Use operations instead of focus?
	React.useEffect(
		React.useCallback(() => {
			if (!state.hasFocus) {
				return
			}
			const id = setInterval(() => {
				dispatch.storeUndoState()
			}, 1e3)
			return () => {
				setTimeout(() => {
					clearInterval(id)
				}, 1e3)
			}
		}, [state, dispatch]),
		[state.hasFocus],
	)

	React.useLayoutEffect(() => {
		const onSelectionChange = e => {
			if (!state.hasFocus) {
				// No-op.
				return
			}
			const { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection()
			if (!anchorNode || !focusNode) {
				// No-op.
				return
			}
			if (
				seletionchange.current                               && // eslint-disable-line
				seletionchange.current.anchorNode   === anchorNode   && // eslint-disable-line
				seletionchange.current.focusNode    === focusNode    && // eslint-disable-line
				seletionchange.current.anchorOffset === anchorOffset && // eslint-disable-line
				seletionchange.current.focusOffset  === focusOffset     // eslint-disable-line
			) {
				// No-op.
				return
			}
			seletionchange.current = { anchorNode, anchorOffset, focusNode, focusOffset }
			const pos1 = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)
			let pos2 = pos1
			if (focusNode !== anchorNode || focusOffset !== anchorOffset) {
				pos2 = recurseToVDOMCursor(ref.current, focusNode, focusOffset)
			}
			dispatch.commitSelect(pos1, pos2)
			greedy.current = newGreedyRange(ref.current, anchorNode, focusNode, pos1, pos2)
		}
		document.addEventListener("selectionchange", onSelectionChange)
		return () => {
			document.removeEventListener("selectionchange", onSelectionChange)
		}
	}, [state, dispatch])

	const { Provider } = Context
	return (
		<Provider value={[state, dispatch]}>
			{React.createElement(
				"article",
				{
					ref,

					style: {
						// paddingBottom: `calc(100vh - ${Math.floor(19 * 1.5) + 28}px)`,
						paddingBottom: 28,
						fontFeatureSettings: "'tnum'",
						transform: state.hasFocus && "translateZ(0px)",
					},

					contentEditable: true,
					suppressContentEditableWarning: true,

					onFocus: dispatch.commitFocus,
					onBlur:  dispatch.commitBlur,

					onKeyDown: e => {
						switch (true) {
						case shortcut.isEnter(e):
							e.preventDefault()
							dispatch.commitEnter()
							break
						case shortcut.isTab(e):
							e.preventDefault()
							dispatch.commitTab()
							break
						case shortcut.isBackspace(e):
							// Defer to native browser behavior because
							// backspace on emoji is well behaved in
							// Chrome and Safari.
							//
							// NOTE: Firefox (72) does not correctly
							// handle backspace on emoji.
							if (state.pos1.pos === state.pos2.pos && state.pos1.pos && !text.isTextRange(state.body.data[state.pos1.pos - 1])) {
								// No-op.
								break
							}
							e.preventDefault()
							dispatch.commitBackspace()
							break
						case shortcut.isBackspaceWord(e):
							e.preventDefault()
							dispatch.commitBackspaceWord()
							break
						case shortcut.isBackspaceLine(e):
							e.preventDefault()
							dispatch.commitBackspaceLine()
							break
						case shortcut.isDelete(e):
							// Defer to native browser behavior because
							// delete on emoji is well behaved in Chrome
							// and Safari.
							//
							// NOTE: Firefox (72) **does** correctly
							// handle delete on emoji.
							if (state.pos1.pos === state.pos2.pos && state.pos1.pos < state.body.data.length && !text.isTextRange(state.body.data[state.pos1.pos])) {
								// No-op.
								break
							}
							e.preventDefault()
							dispatch.commitDelete()
							break
						case shortcut.isDeleteWord(e):
							e.preventDefault()
							// TODO
							break
						// TODO: Not tested on mobile.
						case shortcut.isUndo(e):
							e.preventDefault()
							dispatch.commitUndo()
							break
						// TODO: Not tested on mobile.
						case shortcut.isRedo(e):
							e.preventDefault()
							dispatch.commitRedo()
							break
						case shortcut.isBold(e):
							e.preventDefault()
							// TODO
							return
						case shortcut.isItalic(e):
							e.preventDefault()
							// TODO
							return
						default:
							// No-op.
						}
						const { anchorNode, focusNode } = document.getSelection()
						if (!anchorNode || !focusNode) {
							// No-op.
							return
						}
						greedy.current = newGreedyRange(ref.current, anchorNode, focusNode, state.pos1, state.pos2)
					},

					onInput: e => {
						const { anchorNode, anchorOffset } = document.getSelection()
						const pos = recurseToVDOMCursor(ref.current, anchorNode, anchorOffset)
						let data = ""
						let greedyDOMNode = greedy.current.domNodeStart
						while (greedyDOMNode) {
							data += (greedyDOMNode === greedy.current.domNodeStart ? "" : "\n") + innerText(greedyDOMNode)
							if (greedy.current.domNodeRange > 2 && greedyDOMNode === greedy.current.domNodeEnd) {
								break
							}
							const { nextSibling } = greedyDOMNode
							greedyDOMNode = nextSibling
						}
						dispatch.commitInput(data, greedy.current.pos1.pos, greedy.current.pos2.pos, pos)
					},

					onCut: e => {
						e.preventDefault()
						const data = state.body.data.slice(state.pos1.pos, state.pos2.pos)
						if (data) {
							e.clipboardData.setData("text/plain", data)
						}
						dispatch.commitCut()
					},

					onCopy: e => {
						e.preventDefault()
						const data = state.body.data.slice(state.pos1.pos, state.pos2.pos)
						if (data) {
							e.clipboardData.setData("text/plain", data)
						}
						dispatch.commitCopy()
					},

					onPaste: e => {
						e.preventDefault()
						const data = e.clipboardData.getData("text/plain")
						dispatch.commitPaste(data)
					},

					onDragStart: e => e.preventDefault(),
					onDrop:      e => e.preventDefault(),
				},
			)}
			<DebugEditor />
			<StatusBar />
		</Provider>
	)
}
