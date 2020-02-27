import * as constants from "__constants"
import * as Feather from "react-feather"
import * as ProgressBar from "components/ProgressBar"
import firebase from "__firebase"
import Link from "utils/RouterLink"
import React from "react"
import { ReactComponent as CodexLogo } from "svg/codex_4x1.svg"
import { ReactComponent as GitHubLogo } from "svg/github.svg"
import { ReactComponent as GoogleLogo } from "svg/google.svg"

const Auth = props => {
	const render = ProgressBar.useProgressBar()

	const handleClickGitHub = e => {
		const p = new firebase.auth.GithubAuthProvider()
		firebase.auth()
			.signInWithPopup(p)
			.catch(err => {
				console.warn(err)
			})
	}
	const handleClickGoogle = e => {
		const p = new firebase.auth.GoogleAuthProvider()
		firebase.auth()
			.signInWithPopup(p)
			.catch(err => {
				console.warn(err)
			})
	}
	const handleClickGuest = e => {
		render()
		firebase.auth()
			.signInAnonymously()
			.catch(err => {
				console.warn(err)
			})
	}

	return (
		<div className="!-mt-16 px-6 py-32 flex flex-row justify-center items-center min-h-full bg-gray-50">
			<div className="w-72">

				<div className="my-6 flex flex-row justify-center items-center transform scale-110 origin-bottom">
					<Feather.Layers className="mr-3 w-6 h-6 text-md-blue-a400" />
					<CodexLogo className="w-24 h-6" />
				</div>

				<p className="my-6 text-center font-medium text-px text-gray-900">
					Choose one of the following to{" "}
					continue with{" "}
					<Link className="text-md-blue-a400" to={constants.URL}>
						Codex
					</Link>:
				</p>

				<div className="my-2 px-4 py-3 flex flex-row items-center bg-black hover:bg-gray-900 active:bg-black rounded-md shadow-hero-md hover:shadow-hero-lg active:shadow-hero cursor-pointer select-none tx-150" onClick={handleClickGitHub}>
					<div className="mx-4">
						<GitHubLogo className="w-6 h-6 text-gray-100" />
					</div>
					<p className="font-semibold text-px text-gray-100">
						Continue with GitHub
					</p>
				</div>

				<div className="my-2 px-4 py-3 flex flex-row items-center bg-white hover:bg-gray-100 active:bg-white rounded-md shadow-hero-md hover:shadow-hero-lg active:shadow-hero cursor-pointer select-none tx-150" onClick={handleClickGoogle}>
					<div className="mx-4">
						<GoogleLogo className="w-6 h-6 text-gray-900" />
					</div>
					<p className="font-semibold text-px text-gray-900">
						Continue with Google
					</p>
				</div>

				<hr className="mx-auto my-8 w-32" />
				<p className="my-6 text-center font-medium text-px text-gray-900">
					{/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
					Just want to look around?{"\u00a0\u00a0"}<span className="emoji">👀</span><br />
					<span className="text-md-blue-a400 cursor-pointer" onClick={handleClickGuest}>
						Continue as a guest
					</span>
				</p>

			</div>
		</div>
	)
}

export default Auth
