import React from "react";
import "./hero.css";
import { Link } from "react-router-dom";

const Nav = () => {
	return (
		<nav className="flex justify-between items-center w-full mb-10 pt-3 flex-row">
			<Link
				to="/"
				className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
			>
				Docify
			</Link>

			<button
				type="button"
				className="px-6 py-2 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:scale-105 transform transition-all duration-300"
			>
				About Us
			</button>
		</nav>
	);
};

export default Nav;
