import React from "react"

const Footer = () => {
	return (
		<footer className='flex mt-12 mb-5 pt-12 justify-center items-center content-end'>
			<div>
				<div className='text-center'>
					<span>
						Disclaimer please consult a certified Medical Practitioner for
						treatments
					</span>
				</div>
				<div className='text-center'>
					<span className='text-black pt-12'>
						Made with love ❤️ by{" "}
						<a href='#' className='font-bold blue_gradient'>
							TEAM DOC-DETECTIVES
						</a>{" "}
						for Innotech - 2024
					</span>
				</div>
			</div>
		</footer>
	)
}

export default Footer
