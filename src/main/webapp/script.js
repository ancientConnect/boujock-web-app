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
let fullDevOpsExtract = "";

// Function to fetch data from the Wikipedia API for "DevOps"
function fetchDevOpsFacts() {
    fetch('https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=DevOps&origin=*')
        .then(response => response.json())
        .then(data => {
            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];
            const extract = pages[pageId].extract;

            // Store the full extract globally
            fullDevOpsExtract = extract;
            console.log("Full Wikipedia Extract (DevOps):", fullDevOpsExtract); // IMPORTANT: Check this in console!

            // Immediately display the first set of facts
            displayDevOpsFacts(fullDevOpsExtract);
        })
        .catch(error => console.error('Error fetching data from Wikipedia:', error));
}

// Function to display the extracted facts about DevOps
function displayDevOpsFacts(text) {
    const factsContainer = document.getElementById('devops-facts-container');
    if (!factsContainer) {
        console.error("DevOps facts container not found in HTML!");
        return;
    }

    // --- Start of modifications for shorter sentences ---

    // Define keywords relevant to DevOps
    const relevantKeywords = ["culture", "automation", "lean", "measure", "share", "tools", "collaboration", "integration", "delivery", "cicd", "continuous", "principles", "workflow", "methodology"]; // Added 'methodology'

    // New: Define a slightly more generous maximum character length for displayed facts
    const MAX_FACT_LENGTH = 160; // Increased from 120 to 160 characters

    let allPotentialFacts = []; // Store all sentences that contain keywords

    // Split the text into individual sentences
    const sentences = text.split(/(?<=[.!?])\s+/);

    // Log split sentences for debugging
    console.log("All sentences after split:", sentences);

    // Filter sentences that contain any of our keywords
    sentences.forEach(sentence => {
        const containsKeyword = relevantKeywords.some(keyword =>
            sentence.toLowerCase().includes(keyword)
        );
        if (containsKeyword) {
            allPotentialFacts.push(sentence);
        }
    });

    // Log potential facts for debugging
    console.log("Potential facts (with keywords):", allPotentialFacts);

    let selectedFacts = [];

    // If we have potential facts, select a subset and process for length
    if (allPotentialFacts.length > 0) {
        // Step 1: Sort by length in ascending order (shortest first).
        // This prioritizes naturally shorter sentences.
        allPotentialFacts.sort((a, b) => a.length - b.length);

        // Step 2: Iterate through potential facts and select up to 3,
        // applying truncation if necessary.
        for (let i = 0; i < allPotentialFacts.length && selectedFacts.length < 3; i++) {
            let currentFact = allPotentialFacts[i];
            let processedFact = currentFact;

            // Simple truncation: if too long, cut and add ellipsis.
            // This is less aggressive about not cutting words to ensure content is shown.
            if (currentFact.length > MAX_FACT_LENGTH) {
                processedFact = currentFact.substring(0, MAX_FACT_LENGTH).trim();
                // Add ellipsis only if it was actually truncated
                if (processedFact.length < currentFact.length) {
                    processedFact += '...';
                }
            }
            selectedFacts.push(processedFact);
        }
    }

    // Log the final selected facts for debugging
    console.log("Final selected facts:", selectedFacts);

    // --- End of modifications for shorter sentences ---


    // Update the content of the facts container
    if (selectedFacts.length === 0) {
        // Fallback: If no specific facts or too few found, display a truncated intro
        // Ensure there's always *some* text in the fallback
        let introText = text.substring(0, 300); // Get first 300 chars
        if (introText.length > 0 && introText.length < text.length) { // Add ellipsis if original text was longer
            introText += '...';
        } else if (introText.length === 0 && text.length === 0) {
            introText = "No introductory information available from Wikipedia at this time.";
        }
        factsContainer.innerHTML = `<p>Could not find specific facts, but here's the intro about DevOps: ${introText}</p>`;
    } else {
        // If facts were found, display them with a heading
        factsContainer.innerHTML = "<h3>Interesting DevOps Facts:</h3>";
        // Add each selected fact as a paragraph
        selectedFacts.forEach(fact => {
            factsContainer.innerHTML += `<p>- ${fact}</p>`;
        });
    }

    // After updating content, make sure it's visible (if hidden by animation)
    factsContainer.style.opacity = '1';
    factsContainer.style.visibility = 'visible';
}

// Function to manage the appearance, disappearance, and refresh
function cycleDevOpsFacts() {
    const factsContainer = document.getElementById('devops-facts-container');
    if (!factsContainer) return; // Exit if container not found

    // Step 1: Fade out the current facts
    factsContainer.style.opacity = '0';
    factsContainer.style.visibility = 'hidden'; // Hide element after fade

    // Step 2: Wait for fade-out, then update content and fade in
    setTimeout(() => {
        // If the full extract is available, display a new set of random facts
        // Otherwise, re-fetch the extract (e.g., on first load or if empty)
        if (fullDevOpsExtract && fullDevOpsExtract.length > 0) {
            displayDevOpsFacts(fullDevOpsExtract);
        } else {
            fetchDevOpsFacts(); // Re-fetch if extract is empty
        }
        // The displayDevOpsFacts function will set opacity back to 1 and visibility to visible
    }, 1000); // Wait 1 second (should match your CSS transition duration)
}

// Initial fetch of facts when the page loads
document.addEventListener('DOMContentLoaded', fetchDevOpsFacts);

// Set up the interval to cycle facts every 5 seconds (5000 milliseconds)
// The 1-second delay inside setTimeout ensures the fade-out completes before new content appears.
setInterval(cycleDevOpsFacts, 5000);
        
        };




