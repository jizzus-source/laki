import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";
import { Vector3 } from "./vector3.js";

const { GodRaysEffect, RenderPass, EffectPass, EffectComposer } = POSTPROCESSING;

export class Scene {

    constructor (animation) {
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        this.camera.position.z = 1;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(time => {
            this.time = time;
            this.composer.render(.1);
            animation(this);
            this.renderer.render(this.scene, this.camera)
        });
        this.composer = new EffectComposer(this.renderer);
    }

    append () {
        document.body.appendChild(this.renderer.domElement);
    }

    box (center, size) {
        size = normalize(size);
        let geometry = new THREE.BoxGeometry(size.x, size.y, size.z)
        let material = new THREE.MeshPhongMaterial();
        let mesh = new THREE.Mesh(geometry, material);

        setPosition(mesh, center);

        this.scene.add(mesh);
        return mesh;
    }

    pointLight ({ center, color, map, radius, edges, godraysResolution, godraysDensity, godraysDecay, godraysWeight, godraysSample, lightStrength }) {
        radius = radius || 0.05;
        color = color || 0xffffff;
        edges = edges || 32;
        godraysResolution = godraysResolution || .1;
        godraysDensity = godraysDensity || .9;
        godraysDecay = godraysDecay || .9;
        godraysWeight = godraysWeight || .9;
        godraysSample = godraysSample || 100;
        lightStrength = lightStrength || 1;
        

        let light = new THREE.PointLight(color, lightStrength)
        let geometry = new THREE.SphereBufferGeometry(radius, 32, 32);
        let material = new THREE.MeshBasicMaterial(map? { map } : { color });
        let lightSphere = new THREE.Mesh( geometry, material );

        let godraysEffect = new GodRaysEffect(this.camera, lightSphere, {
            resolutionScale: godraysResolution,
            density: godraysDensity,
            decay: godraysDecay,
            weight: godraysWeight,
            sample: godraysSample
        });

        let renderPass = new RenderPass(this.scene, this.camera);
        let effectPass = new EffectPass(this.camera, godraysEffect);

        this.composer.addPass(renderPass);
        this.composer.addPass(effectPass);

        effectPass.renderToScreen = true;

        setPosition(light, center);
        setPosition(lightSphere, center);

        // lightSphere.layers.set(1)

        this.scene.add(lightSphere);
        this.scene.add(light);

        return light;
    }

    sphere ({ center, radius, color }) {
        let geometry = new THREE.SphereBufferGeometry(radius, 32, 32);
        let material = new THREE.MeshBasicMaterial({ color });
        let sphere = new THREE.Mesh( geometry, material );
        this.scene.add(sphere);
        
        setPosition(sphere, center);

        sphere.__props__ = { radius, center, color };
        return sphere;
    }

}

function setPosition (obj, center) {
    obj.position.set(center.x, center.y, center.z);
}

function normalize (vec) {
    if (typeof vec === "number") vec = Vector3.VECTOR_ONE.times(vec);

    return vec;
}