import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.156.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.156.1/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let particles, positions, colors;
const particleCount = 7000;
const clock = new THREE.Clock();

init();
animate();

function init(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000010);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 120);

    renderer = new THREE.WebGLRenderer({canvas: document.getElementById('dfirCanvas'), antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;

    const geometry = new THREE.BufferGeometry();
    positions = new Float32Array(particleCount * 3);
    colors = new Float32Array(particleCount * 3);

    for(let i=0; i<particleCount; i++){
        let angle = Math.random() * Math.PI * 2;
        let radius = 40 + Math.random()*30;
        let height = (Math.random() - 0.5) * 80;

        positions[i*3] = Math.cos(angle) * radius;
        positions[i*3+1] = height;
        positions[i*3+2] = Math.sin(angle) * radius;

        if(Math.random() < 0.02){
            colors[i*3] = 1.0; colors[i*3+1] = 0.0; colors[i*3+2] = 0.2; // Red Alert
        } else {
            colors[i*3] = 0.0; colors[i*3+1] = 0.7; colors[i*3+2] = 1.0; // Blue Log
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors,3));

    const material = new THREE.PointsMaterial({size:0.6, vertexColors:true});
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    window.addEventListener('resize', onResize);
}

function onResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(){
    requestAnimationFrame(animate);
    let elapsed = clock.getElapsedTime();

    particles.rotation.y += 0.0015; // slow rotation

    // Red Pulse Event
    if(Math.floor(elapsed) % 10 === 0){
        let idx = Math.floor(Math.random() * particleCount);
        colors[idx*3] = 1.0;
        colors[idx*3+1] = 0.0;
        colors[idx*3+2] = 0.0;
        particles.geometry.attributes.color.needsUpdate = true;
    }

    renderer.render(scene, camera);
}

// Keywords Rotation
const keywords = ["CVE", "IOC", "INCIDENT RESPONSE", "MALWARE ANALYSIS", "LOG TIMELINE", "FORENSIC EVIDENCE"];
let index = 0;
setInterval(()=>{
    document.getElementById("dfir-keywords").innerText = keywords[index];
    index = (index+1) % keywords.length;
},3000);
