// Import Three.js
import * as THREE from 'three';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add ambient light and a point light
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);
const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(0, 50, 50);
scene.add(light);

// Create a charge (positive) in the center
const chargeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const charge = new THREE.Mesh(new THREE.SphereGeometry(1), chargeMaterial);
scene.add(charge);

// Create electric field lines (emanating radially)
const electricFieldLines = [];
for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5;
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * 10, Math.sin(angle) * 10, 0)
    ]);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    electricFieldLines.push(line);
    scene.add(line);
}

// Create a circular loop to represent a magnetic field (current loop)
const loopRadius = 5;
const loopGeometry = new THREE.CircleGeometry(loopRadius, 50);
const loopMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
const loop = new THREE.Line(loopGeometry, loopMaterial);
loop.rotation.x = Math.PI / 2; // Align it horizontally
scene.add(loop);

// Electromagnetic wave (sine wave for electric and magnetic fields)
const electromagneticWaveMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
let waveGeometry = new THREE.BufferGeometry();
let wavePoints = [];
for (let i = -10; i < 10; i += 0.2) {
    wavePoints.push(new THREE.Vector3(i, Math.sin(i), 0)); // Electric field (sine wave)
    wavePoints.push(new THREE.Vector3(i, 0, Math.cos(i))); // Magnetic field (cosine wave)
}
waveGeometry.setFromPoints(wavePoints);
const wave = new THREE.Line(waveGeometry, electromagneticWaveMaterial);
scene.add(wave);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate electric field lines slightly for visualization
    electricFieldLines.forEach(line => {
        let positions = line.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            let x = positions[i];
            let y = positions[i + 1];
            let newX = x * Math.cos(0.01) - y * Math.sin(0.01);
            let newY = x * Math.sin(0.01) + y * Math.cos(0.01);
            positions[i] = newX;
            positions[i + 1] = newY;
        }
        line.geometry.attributes.position.needsUpdate = true;
    });

    // Move the electromagnetic wave in space
    wave.position.x -= 0.05;
    if (wave.position.x < -10) wave.position.x = 10;

    // Render the scene
    renderer.render(scene, camera);
}

// Set camera position and start animation
camera.position.z = 20;
animate();
