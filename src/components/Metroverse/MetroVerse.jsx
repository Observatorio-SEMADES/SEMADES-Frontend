import React from "react";
import "../../styles/MetroVerse.css";

export default function MetroVerseButton() {
    const handleClick = () => {
        window.open(
            "https://metroverse.hks.harvard.edu/city/1091/economic-composition?composition_type=establishments",
            "_blank",
            "noopener noreferrer"
        );
    };

    return (
        <div className="metroverse-button" onClick={handleClick}>
            <img
                src="/logo/Logo-Havard.jpeg"
                alt="Logo de Harvard"
                className="metroverse-logo"
            />
            <span className="metroverse-title">MetroVerse</span>
        </div>
    );
}
