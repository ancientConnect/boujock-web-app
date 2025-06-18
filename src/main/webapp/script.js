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
        };