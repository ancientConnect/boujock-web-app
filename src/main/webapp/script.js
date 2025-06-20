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
fetch('https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=DevOps&origin=*')
    // Once the response is received, convert it to JSON format
    .then(response => response.json())
    // Process the JSON data
    .then(data => {
        // Access the 'pages' object from the Wikipedia response
        const pages = data.query.pages;
        // Get the ID of the first page returned (which should be DevOps)
        const pageId = Object.keys(pages)[0];
        // Get the introductory text (extract) from that page
        const extract = pages[pageId].extract;

        // Log the full extracted text to the console for debugging
        console.log("Full Wikipedia Extract (DevOps):", extract);

        // Call a function to display the relevant facts on the screen
        displayDevOpsFacts(extract);
    })
    // Catch any errors that occur during the fetch operation
    .catch(error => console.error('Error fetching data from Wikipedia:', error));

// Function to display the extracted facts about DevOps
function displayDevOpsFacts(text) {
    // Get the HTML element where facts will be displayed
    const factsContainer = document.getElementById('devops-facts-container'); // Make sure this div exists in your HTML!

    // If the container element is not found, log an error and stop
    if (!factsContainer) {
        console.error("DevOps facts container not found in HTML!");
        return;
    }

    // Define keywords relevant to DevOps
    const relevantKeywords = ["culture", "automation", "lean", "measure", "share", "tools", "collaboration", "integration", "delivery", "cicd", "continuous"];
    let selectedFacts = []; // Array to store selected sentences

    // Split the text into individual sentences
    const sentences = text.split(/(?<=[.!?])\s+/);

    // Loop through each sentence to find relevant facts
    sentences.forEach(sentence => {
        // Check if the sentence contains any of the defined keywords (case-insensitive)
        const containsKeyword = relevantKeywords.some(keyword =>
            sentence.toLowerCase().includes(keyword)
        );

        // If a keyword is found and we haven't reached our limit, add the sentence to selected facts
        if (containsKeyword && selectedFacts.length < 3) { // Limit to 3 facts for display
            selectedFacts.push(sentence);
        }
    });

    // If no specific facts were found based on keywords
    if (selectedFacts.length === 0) {
        // Display a fallback message with a portion of the introductory text
        factsContainer.innerHTML = `<p>Could not find specific facts, but here's the intro about DevOps: ${text.substring(0, 300)}...</p>`;
    } else {
        // If facts were found, display them with a heading
        factsContainer.innerHTML = "<h3>Interesting DevOps Facts:</h3>";
        // Add each selected fact as a paragraph
        selectedFacts.forEach(fact => {
            factsContainer.innerHTML += `<p>- ${fact}</p>`;
        });
    }
}
        
        
        };




