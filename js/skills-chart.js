document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const chartContainer = document.querySelector('.skill-compass-chart-container'); // Updated selector
    const filtersContainer = document.getElementById('skill-filters');
    const dataUrl = '../skills-data.json';
    const categoriesUrl = '../categories.json';

    // --- Error Handling ---
    if (!chartContainer) {
        console.error('Skill chart container not found!');
        return;
    }
    if (!filtersContainer) {
        console.error('Skill filters container not found!');
        // Don't return, maybe chart can still load without filters
    }

    // --- Skill Icon Mapping --- 
    const skillIconMap = {
        photoshop: 'devicon-photoshop-plain colored',
        illustrator: 'devicon-illustrator-plain colored',
        figma: 'devicon-figma-plain colored',
        python: 'devicon-python-plain colored',
        django: 'devicon-django-plain colored',
        csharp: 'devicon-csharp-plain colored',
        'c#': 'devicon-csharp-plain colored',
        rust: 'devicon-rust-original colored',
        docker: 'devicon-docker-plain colored',
        aws: 'devicon-amazonwebservices-plain-wordmark colored',
        "cloud engineering": 'devicon-amazonwebservices-plain-wordmark colored',
        "ui/ux design": 'devicon-figma-plain colored',
        "devops concepts": 'devicon-devicon-plain colored'
        // Add more mappings here as needed
    };
    const defaultIconClass = 'devicon-devicon-plain colored';
    // -------------------------

    // --- Fetch Categories and Skills Data ---
    Promise.all([
        fetch(categoriesUrl).then(response => {
            if (!response.ok) throw new Error(`HTTP error fetching categories! status: ${response.status}`);
            return response.json();
        }),
        fetch(dataUrl).then(response => {
            if (!response.ok) throw new Error(`HTTP error fetching skills! status: ${response.status}`);
            return response.json();
        })
    ])
    .then(([categories, skillsData]) => {
        // --- Validate Data ---
        if (!Array.isArray(categories)) throw new Error('Categories data is not an array!');
        if (!Array.isArray(skillsData)) throw new Error('Skills data is not an array!');

        // --- Create Filter Buttons ---
        createFilterButtons(categories, filtersContainer);

        // --- Create Skill Points ---
        createSkillPoints(skillsData, chartContainer, skillIconMap, defaultIconClass);

        // --- NO initial filter call - Start with all visible ---
        // filterSkills('All', chartContainer, filtersContainer); // REMOVED

    })
    .catch(error => {
        console.error('Error fetching or processing data:', error);
        if (chartContainer) {
            chartContainer.innerHTML = `<p style="color:red; text-align:center; padding-top: 2rem;">Could not load skills chart data.</p>`;
        }
        if (filtersContainer) {
            filtersContainer.innerHTML = `<p style="color:orange; text-align:center;">Could not load filters.</p>`;
        }
    });

    // --- Function to Create Filter Buttons ---
    function createFilterButtons(categories, container) {
        if (!container) return;
        container.innerHTML = ''; // Clear existing buttons if any
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category;
            button.classList.add('filter-button');
            button.dataset.category = category;

            // --- Modified Event Listener ---
            button.addEventListener('click', () => {
                const currentCategory = button.dataset.category;
                const isActive = button.classList.contains('active');

                if (isActive) {
                    // If already active, deactivate and show all
                    filterSkills(null, chartContainer, container); // Pass null to indicate show all
                } else {
                    // If not active, activate this one and filter
                    filterSkills(currentCategory, chartContainer, container);
                }
            });
            // -------------------------------
            container.appendChild(button);
        });
    }

    // --- Function to Create Skill Points ---
    function createSkillPoints(skills, container, iconMap, defaultIcon) {
        if (!container) return;
        // Clear existing points before adding new ones (optional, good for potential refreshes)
        const existingPoints = container.querySelectorAll('.skill-point');
        existingPoints.forEach(p => p.remove());

        skills.forEach(skill => {
            const skillPoint = document.createElement('div');
            skillPoint.classList.add('skill-point');
            skillPoint.dataset.title = skill.name; // For hover tooltip
            skillPoint.dataset.categories = JSON.stringify(skill.category);

            // Coordinate Conversion
            const masteryNormalized = Math.max(-1, Math.min(1, (skill.mastery || 0) / 10));
            const contextNormalized = Math.max(-1, Math.min(1, (skill.context || 0) / 10));

            skillPoint.style.setProperty('--mastery', masteryNormalized);
            skillPoint.style.setProperty('--context', contextNormalized);

            // Determine Icon Class
            const skillNameLower = skill.name.toLowerCase();
            const iconClass = iconMap[skillNameLower] || defaultIcon;

            // Create and add icon
            const icon = document.createElement('i');
            icon.className = iconClass;
            skillPoint.appendChild(icon);

            container.appendChild(skillPoint);
        });
    }

    // --- Function to Filter Skills ---
    function filterSkills(selectedCategory, skillsContainer, buttonsContainer) {
        // selectedCategory can now be null (meaning show all)
        if (!skillsContainer || !buttonsContainer) return;

        const skillPoints = skillsContainer.querySelectorAll('.skill-point');
        const filterButtons = buttonsContainer.querySelectorAll('.filter-button');

        // Update button active state
        filterButtons.forEach(button => {
            // Activate if its category matches selectedCategory, deactivate otherwise (or if selectedCategory is null)
            if (selectedCategory && button.dataset.category === selectedCategory) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Show/hide skill points - Modified Logic using class toggle
        skillPoints.forEach(point => {
            let categories;
            try {
                categories = JSON.parse(point.dataset.categories);
            } catch (e) {
                console.error('Error parsing categories for skill:', point.dataset.title, e);
                categories = [];
            }
            const skillCategories = Array.isArray(categories) ? categories : [categories];

            // Determine if the point should be visible
            const isVisible = selectedCategory === null || skillCategories.includes(selectedCategory);

            // Toggle the hidden class based on visibility
            if (isVisible) {
                point.classList.remove('skill-point-hidden');
            } else {
                point.classList.add('skill-point-hidden');
            }
        });
    }
}); 