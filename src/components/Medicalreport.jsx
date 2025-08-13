import React, { useState } from "react";
import Nav from "./Nav";
import Footer from "./Footer";

function Medicalreport() {
    const [inputMessage, setInputMessage] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultJSON, setResultJSON] = useState(null);
    const [error, setError] = useState(null);

    const handleInputChange = (event) => {
        setInputMessage(event.target.value.trim());
    };

    const handleMedicineClick = (event) => {
        setInputMessage(event.target.innerText.trim());
    };

    const generateReport = async () => {
        if (!inputMessage) {
            setError("Please enter or select a medicine.");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch("https://api.cohere.ai/generate", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_COHERE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "command-xlarge-nightly",
                    prompt: `${inputMessage}\n\nGenerate a JSON representation of the following details: "Uses", "Dosage", "Side Effects", "Route", "Disclaimer". Ensure the response is a valid JSON object and no extra text.`,
                    max_tokens: 300,
                    temperature: 0.7,
                }),
            });

            const data = await response.json();
            const rawContent = data.text.trim();

            try {
                setResultJSON(JSON.parse(rawContent));
            } catch (parseError) {
                const fixedContent = rawContent.slice(0, rawContent.lastIndexOf("}") + 1);
                setResultJSON(JSON.parse(fixedContent));
            }
        } catch (error) {
            console.error(error);
            setError("Error occurred during generation or JSON parsing.");
        }

        setIsGenerating(false);
    };

    return (
        <>
            <Nav />

            {/* Hero Section */}
            <div className="w-full flex justify-center items-center flex-col mb-10">
                <h1 className="head_text">
                    <span className="text-red-500">Docify</span>
                    <br />
                </h1>
                <h2 className="desc">
                    This tool will tell you about the usage and information of medicines.
                </h2>

                {/* Medicine Buttons */}
                <div className="flex flex-row justify-around mt-5">
                    {["Aspirin", "DOLO 65", "Crocin", "Combiflame", "Diclofenac"].map((medicine) => (
                        <div
                            key={medicine}
                            onClick={handleMedicineClick}
                            className="cursor-pointer rounded-full bg-white border-solid border-2 border-blue-500 px-5 mx-2 transition-all hover:bg-blue-500 hover:text-white hover:scale-105"
                        >
                            {medicine}
                        </div>
                    ))}
                </div>
            </div>

            {/* Search Input */}
            <div className="flex flex-col w-full items-center justify-center">
                <input
                    placeholder="Search for a medicine"
                    type="text"
                    className="w-full p-5 rounded-full border max-w-2xl"
                    value={inputMessage}
                    onChange={handleInputChange}
                />
                <button
                    // style={{ backgroundColor: isGenerating ? "grey" : "#1e40af" }}
                    onClick={generateReport}
                    className="my-5 border-gray-200 text-white flex h-10 w-full max-w-2xl items-center justify-center rounded-md border text-sm transition-all focus:outline-none bg-blue-600 hover:bg-blue-500"
                    disabled={isGenerating || !inputMessage}
                >
                    <p className="text-sm">
                        {isGenerating ? "Generating..." : "Generate report"}
                    </p>
                </button>
            </div>

            {/* Error or Results */}
            <div>
                {error && <p className="text-red-500">{error}</p>}
                {resultJSON && (
                    <div className="max-w-2xl">
                        {["Uses", "Dosage", "Side Effects", "Route", "Disclaimer"].map((field) => (
                            <div
                                key={field}
                                className="my-5 p-5 rounded-md border bg-white"
                            >
                                <h3 className="font-semibold text-lg mb-1">
                                    {field}:
                                </h3>
                                <p>
                                    {typeof resultJSON[field] === "object"
                                        ? JSON.stringify(resultJSON[field], null, 2)
                                        : resultJSON[field]}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Medicalreport;
