import React from "react";
import Nav from "./Nav";

const Hero = () => {
	return (
		<>
			<div className="w-full flex justify-center items-center flex-col">
				<Nav />
			</div>
			<div className="w-full flex justify-center items-center flex-col text-center px-4">
				<h1 className="head_text">
					<span className="text-red-500">Docify</span>
					<br />
					<span className="description">Your Medical Report Assistant</span>
				</h1>
				<h2 className="desc mt-4">
					Analyze your medical reports and get personalized doctor
					recommendations to guide your health journey with confidence.
				</h2>
			</div>
		</>
	);
};

export default Hero;
