import CodexSVG from "components/CodexSVG"
import React from "react"

// https://codepen.io/zaydek/pen/rNOZNwZ
const CodexLogo = () => (
	<div className="em-context flex flex-row items-center select-none">
		<CodexSVG className="w-16 h-16 text-md-blue-a400" />
		<div className="w-1" />
		<div className="-mt-2">
			<h1
				className="text-6xl leading-none Poppins Poppins-clip-path-top lowercase text-black"
				style={{
					// Do not inherit font-weight or letter-spacing:
					fontWeight: 400,
					letterSpacing: "-0.025em",
				}}
			>
				Codex
			</h1>
		</div>
	</div>
)

export default CodexLogo
