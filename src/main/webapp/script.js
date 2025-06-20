    window.onload = function() {
            const video = document.getElementById('boujeeVideo');
            if (video) {
                video.muted = true;
                video.play().then(() => {
                    console.log('Video started playing successfully.');
                }).catch(error => {
                    console.error('Autoplay prevented:', error);
                });
            }

            // JavaScript for background soundtrack autoplay
            const audio = document.getElementById('backgroundSoundtrack');
            if (audio) {
                audio.volume = 0.9; // Set a default volume (e.g., 50%)
                audio.play().then(() => {
                    console.log('Soundtrack started playing successfully.');
                }).catch(error => {
                    console.error('Soundtrack autoplay prevented:', error);
                    // If autoplay is blocked, you might want to show a button
                    // for the user to manually start the music.
                });
            }

            // JavaScript for Cyber Background effect
            const canvas = document.getElementById('cyberBackgroundCanvas');
            const ctx = canvas.getContext('2d');

            let width = window.innerWidth;
            let height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // Handle canvas resize
            window.addEventListener('resize', () => {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width;
                canvas.height = height;
                initializeMatrixEffect(); // Re-initialize drops on resize
            });

            // Characters for the matrix effect (numbers and symbols)
            const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?`~';
            const fontSize = 16;
            const columns = Math.floor(width / fontSize);

            // Array to store the y-position of each falling character in a column
            const drops = [];
            function initializeMatrixEffect() {
                for (let i = 0; i < columns; i++) {
                    drops[i] = 1; // Start each column at the top
                }
            }

            // Initialize on load
            initializeMatrixEffect();

            // Function to draw the matrix effect
            function drawMatrix() {
                // Dim the old characters slightly to create the trail effect
                ctx.fillStyle = 'rgba(2, 21, 41, 0.05)'; /* Matches body background with transparency */
                ctx.fillRect(0, 0, width, height);

                ctx.fillStyle = '#0F0'; /* Green color for the numbers */
                ctx.font = `${fontSize}px monospace`; /* Monospace font for consistent spacing */

                for (let i = 0; i < drops.length; i++) {
                    const text = characters.charAt(Math.floor(Math.random() * characters.length));
                    const x = i * fontSize;
                    const y = drops[i] * fontSize;

                    ctx.fillText(text, x, y);

                    // Send the drop back to the top randomly
                    if (y > height && Math.random() > 0.975) {
                        drops[i] = 0; // Reset to top
                    }
                    drops[i]++; // Move the character down
                }
            }

            // Start the animation loop
            setInterval(drawMatrix, 33); // Approximately 30 frames per second
// the api data fetch
        // Fetch data from the Wikipedia API for "DevOps"
        // Global variable to store the full DevOps extract once fetched
// Global variables
let fullExtractsByTopic = {}; // Stores full extracts for topics we've already fetched
let currentTopicIndex = 0;   // Keeps track of which topic we're currently on

// List of Wikipedia topics related to DevOps
const TOPICS = [
    "DevOps",
    "Agile software development",
    "Continuous integration",
    "Continuous delivery",
    "Microservices",
    "Cloud computing",
    "Site reliability engineering"
];

// Function to fetch and display data for a specific topic
async function fetchAndDisplayTopic(topic) {
    const factsContainer = document.getElementById('devops-facts-container');
    if (!factsContainer) {
        console.error("DevOps facts container not found in HTML!");
        return;
    }

    // Try to get extract from cache first
    let extract = fullExtractsByTopic[topic];

    if (!extract) { // If not cached, fetch it
        console.log(`Fetching new information for: ${topic}`);
        try {
            const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(topic)}&origin=*`);
            const data = await response.json();

            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];

            if (pageId && pages[pageId] && pages[pageId].extract) {
                extract = pages[pageId].extract;
                fullExtractsByTopic[topic] = extract; // Cache the extract
            } else {
                extract = ""; // No extract found for this topic
                console.warn(`No extract found for topic: ${topic}`);
            }
        } catch (error) {
            console.error(`Error fetching data for ${topic} from Wikipedia:`, error);
            extract = ""; // Set extract to empty on error
        }
    } else {
        console.log(`Using cached information for: ${topic}`);
    }

    // Now, display the facts from the fetched/cached extract
    displayTopicFacts(extract, topic);
}

// Function to display the extracted facts for the current topic
function displayTopicFacts(text, topicTitle) {
    const factsContainer = document.getElementById('devops-facts-container');
    if (!factsContainer) {
        // This check should already be done by the calling function, but as a safeguard
        console.error("DevOps facts container not found in HTML!");
        return;
    }

    // Define keywords relevant to general tech/DevOps concepts
    // These are broad enough to apply to various related topics
    const relevantKeywords = ["culture", "automation", "lean", "measure", "share", "tools",
                              "collaboration", "integration", "delivery", "cicd", "continuous",
                              "principles", "workflow", "methodology", "practices", "software",
                              "system", "application", "development", "operations", "infrastructure",
                              "cloud", "agile", "testing", "monitoring"];

    // Maximum character length for displayed facts
    const MAX_FACT_LENGTH = 180; // Slightly increased for more content per fact

    let allPotentialFacts = []; // Store all sentences that contain keywords

    // Split the text into individual sentences
    const sentences = text.split(/(?<=[.!?])\s+/);

    // Filter sentences that contain any of our keywords
    sentences.forEach(sentence => {
        const containsKeyword = relevantKeywords.some(keyword =>
            sentence.toLowerCase().includes(keyword)
        );
        if (containsKeyword) {
            allPotentialFacts.push(sentence);
        }
    });

    let selectedFacts = [];

    // If we have potential facts, select a subset and process for length
    if (allPotentialFacts.length > 0) {
        // Randomly shuffle the facts to ensure variety on each display
        allPotentialFacts.sort(() => Math.random() - 0.5);

        // Select up to 3 facts, applying truncation
        for (let i = 0; i < allPotentialFacts.length && selectedFacts.length < 3; i++) {
            let currentFact = allPotentialFacts[i];
            let processedFact = currentFact;

            // Truncate if too long, add ellipsis
            if (currentFact.length > MAX_FACT_LENGTH) {
                processedFact = currentFact.substring(0, MAX_FACT_LENGTH).trim();
                if (processedFact.length < currentFact.length) { // Only add if actually shortened
                    processedFact += '...';
                }
            }
            selectedFacts.push(processedFact);
        }
    }

    // Update the content of the facts container
    if (selectedFacts.length === 0) {
        // Fallback: If no specific facts or too few found, display a truncated intro
        let introText = text.substring(0, 350); // Get more of the intro for fallback
        if (introText.length > 0 && introText.length < text.length) {
            introText += '...';
        } else if (introText.length === 0 && text.length === 0) {
            introText = `No detailed information found for "${topicTitle}" from Wikipedia at this time.`;
        }
        factsContainer.innerHTML = `<p>Could not find specific facts for ${topicTitle}, but here's the intro: ${introText}</p>`;
    } else {
        // If facts were found, display them with a heading
        factsContainer.innerHTML = `<h3>Interesting Facts about ${topicTitle}:</h3>`;
        selectedFacts.forEach(fact => {
            factsContainer.innerHTML += `<p>- ${fact}</p>`;
        });
    }

    // Make sure the container is visible
    factsContainer.style.opacity = '1';
    factsContainer.style.visibility = 'visible';
}

// Function to manage the appearance, disappearance, and refresh of topics
function cycleTopics() {
    const factsContainer = document.getElementById('devops-facts-container');
    if (!factsContainer) return;

    // Step 1: Fade out the current facts
    factsContainer.style.opacity = '0';
    factsContainer.style.visibility = 'hidden';

    // Step 2: Wait for fade-out, then update content and fade in
    setTimeout(() => {
        // Move to the next topic
        currentTopicIndex = (currentTopicIndex + 1) % TOPICS.length;
        const nextTopic = TOPICS[currentTopicIndex];

        // Fetch and display the next topic's facts
        fetchAndDisplayTopic(nextTopic);

        // The displayTopicFacts function will set opacity back to 1 and visibility to visible
    }, 1000); // Wait 1 second (match CSS transition for fade-out)
}

// Initial load: Fetch and display the first topic
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayTopic(TOPICS[currentTopicIndex]);
});

// Set up the interval to cycle topics every 8 seconds (8000 milliseconds)
setInterval(cycleTopics, 8000);        
        };




