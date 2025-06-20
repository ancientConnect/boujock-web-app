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
// KELVIN the 1st doing his thang! lol
            // enabling background soundtrack autoplay
            const audio = document.getElementById('backgroundSoundtrack');
            if (audio) {
                audio.volume = 0.9; // sets default volume as 90%
                audio.play().then(() => {
                    console.log('Soundtrack started playing successfully.');
                }).catch(error => {
                    console.error('Soundtrack autoplay prevented:', error);
                });
            }

            // enabling cyber background effect
            const canvas = document.getElementById('cyberBackgroundCanvas');
            const ctx = canvas.getContext('2d');

            let width = window.innerWidth;
            let height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // handling canvas resize
            window.addEventListener('resize', () => {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width;
                canvas.height = height;
                initializeMatrixEffect(); // re-initializing the drops on resize
            });

            // characters for the matrix effect i.e numbers and symbols
            const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?`~';
            const fontSize = 15;
            const columns = Math.floor(width / fontSize);

            // this array will store the y-position of each falling character in a column
            const drops = [];
            function initializeMatrixEffect() {
                for (let i = 0; i < columns; i++) {
                    drops[i] = 1; // starting each column at the top
                }
            }

            // initialization  on load
            initializeMatrixEffect();

            // this function will draw the matrix effect
            function drawMatrix() {
                // dimming the old characters slightly to create the trail effect
                ctx.fillStyle = 'rgba(2, 21, 41, 0.05)'; /* this matches body background with transparency */
                ctx.fillRect(0, 0, width, height);

                ctx.fillStyle = '#0F0'; /* green coloring for the numbers */
                ctx.font = `${fontSize}px monospace`; /*this monospace font allows consistent spacing */

                for (let i = 0; i < drops.length; i++) {
                    const text = characters.charAt(Math.floor(Math.random() * characters.length));
                    const x = i * fontSize;
                    const y = drops[i] * fontSize;

                    ctx.fillText(text, x, y);

                    // sending the drop back to the top randomly
                    if (y > height && Math.random() > 0.975) {
                        drops[i] = 0; // resetting to the top
                    }
                    drops[i]++; // moving the character down
                }
            }

            // starting the animation loop
        setInterval(drawMatrix, 33); // this sets about 30 frames per second

// fetching data from the Wikipedia API on DevOps
// setting the global variables to store the full DevOps extract once fetched
let fullExtractsByTopic = {}; // stores already fetched full extracts
let currentTopicIndex = 0;   // keeps track of which topic we're currently on

// list of Wikipedia topics related to DevOps
const TOPICS = [
    "DevOps",
    "Agile software development",
    "Continuous integration",
    "Continuous delivery",
    "Microservices",
    "Cloud computing",
    "Site reliability engineering",
    "Debian",
    "Software",
    "Ubuntu",
    "Malware",
    "Linux",
    "unix",
    "HTTPS",
    "Git",
    "CI/CD",
    "Gradle",
    "SDLC",
    "automation",
    "API",
    "database",
    "file system",
    "Kubernetes",
    "Directory",
    "GNU",
    "build",
    "android",
    "web server",
    "Virtual machine",
    "Kanban"
];

// function to fetch and display data for a specific topic
async function fetchAndDisplayTopic(topic) {
    const factsContainer = document.getElementById('devops-facts-container');
    if (!factsContainer) {
        console.error("DevOps facts container not found in HTML!");
        return;
    }

    // getting extracted info from cache first
    let extract = fullExtractsByTopic[topic];

    if (!extract) { // if not cached, fetch it
        console.log(`Fetching new information for: ${topic}`);
        try {
            const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(topic)}&origin=*`);
            const data = await response.json();

            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];

            if (pageId && pages[pageId] && pages[pageId].extract) {
                extract = pages[pageId].extract;
                fullExtractsByTopic[topic] = extract; // cache the extracted info
            } else {
                extract = ""; // no extract found for this topic
                console.warn(`No extract found for topic: ${topic}`);
            }
        } catch (error) {
            console.error(`Error fetching data for ${topic} from Wikipedia:`, error);
            extract = ""; // set extract to empty on error
        }
    } else {
        console.log(`Using cached information for: ${topic}`);
    }

    //displaying the facts from the fetched or cached info extracted 
    displayTopicFacts(extract, topic);
}

// function to display the extracted facts for the current topic
function displayTopicFacts(text, topicTitle) {
    const factsContainer = document.getElementById('devops-facts-container');
    if (!factsContainer) {
        console.error("DevOps facts container not found in HTML!");
        return;
    }

    // defining keywords relevant to general tech/DevOps concepts, broad enough to apply to various related topics
    
    const relevantKeywords = ["culture", "automation", "lean", "measure", "share", "tools",
                              "collaboration", "integration", "delivery", "cicd", "continuous",
                              "principles", "workflow", "methodology", "practices", "software",
                              "system", "application", "development", "operations", "infrastructure",
                              "cloud", "agile", "testing", "monitoring","container","deployment"];

    // setting the maximum character length for displayed facts
    const MAX_FACT_LENGTH = 180; 
    // storing all sentences that contain keywords
    let allPotentialFacts = []; 
    // splitting the text into individual sentences
    const sentences = text.split(/(?<=[.!?])\s+/);

    // filtering sentences containing any of the keywords
    sentences.forEach(sentence => {
        const containsKeyword = relevantKeywords.some(keyword =>
            sentence.toLowerCase().includes(keyword)
        );
        if (containsKeyword) {
            allPotentialFacts.push(sentence);
        }
    });

    let selectedFacts = [];

    // if we have potential facts, select a subset and process for length
    if (allPotentialFacts.length > 0) {
        // randomly shuffling the facts to ensure variety on each display
        allPotentialFacts.sort(() => Math.random() - 0.5);

        // selecting up to 3 facts, applying truncation
        for (let i = 0; i < allPotentialFacts.length && selectedFacts.length < 3; i++) {
            let currentFact = allPotentialFacts[i];
            let processedFact = currentFact;

            // truncating if too long, adding ellipsis
            if (currentFact.length > MAX_FACT_LENGTH) {
                processedFact = currentFact.substring(0, MAX_FACT_LENGTH).trim();
                if (processedFact.length < currentFact.length) {
                    processedFact += '...';
                }
            }
            selectedFacts.push(processedFact);
        }
    }

    // updating the content of the facts container
    if (selectedFacts.length === 0) {
        // this is a fallback to display a truncated intro ,if no specific facts or too few were found
        let introText = text.substring(0, 350); // getting more of the intro for fallback
        if (introText.length > 0 && introText.length < text.length) {
            introText += '...';
        } else if (introText.length === 0 && text.length === 0) {
            introText = `No detailed information found for "${topicTitle}" from Wikipedia at this time.`;
        }
        factsContainer.innerHTML = `<p>Could not find specific facts for ${topicTitle}, but here's the intro: ${introText}</p>`;
    } else {
        // if facts were found we display them with a heading
        factsContainer.innerHTML = `<h3>Interesting Facts about ${topicTitle}:</h3>`;
        selectedFacts.forEach(fact => {
            factsContainer.innerHTML += `<p>- ${fact}</p>`;
        });
    }

    // making sure the container is visible
    factsContainer.style.opacity = '1';
    factsContainer.style.visibility = 'visible';
}

// function to manage the appearance, disappearance, and refreshing of topics
function cycleTopics() {
    const factsContainer = document.getElementById('devops-facts-container');
    if (!factsContainer) return;

    // step 1: fading out the current facts
    factsContainer.style.opacity = '0';
    factsContainer.style.visibility = 'hidden';

    // Step 2: waiting for fade-out, then updating content and fade in
    setTimeout(() => {
        // moving to the next topic
        currentTopicIndex = (currentTopicIndex + 1) % TOPICS.length;
        const nextTopic = TOPICS[currentTopicIndex];

        // fetch and display the next topic's facts
        fetchAndDisplayTopic(nextTopic);

        // the displayTopicFacts function will set opacity back to 1 and visibility to visible
    }, 1000); // waiting 1 second to match CSS transition for fade-out
}

// initial load: fetching and displaying the first topic
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayTopic(TOPICS[currentTopicIndex]);
});

// setting up the interval to cycle topics every 8 seconds i.e 8000 ms
setInterval(cycleTopics, 8000);        
        };



