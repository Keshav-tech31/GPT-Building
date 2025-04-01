// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cursor follower
    initCursorFollower();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize header scroll effect
    initHeaderScroll();
    
    // Initialize 3D models
    init3DModels();
    
    // Initialize form validation
    initFormValidation();
});

// Cursor follower effect
function initCursorFollower() {
    const cursor = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursor.style.backgroundColor = 'rgba(0, 168, 255, 0.4)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.backgroundColor = 'rgba(0, 168, 255, 0.2)';
    });
    
    // Hover effect on links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .content-item');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.backgroundColor = 'rgba(0, 168, 255, 0.1)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'rgba(0, 168, 255, 0.2)';
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    // Reveal images on scroll
    const revealImages = document.querySelectorAll('.reveal-image');
    
    function checkScroll() {
        revealImages.forEach(image => {
            const imageTop = image.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (imageTop < windowHeight - 100) {
                image.classList.add('active');
            }
        });
    }
    
    // Initial check
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    
    // Add animation delay to content items
    const contentItems = document.querySelectorAll('.content-item');
    contentItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// 3D Models with Three.js
function init3DModels() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded');
        return;
    }
    
    // Hero 3D model
    const heroContainer = document.getElementById('hero-3d-container');
    const modelContainer = document.getElementById('3d-container');
    
    if (!heroContainer || !modelContainer) return;
    
    // Set up hero scene
    const heroScene = new THREE.Scene();
    const heroCamera = new THREE.PerspectiveCamera(75, heroContainer.clientWidth / heroContainer.clientHeight, 0.1, 1000);
    const heroRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    heroRenderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
    heroContainer.appendChild(heroRenderer.domElement);
    
    // Create column and beam structure for hero
    const columnMaterial = new THREE.MeshPhongMaterial({ color: 0x00a8ff });
    const beamMaterial = new THREE.MeshPhongMaterial({ color: 0x192a56 });
    const concreteMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    
    // Create foundation
    const foundation = new THREE.BoxGeometry(10, 0.5, 10);
    const foundationMesh = new THREE.Mesh(foundation, concreteMaterial);
    foundationMesh.position.y = -3;
    heroScene.add(foundationMesh);
    
    // Create columns
    function createColumn(x, z) {
        const column = new THREE.BoxGeometry(0.8, 6, 0.8);
        const columnMesh = new THREE.Mesh(column, columnMaterial);
        columnMesh.position.set(x, 0, z);
        heroScene.add(columnMesh);
        return columnMesh;
    }
    
    const columns = [
        createColumn(-4, -4),
        createColumn(4, -4),
        createColumn(-4, 4),
        createColumn(4, 4)
    ];
    
    // Create beams
    function createBeam(x1, z1, x2, z2) {
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
        const beam = new THREE.BoxGeometry(length, 0.6, 0.6);
        const beamMesh = new THREE.Mesh(beam, beamMaterial);
        
        // Position at midpoint
        beamMesh.position.set((x1 + x2) / 2, 3, (z1 + z2) / 2);
        
        // Rotate to connect points
        const angle = Math.atan2(z2 - z1, x2 - x1);
        beamMesh.rotation.y = angle;
        
        heroScene.add(beamMesh);
        return beamMesh;
    }
    
    createBeam(-4, -4, 4, -4);
    createBeam(4, -4, 4, 4);
    createBeam(4, 4, -4, 4);
    createBeam(-4, 4, -4, -4);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    heroScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    heroScene.add(directionalLight);
    
    // Position camera
    heroCamera.position.set(8, 5, 12);
    heroCamera.lookAt(0, 0, 0);
    
    // Main 3D model container
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    renderer.setClearColor(0xf0f2f5);
    modelContainer.appendChild(renderer.domElement);
    
    // Create models
    let currentModel = 'column';
    let modelGroup = new THREE.Group();
    scene.add(modelGroup);
    
    function createColumnModel() {
        clearModelGroup();
        
        // Create column
        const columnGeometry = new THREE.CylinderGeometry(0.8, 0.8, 6, 32);
        const columnMesh = new THREE.Mesh(columnGeometry, columnMaterial);
        
        // Create reinforcement
        const reinforcementGeometry = new THREE.TorusGeometry(0.9, 0.05, 16, 32);
        
        for (let i = 0; i < 10; i++) {
            const reinforcement = new THREE.Mesh(reinforcementGeometry, new THREE.MeshPhongMaterial({ color: 0x7f8fa6 }));
            reinforcement.rotation.x = Math.PI / 2;
            reinforcement.position.y = -2.5 + i * 0.5;
            modelGroup.add(reinforcement);
        }
        
        // Create vertical bars
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const barGeometry = new THREE.CylinderGeometry(0.05, 0.05, 6.5, 8);
            const bar = new THREE.Mesh(barGeometry, new THREE.MeshPhongMaterial({ color: 0x7f8fa6 }));
            bar.position.x = Math.cos(angle) * 0.7;
            bar.position.z = Math.sin(angle) * 0.7;
            modelGroup.add(bar);
        }
        
        // Create base
        const baseGeometry = new THREE.BoxGeometry(3, 0.5, 3);
        const baseMesh = new THREE.Mesh(baseGeometry, concreteMaterial);
        baseMesh.position.y = -3.25;
        modelGroup.add(baseMesh);
        
        modelGroup.add(columnMesh);
    }
    
    function createBeamModel() {
        clearModelGroup();
        
        // Create beam
        const beamGeometry = new THREE.BoxGeometry(8, 0.8, 0.8);
        const beamMesh = new THREE.Mesh(beamGeometry, beamMaterial);
        modelGroup.add(beamMesh);
        
        // Create supports
        const supportGeometry = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
        const supportMaterial = new THREE.MeshPhongMaterial({ color: 0x00a8ff });
        
        const leftSupport = new THREE.Mesh(supportGeometry, supportMaterial);
        leftSupport.position.set(-3.5, -1.9, 0);
        modelGroup.add(leftSupport);
        
        const rightSupport = new THREE.Mesh(supportGeometry, supportMaterial);
        rightSupport.position.set(3.5, -1.9, 0);
        modelGroup.add(rightSupport);
        
        // Create reinforcement
        const rebarGeometry = new THREE.CylinderGeometry(0.05, 0.05, 8.5, 8);
        const rebarMaterial = new THREE.MeshPhongMaterial({ color: 0x7f8fa6 });
        
        // Bottom reinforcement
        for (let i = 0; i < 3; i++) {
            const bottomRebar = new THREE.Mesh(rebarGeometry, rebarMaterial);
            bottomRebar.rotation.z = Math.PI / 2;
            bottomRebar.position.y = -0.3;
            bottomRebar.position.z = -0.3 + i * 0.3;
            modelGroup.add(bottomRebar);
        }
        
        // Top reinforcement
        for (let i = 0; i < 2; i++) {
            const topRebar = new THREE.Mesh(rebarGeometry, rebarMaterial);
            topRebar.rotation.z = Math.PI / 2;
            topRebar.position.y = 0.3;
            topRebar.position.z = -0.15 + i * 0.3;
            modelGroup.add(topRebar);
        }
        
        // Stirrups
        const stirrupGeometry = new THREE.TorusGeometry(0.4, 0.05, 16, 4);
        stirrupGeometry.rotateX(Math.PI / 2);
        
        for (let i = 0; i < 17; i++) {
            const stirrup = new THREE.Mesh(stirrupGeometry, rebarMaterial);
            stirrup.position.x = -4 + i * 0.5;
            modelGroup.add(stirrup);
        }
    }
    
    function createStructureModel() {
        clearModelGroup();
        
        // Create foundation
        const foundationGeometry = new THREE.BoxGeometry(10, 0.5, 10);
        const foundationMesh = new THREE.Mesh(foundationGeometry, concreteMaterial);
        foundationMesh.position.y = -3;
        modelGroup.add(foundationMesh);
        
        // Create columns
        const columnGeometry = new THREE.BoxGeometry(0.8, 6, 0.8);
        
        const positions = [
            [-4, -4], [0, -4], [4, -4],
            [-4, 0], [4, 0],
            [-4, 4], [0, 4], [4, 4]
        ];
        
        positions.forEach(pos => {
            const column = new THREE.Mesh(columnGeometry, columnMaterial);
            column.position.set(pos[0], 0, pos[1]);
            modelGroup.add(column);
        });
        
        // Create beams - first floor
        const beamGeometry = new THREE.BoxGeometry(1, 0.6, 1);
        const beamMaterial = new THREE.MeshPhongMaterial({ color: 0x192a56 });
        
        // Horizontal beams (X direction)
        for (let z = -4; z <= 4; z += 4) {
            for (let x = -4; x < 4; x += 4) {
                const length = 4;
                const beam = new THREE.BoxGeometry(length, 0.6, 0.6);
                const beamMesh = new THREE.Mesh(beam, beamMaterial);
                beamMesh.position.set(x + length/2, 3, z);
                modelGroup.add(beamMesh);
            }
        }
        
        // Vertical beams (Z direction)
        for (let x = -4; x <= 4; x += 4) {
            for (let z = -4; z < 4; z += 4) {
                const length = 4;
                const beam = new THREE.BoxGeometry(0.6, 0.6, length);
                const beamMesh = new THREE.Mesh(beam, beamMaterial);
                beamMesh.position.set(x, 3, z + length/2);
                modelGroup.add(beamMesh);
            }
        }
        
        // Create slab
        const slabGeometry = new THREE.BoxGeometry(9, 0.3, 9);
        const slabMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc, transparent: true, opacity: 0.8 });
        const slabMesh = new THREE.Mesh(slabGeometry, slabMaterial);
        slabMesh.position.y = 3.45;
        modelGroup.add(slabMesh);
    }
    
    function clearModelGroup() {
        while(modelGroup.children.length > 0) {
            const object = modelGroup.children[0];
            modelGroup.remove(object);
        }
    }
    
    // Initialize with column model
    createColumnModel();
    
    // Add lights to main scene
    const sceneAmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(sceneAmbientLight);
    
    const sceneDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sceneDirectionalLight.position.set(5, 10, 7);
    scene.add(sceneDirectionalLight);
    
    // Position camera
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    
    // Model controls
    const columnBtn = document.getElementById('column-model');
    const beamBtn = document.getElementById('beam-model');
    const structureBtn = document.getElementById('structure-model');
    
    columnBtn.addEventListener('click', () => {
        currentModel = 'column';
        createColumnModel();
        updateActiveButton();
    });
    
    beamBtn.addEventListener('click', () => {
        currentModel = 'beam';
        createBeamModel();
        updateActiveButton();
    });
    
    structureBtn.addEventListener('click', () => {
        currentModel = 'structure';
        createStructureModel();
        updateActiveButton();
    });
    
    function updateActiveButton() {
        columnBtn.classList.remove('active');
        beamBtn.classList.remove('active');
        structureBtn.classList.remove('active');
        
        if (currentModel === 'column') columnBtn.classList.add('active');
        if (currentModel === 'beam') beamBtn.classList.add('active');
        if (currentModel === 'structure') structureBtn.classList.add('active');
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Update hero renderer
        heroCamera.aspect = heroContainer.clientWidth / heroContainer.clientHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
        
        // Update main renderer
        camera.aspect = modelContainer.clientWidth / modelContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate hero model
        foundationMesh.rotation.y += 0.005;
        columns.forEach(column => {
            column.rotation.y = foundationMesh.rotation.y;
        });
        
        // Rotate main model
        modelGroup.rotation.y += 0.005;
        
        // Render scenes
        heroRenderer.render(heroScene, heroCamera);
        renderer.render(scene, camera);
    }
    
    animate();
}

