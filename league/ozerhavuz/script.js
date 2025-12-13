// Used shared data from champions.js (assumed loaded)
const champions = CHAMPION_POOLS.ozer;

let cars = [];
let trackLength = 0;

// Setup
const trackPath = document.getElementById('circuit-path');
trackLength = trackPath.getTotalLength();
const carsContainer = document.getElementById('cars-container');
const standingsList = document.getElementById('standings-list');

function init() {
    createCars();
    animate();
}

function createCars() {
    carsContainer.innerHTML = '';
    cars = champions.map((champ, index) => {
        const carEl = document.createElement('div');
        carEl.classList.add('car');

        const carBody = document.createElement('div');
        carBody.classList.add('car-body');
        carBody.style.backgroundColor = champ.color;

        const label = document.createElement('div');
        label.classList.add('car-label');
        label.textContent = champ.name;

        carEl.appendChild(carBody);
        carEl.appendChild(label);
        carsContainer.appendChild(carEl);

        return {
            element: carEl,
            name: champ.name,
            // Start at random positions along the track so they aren't all bunched up
            distance: Math.random() * trackLength,
            speed: Math.random() * 2 + 1,
            lapsCompleted: 0
        };
    });

    // Initial Position Placement
    cars.forEach(car => updateCarPosition(car));
    updateLeaderboard();
}

function updateCarPosition(car) {
    // REVERSE DIRECTION LOGIC:
    // Instead of distance going 0 -> Length, we treat increasing distance effectively as moving backwards?
    // User wants "reverse direction". The path is drawn CCW or CW.
    // To reverse, we can just sample the point at (TotalLength - (distance % TotalLength)).

    const distOnLap = car.distance % trackLength;
    const reverseDist = trackLength - distOnLap; // This makes it go backwards along the defined path

    const point = trackPath.getPointAtLength(reverseDist);

    // Calculate rotation
    // To look correct in reverse, we look at a point slightly "behind" in the generic path (which is ahead in reverse)
    // Or we look generic ahead, and flip 180.
    // Let's look slightly "ahead" in our reverse logic (which means slightly smaller path index)

    let headingDist = reverseDist - 1;
    if (headingDist < 0) headingDist = trackLength - 1;

    const pointAhead = trackPath.getPointAtLength(headingDist);
    const angle = Math.atan2(pointAhead.y - point.y, pointAhead.x - point.x) * 180 / Math.PI;

    // Map to percentage
    const xPct = (point.x / 450) * 100;
    const yPct = (point.y / 300) * 100;

    car.element.style.left = `${xPct}%`;
    car.element.style.top = `${yPct}%`;
    car.element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
}

function animate() {
    cars.forEach(car => {
        // Speed Logic: Random variation
        const change = (Math.random() - 0.5) * 0.2;
        car.speed += change;

        // Limits
        if (car.speed < 1.5) car.speed = 1.5; // Ensure they keep moving reasonable fast
        if (car.speed > 6) car.speed = 6;

        car.distance += car.speed;

        // Update lap count for display (just for fun stats)
        car.lapsCompleted = Math.floor(car.distance / trackLength);

        updateCarPosition(car);
    });

    updateLeaderboard();
    requestAnimationFrame(animate);
}

function updateLeaderboard() {
    // Sort by who has traveled the farthest (most laps + current progress)
    const sortedCars = [...cars].sort((a, b) => b.distance - a.distance);

    standingsList.innerHTML = '';
    sortedCars.forEach((car, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="rank">${index + 1}</span>
            <span class="name" style="color:${car.element.querySelector('.car-body').style.backgroundColor}">${car.name}</span>
            <span class="laps">Lap ${car.lapsCompleted + 1} (${Math.round(car.speed * 10)} km/h)</span>
        `;
        standingsList.appendChild(li);
    });
}

// Start immediately
init();
