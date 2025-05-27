// 1. Create the scene (this is the empty 3D space)
const scene = new THREE.Scene();

// 2. Create a camera (it's like the eye that looks at the scene)
const camera = new THREE.PerspectiveCamera(
  75,                                   // field of view angle
  window.innerWidth / window.innerHeight, // screen width/height ratio
  0.1,                                  // near clipping distance
  1000                                  // far clipping distance
);
camera.position.z = 5;  // Move the camera back to see the object

// 3. Create the renderer and add it to the web page
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // screen size
document.body.appendChild(renderer.domElement); // add the renderer to the HTML

// 4. Load the logo image
const textureLoader = new THREE.TextureLoader(); // tool to load an image
const texture = textureLoader.load('logo.png'); // load the file logo.png

// 5. Create a plane (rectangle) and apply the image on it
const geometry = new THREE.PlaneGeometry(4, 4); // size of the plane (rectangle)
const material = new THREE.MeshBasicMaterial({
  map: texture,         // image to display
  side: THREE.DoubleSide, // visible from both sides
  transparent: true       // allow transparency if the image has it
});
const logo = new THREE.Mesh(geometry, material); // create the 3D object with the image
scene.add(logo); // add the object to the scene

// 6. Function to display the scene (called once here because no animation needed)
renderer.render(scene, camera); // render the scene with the camera
