import * as THREE from 'three';

let scene, camera, renderer, particles, connections;
let mouseX = 0, mouseY = 0;
let scrollY = 0;

const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector('#bg-canvas'),
        antialias: true,
        alpha: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create Particle System (Neural Nodes)
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        
        velocities[i * 3] = (Math.random() - 0.5) * 0.05;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0x000000,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Initial check for connections (we'll do this in animate)
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.05
    });
    connections = new THREE.Group();
    scene.add(connections);

    animate();
};

const animate = () => {
    requestAnimationFrame(animate);

    const positions = particles.geometry.attributes.position.array;
    
    // Update particle positions
    for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3] += (Math.random() - 0.5) * 0.01;
        positions[i * 3 + 1] += (Math.random() - 0.5) * 0.01;
        positions[i * 3 + 2] += (Math.random() - 0.5) * 0.01;

        // Mouse interaction
        const dx = positions[i * 3] - mouseX * 20;
        const dy = positions[i * 3 + 1] - (-mouseY * 20);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 5) {
            positions[i * 3] += dx * 0.01;
            positions[i * 3 + 1] += dy * 0.01;
        }
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Smooth camera scroll
    camera.position.y = -scrollY * 0.05;
    camera.position.x = mouseX * 2;
    camera.lookAt(0, -scrollY * 0.05, 0);

    renderer.render(scene, camera);
};

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('DOMContentLoaded', init);
