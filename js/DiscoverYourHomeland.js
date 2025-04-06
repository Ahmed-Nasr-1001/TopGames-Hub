document.getElementById('arab-world-map').addEventListener('click', (event) => {
    if (event.target.classList.contains('Country')) {
        const name = event.target.dataset.name;
        const capital = event.target.dataset.currentcapital;
        const ancientCapital = event.target.dataset.ancientcapital;
        const img = event.target.dataset.img;

        // Get the tooltip element
        const tooltip = document.getElementById('tooltip');
        if (!tooltip) return;

        // Update the tooltip content
        tooltip.innerHTML = `
    <strong>${name}</strong><br>
    Current Capital: ${capital}<br>
    Ancient Capital: ${ancientCapital}<br>
    <img src="${img}" alt="${name} image" width="150">
`;

        // Show the tooltip
        tooltip.style.display = 'block';

        // Position tooltip at the center of the screen
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;

        tooltip.style.left = `${(screenWidth - tooltipWidth) / 2}px`;
        tooltip.style.top = `${(screenHeight - tooltipHeight) / 2}px`;
    } else {
        // Hide tooltip when clicking outside
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const svg = document.getElementById("arab-world-map"); // Select the SVG element
    const animatedImage = document.getElementById("animatedImage");

    svg.addEventListener("click", function (event) {
        // Get the click position relative to the viewport
        const clickX = event.clientX;
        const clickY = event.clientY;

        // Position the image at the click location
        animatedImage.style.left = `${clickX}px`;
        animatedImage.style.top = `${clickY}px`;
        animatedImage.style.display = "block";

        // Apply the animation
        animatedImage.style.animation = "moveAndFade 2s forwards";

        // Hide the image after the animation ends
        animatedImage.addEventListener("animationend", () => {
            animatedImage.style.display = "none";
        });
    });
});