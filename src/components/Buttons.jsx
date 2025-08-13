import React from "react";
import { Link } from "react-router-dom";
import "./buttons.css";

const Buttons = () => {
	return (
		<div className="flex flex-row justify-around w-full mt-12">
			{/* Upload Report Button */}
			<div className="flex flex-col p-5 items-center text-center w-64 max-w-xl mx-2 rounded-lg shadow-lg bg-white ring-1 ring-gray-300 transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:ring-blue-400">
				<Link to="/ocr">
					<div>
						<img
							src="../src/assets/upload.png"
							alt="Upload Report"
							className="button-img p-5 hover:scale-110 transition-transform"
						/>
					</div>
					<div>
						<span className="text-center text-base text-gray-800 font-semibold">
							Scan your medical report to get insights and doctor recommendations
						</span>
					</div>
					<div className="flex justify-center mt-5 text-blue-600 font-bold hover:text-blue-800 transition-colors">
						UPLOAD REPORT
					</div>
				</Link>
			</div>

			{/* Medicine Details Button */}
			<div className="flex flex-col p-5 items-center text-center w-64 max-w-xl mx-2 rounded-lg shadow-lg bg-white ring-1 ring-gray-300 transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:ring-blue-400">
				<Link to="/medical">
					<div>
						<img
							src="../src/assets/medicine.png"
							alt="Medicine Details"
							className="button-img p-5 hover:scale-110 transition-transform"
						/>
					</div>
					<div>
						<span className="text-center text-base text-gray-800 font-semibold">
							Learn more about medicine and its uses
						</span>
					</div>
					<div className="flex justify-center mt-5 text-blue-600 font-bold hover:text-blue-800 transition-colors">
						MEDICINE DETAILS
					</div>
				</Link>
			</div>
		</div>
	);
};

export default Buttons;
