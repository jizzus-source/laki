import { Scene } from "./scene.js";
import { Vector3 } from "./vector3.js";

let RADIUS = 0.2;
const NUMBER_OF_STARS = 0;
const NUMBER_OF_BOXES = 30;
const STAR_SIZE = .0025;
const MAX_SPEED = 1;
let scene;
let stars = [];
let selectedStar;
let light;

window.addEventListener("load", function () {
    scene = new Scene(scene => {
        const time = scene.time;
        
        for (const box of boxes) {
            // box.rotation.x += (Math.random() - 0.5) / 10;
            // box.rotation.y += (Math.random() - 0.5) / 10;
            // box.rotation.z += (Math.random() - 0.5) / 10;

            box.rotation.x = box.initialSpeed * (box.direction) * time / 500;
            box.rotation.y = box.initialSpeed * (box.direction) * time / 1000;
            box.rotation.z = box.initialSpeed * (box.direction) * time / 2000;

            box.position.x = (Math.cos(box.initialAngle) + Math.cos(time / 1000 * box.initialSpeed)) * RADIUS * box.direction;
            box.position.z = (Math.sin(time / 1000 * box.initialSpeed)) * RADIUS * box.direction;
            //box.position.y = (Math.sin(box.initialAngle) + Math.sin(time / 1000 * box.initialSpeed)) * RADIUS * box.direction;
        }

        // scene.camera.lookAt(light.position);
        // scene.camera.position.x = (Math.cos(time / 10000)) * .5;
        // scene.camera.position.z = (Math.cos(time / 10000)) * .5;
        //scene.camera.position.y = (Math.cos(time / 30000)) * 3;
        // scene.camera.position.y = (Math.cos(time / 10000));
        //scene.camera.position.z = (Math.sin(time / 1000 * box.initialSpeed)) * RADIUS * box.direction;

        if (RADIUS < 2) RADIUS += Math.sin(time / 100000) * 0.1;
    });

    let boxes = [];
    let numberOfBoxes = NUMBER_OF_BOXES;
    let angle = 0;
    let angleStep = 2 * Math.PI / numberOfBoxes;
    let distance = .25;

    for (let i=0;i<numberOfBoxes;i++) {
        let x = distance * Math.cos(angle);
        let y = distance * Math.sin(angle);
        let box = scene.box(new Vector3(x, y, 0), .025);
        box.initialAngle = angle;
        box.initialSpeed = Math.random() * MAX_SPEED;
        box.direction = Math.random() > 0.5? 1 : -1;
        boxes.push(box);

        angle += angleStep;
    }

    angle = 0;
    angleStep = 2 * Math.PI / (numberOfBoxes * 10);
    for (let i=0;i<numberOfBoxes * 10;i++) {
        let x = distance * 1.5 * Math.cos(angle);
        let y = distance * 1.5 * Math.sin(angle);
        let box = scene.box(new Vector3(x, y, 0), .0125);
        box.direction = Math.random() > 0.5? 1 : -1;
        box.initialSpeed = Math.random() * MAX_SPEED;
        box.initialAngle = angle;
        boxes.push(box);

        angle += angleStep;
    }

    angle = 0;
    angleStep = 2 * Math.PI / (numberOfBoxes * 20);
    for (let i=0;i<numberOfBoxes * 20;i++) {
        let x = distance * 2 * Math.cos(angle);
        let y = distance * 2 * Math.sin(angle);
        let box = scene.box(new Vector3(x, y, 0), .00625);
        box.initialSpeed = Math.random() * MAX_SPEED;
        box.direction = Math.random() > 0.5? 1 : -1;
        box.initialAngle = angle;
        boxes.push(box);

        angle += angleStep;
    }

    light = scene.pointLight({
        center: Vector3.VECTOR_ZERO,
        color: 0xfffffff
    });

    let distanceVector = new Vector3(.25, .25, .25);

    for (let i=0;i<NUMBER_OF_STARS;i++) {
        const sphere = scene.sphere({
            center: new Vector3(
                Math.random() * distanceVector.x * 2 - distanceVector.x,
                Math.random() * distanceVector.y * 2 - distanceVector.y,
                Math.random() * distanceVector.z * 2 - distanceVector.z,
            ), 
            color: Math.floor(Math.random() * (0xffffff/2) + (0xffffff/2)),
            radius: STAR_SIZE
        });
        
        stars.push(sphere);
    }
    
    selectStar();

    scene.append();
});

// let movementVector = new Vector3(1, 1, 1);
let alreadyCreated = false;
let currentPointLight;
window.addEventListener("wheel", (evt) => {
    const diff = evt.deltaY;

    moveForward(diff)
})

let lastX = 0;
let lastY = 0;
window.addEventListener("mousemove", (evt) => {
    if (!lastX) return lastX = evt.clientX;
    if (!lastY) return lastY = evt.clientY;
    const x = evt.clientX - lastX;
    const y = evt.clientY - lastY;
    const sensitivity = 0.001;

    /*if (x > 0) scene.camera.rotation.y -= x * sensitivity;
    if (x < 0) scene.camera.rotation.y -= x * sensitivity;
    if (y < 0) scene.camera.rotation.x -= y * sensitivity;
    if (y > 0) scene.camera.rotation.x -= y * sensitivity;*/

    lastX = evt.clientX;
    lastY = evt.clientY;
})

function selectStar () {
    if (currentPointLight) scene.scene.remove(currentPointLight);

    selectedStar = stars[Math.floor(Math.random() * stars.length)];
    
}

function moveForward (diff) {
    scene.camera.position.y = Math.sin(scene.camera.position.y + diff/4000);

    scene.camera.lookAt(light.position);
}

// setInterval(() => moveForward(-16), 15)