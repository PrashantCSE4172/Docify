import React, { useState } from "react";
import Footer from "./Footer";
import Nav from "./Nav";

export default function Ocr() {
    const [image, setImage] = useState(null);
    const [responseContent, setResponseContent] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [nearbyDoctors, setNearbyDoctors] = useState([]);
    const [lastDisease, setLastDisease] = useState(""); 
    const API_KEY = import.meta.env.VITE_COHERE_API_KEY;

    const convertImageToText = async (event) => {
        event.preventDefault();
        try {
            setIsGenerating(true);
            const base64Image = await convertImageToBase64(image);
            const extractedText = await analyzeImage(base64Image);
            const { extractedText: reportText, detectedDisease } = await handleSendMessage(extractedText);
            setResponseContent(reportText || "No result");

            if (detectedDisease !== lastDisease) {
                console.log(`New disease detected: ${detectedDisease}`); 
                setLastDisease(detectedDisease); 
                setNearbyDoctors([]); 
                fetchNearbyDoctors(detectedDisease); 
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const convertImageToBase64 = (image) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(image);
        });
    };

    const analyzeImage = async (base64Image) => {
        const body = JSON.stringify({
            requests: [
                {
                    image: {
                        content: base64Image,
                    },
                    features: [
                        {
                            type: "TEXT_DETECTION",
                            maxResults: 10,
                        },
                    ],
                },
            ],
        });

        try {
            const response = await fetch(
                `https://vision.googleapis.com/v1/images:annotate?key=${import.meta.env.VITE_OCR}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: body,
                }
            );
            const data = await response.json();
            const extractedText = data.responses[0]?.textAnnotations[0]?.description;
            return extractedText || "No text found.";
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSendMessage = async (inputMessage) => {
        try {
            const prompt = `Interpret this given OCR extracted data into laymen terms. Provide a summary in 100 words. Exclude personal data like name, age, and location. Also, mention seriousness and precautions. Additionally, detect and mention any disease or condition based on the information in the report.\n\n${inputMessage}`;

            const response = await fetch("https://api.cohere.ai/generate", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "command-xlarge-nightly",
                    prompt: prompt,
                    max_tokens: 300,
                    temperature: 0.7,
                }),
            });

            const data = await response.json();
            const extractedText = data.text || "No result";
            const detectedDisease = extractDiseaseFromText(extractedText); 
            return { extractedText, detectedDisease };
        } catch (error) {
            console.error("Error with Cohere API:", error);
        }
    };

    const extractDiseaseFromText = (text) => {
        const diseaseCategories = {
            "cardiovascular": ["heart", "cardiac", "stroke"],
            "neurological": ["brain", "neurology", "stroke", "epilepsy"],
            "respiratory": ["lungs", "asthma", "bronchitis"],
            "diabetes": ["diabetes", "insulin", "blood sugar"],
            "cancer": ["cancer", "tumor", "oncology"],
            "orthopedic": ["joint", "bone", "orthopedic"],
            "general": ["health", "examination", "treatment"]
        };

        for (const category in diseaseCategories) {
            for (let keyword of diseaseCategories[category]) {
                if (text.toLowerCase().includes(keyword)) {
                    return category;
                }
            }
        }

        return "general"; 
    };

    const fetchNearbyDoctors = (diseaseCategory) => {
        const specialtyMap = {
            "cardiovascular": "cardiology",
            "neurological": "neurology",
            "respiratory": "pulmonology",
            "diabetes": "endocrinology",
            "cancer": "oncology",
            "orthopedic": "orthopedics",
            "general": "general practitioner"
        };

        const specialty = specialtyMap[diseaseCategory] || "general practitioner";

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    console.log(`Fetching doctors for specialty: ${specialty}`); 
                    const response = await fetch(
                        `http://localhost:5000/api/nearby-doctors?latitude=${latitude}&longitude=${longitude}&specialty=${specialty}`
                    );
                    const data = await response.json();
                    if (data.results) {
                        const doctors = data.results.slice(0, 5).map((doctor) => ({
                            name: doctor.name,
                            address: doctor.vicinity,
                            rating: doctor.rating || "N/A",
                            image: doctor.photos
                                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${doctor.photos[0].photo_reference}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
                                : "https://via.placeholder.com/150", 
                        }));
                        setNearbyDoctors(doctors);
                    } else {
                        setNearbyDoctors([]);
                    }
                } catch (error) {
                    console.error("Error fetching doctors:", error);
                }
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    const handleChangeImage = (event) => {
        const selectedImage = event.target.files[0];
        setImage(selectedImage);
    };

    return (
        <>
            <div className="w-full flex justify-center items-center flex-col">
                <Nav />
            </div>
            <h1 className="flex flex-col justify-center items-center -mb-4 -mt-10">
                <span className="text-[4rem] font-bold text-red-500">Docify</span>
                <p className="text-2xl font-semibold">Analyse the report and get doctor recommendations</p>
            </h1>
            <div className="flex flex-col items-center p-12 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                    {/* Left Column: File Upload and Interpreted Report */}
                    <div className="shadow-gray-600 flex flex-col h-full w-[30rem] p-6 bg-white shadow-lg rounded-lg">
                        <form className="grid gap-3 w-full">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Upload a file</h2>
                                <label
                                    htmlFor="image-upload"
                                    className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-gray-50 shadow-sm transition-all hover:bg-gray-100"
                                >
                                    <svg
                                        className="h-8 w-8 text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                                        <path d="M12 12v9"></path>
                                        <path d="m16 16-4-4-4 4"></path>
                                    </svg>
                                    <p className="mt-2 text-center text-sm text-gray-500">
                                        Click to upload.
                                    </p>
                                </label>
                                <input
                                    onChange={handleChangeImage}
                                    id="image-upload"
                                    name="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            {image && (
                                <div className="mt-2 text-sm text-gray-700">
                                    Selected file: {image.name}
                                </div>
                            )}

                            <button
                                onClick={convertImageToText}
                                className={`${isGenerating ? "bg-blue-500" : "bg-blue-700"} border-gray-200 text-white flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
                                disabled={isGenerating}
                            >
                                <p className="text-sm">
                                    {isGenerating ? "Generating..." : "Generate report"}
                                </p>
                            </button>
                        </form>
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold">Interpreted Report</h2>
                            <div className="mt-3">
                                {responseContent || "No report generated yet."}
                            </div>
                        </div>
                    </div>
                    
                    <div className="shadow-gray-600 flex flex-col w-[30rem] p-6 bg-white shadow-lg rounded-lg">
                        <h2 className="text-lg font-semibold">Nearby Doctors</h2>
                        <div className="mt-3 grid grid-cols-1 gap-4">
                            {nearbyDoctors.length > 0 ? (
                                nearbyDoctors.map((doctor, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-4 bg-gray-100 p-4 rounded-md"
                                    >
                                        <img
                                            src={doctor.image}
                                            alt="Doctor"
                                            className="h-16 w-16 rounded-full object-cover"
                                        />
                                        <div className="flex flex-col justify-center">
                                            <p className="font-semibold">{doctor.name}</p>
                                            <p>{doctor.address}</p>
                                            <p className="text-sm">Rating: {doctor.rating}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No doctors found. Please ensure your location is enabled.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
