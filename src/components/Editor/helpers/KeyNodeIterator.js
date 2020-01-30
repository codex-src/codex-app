// import invariant from "invariant"
class KeyNodeIterator {
	constructor(currentNode) {
		Object.assign(this, {
			currentNode, // The current node
			count: 0,    // The iterated count (prev and or next)
		})
	}
	getPrev() {
		const { previousSibling, parentNode } = this.currentNode
		if (previousSibling && previousSibling.getAttribute("data-node")) {
			return previousSibling
		} else if (previousSibling && previousSibling.getAttribute("data-compound-node")) {
			return previousSibling.childNodes[previousSibling.childNodes.length - 1]
		} else if (parentNode && parentNode.previousSibling && parentNode.previousSibling.getAttribute("data-node")) {
			return parentNode.previousSibling
		} else if (parentNode && parentNode.previousSibling && parentNode.previousSibling.getAttribute("data-compound-node")) {
			return parentNode.previousSibling.childNodes[parentNode.previousSibling.childNodes.length - 1]
		}
		return null
	}
	prev() {
		this.currentNode = this.getPrev()
		this.count += this.currentNode !== null
		return this.currentNode
	}
	getNext() {
		const { nextSibling, parentNode } = this.currentNode
		if (nextSibling && nextSibling.getAttribute("data-node")) {
			return nextSibling
		} else if (nextSibling && nextSibling.getAttribute("data-compound-node")) {
			return nextSibling.childNodes[0]
		} else if (parentNode && parentNode.nextSibling && parentNode.nextSibling.getAttribute("data-node")) {
			return parentNode.nextSibling
		} else if (parentNode && parentNode.nextSibling && parentNode.nextSibling.getAttribute("data-compound-node")) {
			return parentNode.nextSibling.childNodes[0]
		}
		return null
	}
	next() {
		this.currentNode = this.getNext()
		this.count += this.currentNode !== null
		return this.currentNode
	}
}

export default KeyNodeIterator
