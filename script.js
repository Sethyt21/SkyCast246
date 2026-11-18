
/* =========================================
   SKYCAST246 - JAVASCRIPT to make it do what it does
   Cloud Identification and Learning Website 
========================================= */
// SkyCast246 cloud identification and learning
// =========================================
// 1. GOOGLE TEACHABLE MACHINE MODEL
// =========================================

const MODEL_URL =
    "https://teachablemachine.withgoogle.com/models/PHcKUBLxS/"; // <-- Replace with your published GTM model URL

let model = null;
let photoURL = null;
let currentCloud = null;

// Shortcut for selecting HTML elements
const $ = id => document.getElementById(id);

// Display messages to the user
function setStatus(message) {
    $("status").textContent = message;
}


// =========================================
// 2. CLOUD EDUCATIONAL INFORMATION
// =========================================

const cloudData = {

    cumulus: {
        name: "Cumulus",
        description: "Cumulus clouds are detached clouds with distinct outlines, often white, with darker, relatively flat bases and cauliflower-shaped tops.",
        formation: "Warm, moist air rises through convection, expands and cools. When it reaches saturation, water vapour condenses into droplets, forming a cloud.",
        weather: "Small cumulus clouds usually indicate fair weather. With sufficient moisture and atmospheric instability, they can grow vertically and produce showers."
    },

    cirrus: {
        name: "Cirrus",
        description: "High clouds composed of ice crystals, appearing as thin, white, wispy strands, feathers or hooked filaments.",
        formation: "At high altitudes, rising air cools sufficiently for water vapour to form ice crystals through deposition—the change directly from vapour to ice.",
        weather: "Often occur during fair weather but can also signal an approaching weather system. Precipitation from cirrus normally evaporates before reaching the ground."
    },

    stratus: {
        name: "Stratus",
        description: "Low, gray cloud layers that can cover much of the sky.",
        formation: "A broad layer of moist air cools to its dew point.",
        weather: "Overcast conditions, mist, or light drizzle."
    },

    cumulonimbus: {
        name: "Cumulonimbus",
        description: "Deep clouds with dark bases and towering vertical growth. Their upper portions contain ice crystals and may spread into an anvil shape.",
        formation: "Strong convection lifts moist air through an unstable atmosphere. As the air expands and cools, condensation and freezing support the development of a deep thunderstorm cloud.",
        weather: "Associated with thunderstorms, heavy showers, lightning and strong gusts. Severe storms may also produce hail."
    },

    altocumulus: {
        name: "Altocumulus",
        description: "Mid-level clouds appearing as white or grey rounded patches, rolls or cloudlets, often arranged in groups with shaded areas.",
        formation: "Moist air rises and cools at middle levels of the atmosphere, allowing water vapour to condense. Atmospheric waves can help arrange the clouds into bands or patches.",
        weather: "Usually produce little precipitation reaching the ground. Tower-shaped varieties can indicate instability aloft and the potential for thunderstorms."
    },

    altostratus: {
        name: "Altostratus",
        description: "A broad gray or bluish mid-level cloud sheet.",
        formation: "Air rises gradually across a large area.",
        weather: "May precede widespread precipitation."
    },

    nimbostratus: {
        name: "Nimbostratus",
        description: "Thick, dark cloud layers that often hide the Sun.",
        formation: "Widespread uplift produces a deep, moisture-rich cloud layer.",
        weather: "Often produces prolonged rain."
    },

    stratocumulus: {
        name: "Stratocumulus",
        description: "Low clouds forming white or grey patches, rounded masses or rolls, often with darker shading and gaps between them.",
        formation: "They can form when rising cumulus clouds encounter a temperature inversion—a layer where temperature increases with height—and spread sideways.",
        weather: "Usually produce little or no precipitation, though light drizzle or occasional light rain is possible."
    }

};


// =========================================
// 3. CLOUD INFORMATION FUNCTIONS
// =========================================

function normalize(text) {
    return text.toLowerCase().replace(/[^a-z]/g, "");
}

function getInfo(name) {

    const key = normalize(name);

    return cloudData[key] ||
        Object.entries(cloudData).find(([k]) => key.includes(k))?.[1] ||
        {
            name: name,
            description: "This cloud category does not yet have a description.",
            formation: "Formation information is not available.",
            weather: "Weather information is not available."
        };
}


// =========================================
// 4. AUTOMATICALLY LOAD GTM MODEL
// =========================================

async function loadCloudModel() {

    if (typeof tmImage === "undefined") {
        setStatus("Teachable Machine library could not load. Check your internet connection.");
        return;
    }

    try {

        setStatus("Loading SkyCast246 cloud identification model...");

        model = await tmImage.load(
            MODEL_URL + "model.json",
            MODEL_URL + "metadata.json"
        );

        console.log("SkyCast246 model loaded successfully!");

        setStatus("Cloud model ready! Upload a sky photograph.");

        // Enable prediction if an image is already selected
        $("predict").disabled = !photoURL;

    } catch (error) {

        console.error("Model loading error:", error);

        setStatus("Unable to load cloud model. Check your internet connection.");

    }
}


// =========================================
// 5. IMAGE UPLOAD
// =========================================

function setImage(file) {

    if (!file || !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
        setStatus("Please choose a valid image file.");
        return;
    }

    // Maximum image size: 10 MB
    if (file.size > 10 * 1024 * 1024) {
        setStatus("Please choose an image smaller than 10 MB.");
        return;
    }

    // Clear previous classification when a new image is selected.
    resetPrediction();

    // Remove previous image URL
    if (photoURL) {
        URL.revokeObjectURL(photoURL);
    }

    photoURL = URL.createObjectURL(file);

    $("preview").src = photoURL;
    $("preview").hidden = false;

    $("dropText").hidden = true;

    $("predict").disabled = !model;

    setStatus(
        model
            ? "Image ready. Click Identify Cloud."
            : "Image ready. Waiting for cloud model..."
    );
}


// Image selection
$("photo").addEventListener("change", event => {
    setImage(event.target.files[0]);
});


// Drag and drop
$("drop").addEventListener("dragover", event => {
    event.preventDefault();
});

$("drop").addEventListener("drop", event => {

    event.preventDefault();

    setImage(event.dataTransfer.files[0]);

});


// =========================================
// 6. IDENTIFY CLOUD
// =========================================

$("predict").onclick = async () => {

    if (!model || !photoURL) {
        setStatus("Please upload an image first.");
        return;
    }

    try {

        $("predict").disabled = true;
        setStatus("Analyzing cloud photograph...");

        await $("preview").decode();

        const results = await model.predict($("preview"));

        // Sort predictions from highest to lowest
        results.sort((a, b) => b.probability - a.probability);

        const bestPrediction = results[0];

        showCloud(
            bestPrediction.className,
            bestPrediction.probability
        );

        // Display prediction rankings
        $("rankings").replaceChildren();

        results.forEach(result => {

            const container = document.createElement("div");
            container.className = "ranking";

            const label = document.createElement("div");

            label.textContent =
                `${result.className}: ${(result.probability * 100).toFixed(1)}%`;

            const bar = document.createElement("div");
            bar.className = "bar";

            const fill = document.createElement("i");

            fill.style.width =
                (result.probability * 100) + "%";

            bar.appendChild(fill);

            container.append(label, bar);

            $("rankings").appendChild(container);

        });

        setStatus(
            "Prediction complete! Explore your cloud information below."
        );

    } catch (error) {

        console.error("Prediction error:", error);

        setStatus("Prediction failed. Please try another photograph.");

    } finally {
        $("predict").disabled = !model || !photoURL;
    }

};


// =========================================
// 7. DISPLAY CLOUD INFORMATION
// =========================================

function showCloud(name, probability) {

    currentCloud = name;

    const info = getInfo(name);

    $("cloudName").textContent = name;

    $("confidence").textContent =
        (probability * 100).toFixed(1) + "%";

    $("detailTitle").textContent = info.name;

    $("description").textContent = info.description;

    $("formation").textContent = info.formation;

    $("weather").textContent = info.weather;

    // Create suggested questions
    $("suggested").replaceChildren();

    const questions = [
        `How can I recognize ${name} clouds?`,
        `What weather can ${name} clouds indicate?`,
        `How are ${name} clouds different from similar types?`
    ];

    questions.forEach(question => {

        const button = document.createElement("button");

        button.className = "secondary";

        button.style.display = "block";
        button.style.margin = "9px 0";
        button.style.textAlign = "left";

        button.textContent = question;

        button.onclick = () => {

            $("prompt").value = question +
                " Please explain in the context of Barbados and Caribbean weather.";
            switchTab("copilot");
            openAssistant(true);

        };

        $("suggested").appendChild(button);

    });

    updatePrompt(name);
}


// =========================================
// 8. MICROSOFT COPILOT QUESTIONS
// =========================================

function updatePrompt(name) {

    $("prompt").value =
        `I am a student using SkyCast246, a cloud learning tool in Barbados. ` +
        `Google Teachable Machine predicted the cloud category "${name}" ` +
        `from a photograph. This prediction could be incorrect. ` +
        `Explain how this cloud forms, its appearance, its typical weather ` +
        `in the Caribbean, and how to distinguish it from similar clouds. ` +
        `Then ask me three beginner-friendly quiz questions.`;

}


// Copy question for Copilot
$("copyPrompt").onclick = async () => {

    try {

        await navigator.clipboard.writeText($("prompt").value);

        $("copyPrompt").textContent = "Copied!";

        setTimeout(() => {
            $("copyPrompt").textContent = "Copy Question";
        }, 1800);

    } catch (error) {

        $("prompt").select();

        setStatus("Clipboard unavailable. Please copy the question manually.");

    }

};


// =========================================
// 9. CLOUD LEARNING TABS
// =========================================

function switchTab(tab) {

    document.querySelectorAll(".tab").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.tab === tab
        );

    });

    document.querySelectorAll(".tabPanel").forEach(panel => {

        panel.hidden = panel.id !== tab;

    });

}

document.querySelectorAll(".tab").forEach(button => {

    button.onclick = () => {
        switchTab(button.dataset.tab);
    };

});



// =========================================
// FLOATING ASSISTANT AND CUSTOM QUESTIONS
// =========================================
function openAssistant(showHint = false) {
    $("assistantWindow").hidden = false;
    $("chatToggle").setAttribute("aria-expanded", "true");
    if (showHint) {
        $("assistantHelp").textContent =
            "Your question is ready in the Ask Copilot tab. Click Copy Question, then paste it into the assistant chat below.";
        $("assistantHelp").hidden = false;
    } else {
        $("assistantHelp").hidden = true;
    }
}
function closeAssistant() {
    $("assistantWindow").hidden = true;
    $("chatToggle").setAttribute("aria-expanded", "false");
    $("chatToggle").focus();
}
$("chatToggle").addEventListener("click", () => {
    if ($("assistantWindow").hidden) openAssistant();
    else closeAssistant();
});
$("closeChat").addEventListener("click", closeAssistant);
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !$("assistantWindow").hidden) closeAssistant();
});

$("askCustom").addEventListener("click", () => {
    const question = $("customQuestion").value.trim();
    if (!question) {
        setStatus("Please type a question first.");
        $("customQuestion").focus();
        return;
    }
    $("prompt").value = question +
        (currentCloud ? ` The cloud identified was ${currentCloud}; this prediction may be incorrect.` : "") +
        " Please use Caribbean or Barbados examples where relevant.";
    switchTab("copilot");
    openAssistant(true);
});

function resetPrediction() {
    $("cloudName").textContent = "Waiting for image";
    $("confidence").textContent = "—";
    $("rankings").replaceChildren();
    currentCloud = null;
    $("detailTitle").textContent = "Cloud Learning Hub";
    $("description").textContent = "Identify a cloud to explore its characteristics, formation, and typical weather.";
    $("formation").textContent = "—";
    $("weather").textContent = "—";
    $("suggested").textContent = "Identify a cloud first.";
    $("prompt").value = "";
}

// =========================================
// 10. CLEAR IMAGE AND RESULTS
// =========================================

$("clear").onclick = () => {

    if (photoURL) {
        URL.revokeObjectURL(photoURL);
    }

    photoURL = null;

    $("photo").value = "";

    $("preview").removeAttribute("src");
    $("preview").hidden = true;

    $("dropText").hidden = false;

    $("predict").disabled = true;

    resetPrediction();
    $("customQuestion").value = "";

    setStatus(
        model
            ? "Select a new image to identify another cloud."
            : "Waiting for cloud model..."
    );

};


// =========================================
// 11. CLOUD QUIZ
// =========================================

const quiz = [

    {
        q: "Which cloud type is commonly associated with thunderstorms?",
        opts: ["Cirrus", "Cumulonimbus", "Stratus", "Altocumulus"],
        a: 1
    },

    {
        q: "Which clouds are typically high, thin, and wispy?",
        opts: ["Cirrus", "Cumulus", "Nimbostratus", "Stratus"],
        a: 0
    },

    {
        q: "Which cloud type often looks fluffy with a flat base?",
        opts: ["Altostratus", "Stratus", "Cumulus", "Cirrus"],
        a: 2
    },

    {
        q: "Which cloud type often produces prolonged rain?",
        opts: ["Cirrus", "Cumulus", "Nimbostratus", "Altocumulus"],
        a: 2
    }

];

let qi = 0;

function drawQuiz() {

    const item = quiz[qi];

    $("quizQuestion").textContent = item.q;

    $("quizFeedback").textContent = "";

    $("quizOptions").replaceChildren();

    item.opts.forEach((option, index) => {

        const button = document.createElement("button");

        button.textContent = option;

        button.onclick = () => {

            const buttons = [...$("quizOptions").children];

            buttons.forEach((btn, j) => {

                btn.disabled = true;

                if (j === item.a) {
                    btn.classList.add("correct");
                } else if (j === index) {
                    btn.classList.add("wrong");
                }

            });

            $("quizFeedback").textContent =
                index === item.a
                    ? "Correct! Well done."
                    : "Not quite. The correct answer is " +
                      item.opts[item.a] + ".";

        };

        $("quizOptions").appendChild(button);

    });

}


// Next quiz question
$("nextQuiz").onclick = () => {

    qi = (qi + 1) % quiz.length;

    drawQuiz();

};


// =========================================
// 12. INITIALIZE WEBSITE
// =========================================

drawQuiz();

// Automatically load model when page opens
window.addEventListener("load", loadCloudModel);
