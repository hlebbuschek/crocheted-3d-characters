import * as THREE from 'three';
import {OrbitControls} from "jsm/controls/OrbitControls.js" 
import { modells } from './objects.js';
const w = window.innerWidth;
const h = window.innerHeight;
// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);
const gridHelper = new THREE.GridHelper(50,50, 0x0f0f0f);
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(25);
scene.add(axesHelper);
// Kamera 
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 15;
camera.position.y = 10;
camera.position.x = -2;

// Renderer 
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

//Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Geometrie
export function createModells(){
  modells.forEach((obj) => {
    // console.log(obj);
    let currentPos = 0; 
    obj.rows.forEach((row, index) => {
      let points = [];
      const len = row.count;
      const radius = len / (2 * Math.PI);

      for (let i = 0; i < len; i++) {
        const angle = (i / len) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ));
      }
      points.push(points[0]); 

      const curve = new THREE.CatmullRomCurve3(points, true);
      const geometry = new THREE.TubeGeometry(curve, 20, 0.6, 4, true);
      const material = new THREE.MeshBasicMaterial({color: obj.color});
      const mesh = new THREE.Mesh(geometry, material);

      // Lichtquellen
      // const ambientLight = new THREE.AmbientLight(0xafafaf, 0.1);
      // scene.add(ambientLight);
      // const directionalLight = new THREE.DirectionalLight(0xf0f0f0, 0.1);
      // directionalLight.position.set(10, 60, 10);
      // scene.add(directionalLight);
      renderer.shadowMap.enabled = false;

      scene.add(mesh);

      if (row.desc === 'zunahme' || index === 0) {
        mesh.position.y -= obj.position.y - index / 3;
        currentPos = mesh.position.y;
      } else if (row.desc === 'km') {
        mesh.position.y = currentPos + 0.5; 
        currentPos = mesh.position.y;
      } else if (row.desc === 'abnahme') {
        mesh.position.y = currentPos + 1 / 3;
        currentPos = mesh.position.y;
      }
      mesh.position.x = obj.position.x;
      mesh.position.z = obj.position.z;
    });
  });
}

// Animationsloop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}
createModells();
animate();