"use client";

import { Mail, MapPin, Minus, Phone, Plus, RotateCcw } from "lucide-react";
import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import chinaGeoJson from "china-geojson/src/geojson/china.json";
import styles from "./partner-network-map.module.css";

type ContactLocation = {
  city: string;
  englishLabel: string;
  address: string;
  phone: string;
  email?: string;
};

type PartnerNetworkMapProps = {
  locations: ContactLocation[];
};

type Coordinate = [number, number];
type PolygonCoordinates = Coordinate[][];
type MapGeometry =
  | { type: "Polygon"; coordinates: PolygonCoordinates }
  | { type: "MultiPolygon"; coordinates: PolygonCoordinates[] };

type MapFeature = {
  type: "Feature";
  properties: { name?: string };
  geometry: MapGeometry;
};

type MapFeatureCollection = {
  type: "FeatureCollection";
  features: MapFeature[];
};

type CityNode = {
  id: string;
  name: string;
  englishName: string;
  longitude: number;
  latitude: number;
  labelOffsetX: number;
  labelOffsetY: number;
  locations: ContactLocation[];
};

const MAP_CENTER = { longitude: 104.4, latitude: 35.4 };
const MAP_SCALE = 0.72;
const CAMERA_HOME = new THREE.Vector3(0, -31, 48);
const CAMERA_TARGET = new THREE.Vector3(0, 0, 0);

const MAP_COLORS = {
  fog: 0x06121f,
  province: [0x185a99, 0x226eb1, 0x2e81c5],
  edge: 0x9ed4ff,
  marker: 0x55b6ff,
  markerEmissive: 0x123a70,
  node: 0x9edbff,
  nodeEmissive: 0x245d94,
  rim: 0x3385d8,
  underlay: 0x071625,
} as const;

const CITY_BLUEPRINTS = [
  { id: "wuhan", name: "武汉", englishName: "WUHAN", match: "武汉", longitude: 114.3055, latitude: 30.5928, labelOffsetX: -18, labelOffsetY: -8 },
  { id: "shenzhen", name: "深圳", englishName: "SHENZHEN", match: "深圳", longitude: 114.0579, latitude: 22.5431, labelOffsetX: 44, labelOffsetY: 18 },
  { id: "shanghai", name: "上海", englishName: "SHANGHAI", match: "上海", longitude: 121.4737, latitude: 31.2304, labelOffsetX: 22, labelOffsetY: -8 },
  { id: "guangzhou", name: "广州", englishName: "GUANGZHOU", match: "广州", longitude: 113.2644, latitude: 23.1291, labelOffsetX: -42, labelOffsetY: -15 },
  { id: "kunming", name: "昆明", englishName: "KUNMING", match: "昆明", longitude: 102.8329, latitude: 24.8801, labelOffsetX: -20, labelOffsetY: 8 },
] as const;

function projectCoordinate(longitude: number, latitude: number) {
  return new THREE.Vector3(
    (longitude - MAP_CENTER.longitude) * MAP_SCALE,
    (latitude - MAP_CENTER.latitude) * MAP_SCALE,
    .66,
  );
}

function polygonArea(ring: Coordinate[]) {
  let area = 0;
  for (let index = 0; index < ring.length; index += 1) {
    const current = ring[index];
    const next = ring[(index + 1) % ring.length];
    area += current[0] * next[1] - next[0] * current[1];
  }
  return Math.abs(area / 2);
}

function createProvinceMeshes(feature: MapFeature, index: number) {
  const polygons = feature.geometry.type === "Polygon"
    ? [feature.geometry.coordinates]
    : feature.geometry.coordinates;
  const provinceGroup = new THREE.Group();
  provinceGroup.name = feature.properties.name ?? `province-${index}`;

  polygons.forEach((polygon) => {
    const outerRing = polygon[0];
    if (!outerRing || outerRing.length < 4 || polygonArea(outerRing) < .01) return;

    const projected = outerRing.map(([longitude, latitude]) => projectCoordinate(longitude, latitude));
    const shape = new THREE.Shape();
    projected.forEach((point, pointIndex) => {
      if (pointIndex === 0) shape.moveTo(point.x, point.y);
      else shape.lineTo(point.x, point.y);
    });
    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: .42,
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: .045,
      bevelThickness: .055,
      curveSegments: 1,
    });
    const material = new THREE.MeshStandardMaterial({
      color: MAP_COLORS.province[index % MAP_COLORS.province.length],
      metalness: .18,
      roughness: .62,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    provinceGroup.add(mesh);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry, 18),
      new THREE.LineBasicMaterial({ color: MAP_COLORS.edge, transparent: true, opacity: .36 }),
    );
    provinceGroup.add(edges);
  });

  return provinceGroup;
}

function createNetworkMarker(node: CityNode, index: number) {
  const group = new THREE.Group();
  const worldPosition = projectCoordinate(node.longitude, node.latitude);
  group.position.set(worldPosition.x, worldPosition.y, worldPosition.z + .32);

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(.055, .095, .8, 12),
    new THREE.MeshStandardMaterial({ color: MAP_COLORS.marker, emissive: MAP_COLORS.markerEmissive, emissiveIntensity: .4 }),
  );
  stem.rotation.x = Math.PI / 2;
  stem.position.z = .36;
  group.add(stem);

  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(.16, 16, 12),
    new THREE.MeshStandardMaterial({ color: MAP_COLORS.node, emissive: MAP_COLORS.nodeEmissive, emissiveIntensity: .65 }),
  );
  cap.position.z = .78;
  group.add(cap);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: MAP_COLORS.node,
    transparent: true,
    opacity: .42,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const ring = new THREE.Mesh(new THREE.RingGeometry(.2, .27, 28), ringMaterial);
  ring.position.z = .03;
  ring.userData.phase = index * .76;
  ring.userData.ringMaterial = ringMaterial;
  group.add(ring);

  group.userData.ring = ring;
  return group;
}

export function PartnerNetworkMap({ locations }: PartnerNetworkMapProps) {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef(new Map<string, HTMLButtonElement>());
  const cityTabRefs = useRef(new Map<string, HTMLButtonElement>());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">("loading");

  const cityNodes = useMemo<CityNode[]>(() => CITY_BLUEPRINTS.map((blueprint) => ({
    id: blueprint.id,
    name: blueprint.name,
    englishName: blueprint.englishName,
    longitude: blueprint.longitude,
    latitude: blueprint.latitude,
    labelOffsetX: blueprint.labelOffsetX,
    labelOffsetY: blueprint.labelOffsetY,
    locations: locations.filter((location) => location.city.includes(blueprint.match)),
  })).filter((node) => node.locations.length > 0), [locations]);

  const [activeCityId, setActiveCityId] = useState(cityNodes[0]?.id ?? "wuhan");
  const activeCity = cityNodes.find((node) => node.id === activeCityId) ?? cityNodes[0];

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    let frame = 0;
    let disposed = false;
    let isVisible = true;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(MAP_COLORS.fog, 42, 83);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      const errorFrame = window.requestAnimationFrame(() => setMapStatus("error"));
      return () => window.cancelAnimationFrame(errorFrame);
    }

    renderer.setClearColor(0x070908, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.dataset.partnerNetworkCanvas = "true";
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(38, 1, .1, 120);
    camera.position.copy(CAMERA_HOME);
    camera.lookAt(CAMERA_TARGET);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(CAMERA_TARGET);
    controls.enableDamping = !reducedMotionQuery.matches;
    controls.dampingFactor = .075;
    controls.enablePan = false;
    controls.minDistance = 34;
    controls.maxDistance = 73;
    controls.minPolarAngle = .72;
    controls.maxPolarAngle = 2.2;
    controls.minAzimuthAngle = -.72;
    controls.maxAzimuthAngle = .72;
    controls.rotateSpeed = .48;
    controls.zoomSpeed = .72;
    controls.saveState();
    controlsRef.current = controls;

    const ambientLight = new THREE.HemisphereLight(0xbdf8f1, 0x07100c, 2.3);
    scene.add(ambientLight);
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(-16, -18, 36);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(MAP_COLORS.rim, 1.15);
    rimLight.position.set(22, 12, 18);
    scene.add(rimLight);

    const mapGroup = new THREE.Group();
    const geoJson = chinaGeoJson as unknown as MapFeatureCollection;
    geoJson.features.forEach((feature, index) => {
      if (feature.properties.name === "南海诸岛") return;
      mapGroup.add(createProvinceMeshes(feature, index));
    });
    mapGroup.position.set(-1.2, 1.1, 0);
    scene.add(mapGroup);

    const networkMarkers = cityNodes.map((node, index) => {
      const marker = createNetworkMarker(node, index);
      marker.position.x -= 1.2;
      marker.position.y += 1.1;
      scene.add(marker);
      return marker;
    });

    const underlay = new THREE.Mesh(
      new THREE.PlaneGeometry(53, 35),
      new THREE.MeshBasicMaterial({ color: MAP_COLORS.underlay, transparent: true, opacity: .62, side: THREE.DoubleSide }),
    );
    underlay.position.set(-1.2, 1.1, -.24);
    scene.add(underlay);

    function resize() {
      if (!mount || disposed) return;
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function positionLabels() {
      if (!mount) return;
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      cityNodes.forEach((node) => {
        const element = markerRefs.current.get(node.id);
        if (!element) return;
        const projected = projectCoordinate(node.longitude, node.latitude);
        projected.x -= 1.2;
        projected.y += 1.1;
        projected.z += .98;
        projected.project(camera);
        const visible = projected.z > -1 && projected.z < 1;
        element.style.left = `${(projected.x * .5 + .5) * width + node.labelOffsetX}px`;
        element.style.top = `${(-projected.y * .5 + .5) * height + node.labelOffsetY}px`;
        element.style.visibility = visible ? "visible" : "hidden";
      });
    }

    const renderStartedAt = performance.now();
    function render() {
      if (disposed) return;
      frame = window.requestAnimationFrame(render);
      if (!isVisible || document.hidden) return;
      const elapsed = (performance.now() - renderStartedAt) / 1000;
      controls.update();

      if (!reducedMotionQuery.matches) {
        networkMarkers.forEach((marker) => {
          const ring = marker.userData.ring as THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
          const phase = ring.userData.phase as number;
          const progress = ((elapsed * .5 + phase) % 1 + 1) % 1;
          const scale = 1 + progress * 2.5;
          ring.scale.setScalar(scale);
          ring.material.opacity = .45 * (1 - progress);
        });
      }

      positionLabels();
      renderer.render(scene, camera);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true;
    }, { rootMargin: "160px" });
    visibilityObserver.observe(mount);
    const syncMotionPreference = () => {
      controls.enableDamping = !reducedMotionQuery.matches;
    };
    reducedMotionQuery.addEventListener("change", syncMotionPreference);

    resize();
    render();
    const readyFrame = window.requestAnimationFrame(() => setMapStatus("ready"));

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(readyFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      reducedMotionQuery.removeEventListener("change", syncMotionPreference);
      controls.dispose();
      cameraRef.current = null;
      controlsRef.current = null;
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [cityNodes]);

  function adjustZoom(scale: number) {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const offset = camera.position.clone().sub(controls.target);
    const distance = THREE.MathUtils.clamp(offset.length() * scale, controls.minDistance, controls.maxDistance);
    offset.setLength(distance);
    camera.position.copy(controls.target).add(offset);
    controls.update();
  }

  function resetView() {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    camera.position.copy(CAMERA_HOME);
    controls.target.copy(CAMERA_TARGET);
    camera.lookAt(CAMERA_TARGET);
    controls.update();
  }

  function handleCityTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % cityNodes.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + cityNodes.length) % cityNodes.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = cityNodes.length - 1;
    else return;

    event.preventDefault();
    const nextCity = cityNodes[nextIndex];
    setActiveCityId(nextCity.id);
    cityTabRefs.current.get(nextCity.id)?.focus();
  }

  if (!activeCity) return null;

  return (
    <section className={styles.section} id="partner-network" aria-labelledby="partner-network-heading">
      <div className={styles.heading}>
        <div className={styles.headingCopy}>
          <h2 id="partner-network-heading">全国协作网络</h2>
          <span className={styles.headingMeta} lang="en">NETWORK / LOCATIONS</span>
        </div>
        <p>
          以武汉为连接点，协同深圳、上海、广州与昆明的区域团队。选择地图标注，查看现有联系地点与沟通方式。
        </p>
      </div>

      <div className={styles.workspace}>
        <div className={styles.stage} aria-label="可拖动、缩放的三维中国联系地图">
          <div ref={canvasMountRef} className={styles.canvasMount} aria-busy={mapStatus === "loading"} />

          {mapStatus !== "error" ? (
            <div className={styles.markerLayer} aria-label="地图城市标注">
              {cityNodes.map((node) => (
                <button
                  type="button"
                  className={styles.marker}
                  data-active={node.id === activeCity.id}
                  key={node.id}
                  ref={(element) => {
                    if (element) markerRefs.current.set(node.id, element);
                    else markerRefs.current.delete(node.id);
                  }}
                  onFocus={() => setActiveCityId(node.id)}
                  onMouseEnter={() => setActiveCityId(node.id)}
                  onClick={() => setActiveCityId(node.id)}
                  onPointerDown={(event) => event.stopPropagation()}
                  aria-label={`查看${node.name}联系信息`}
                >
                  <span>{node.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.fallback} role="status">
              <strong>三维地图暂时无法载入</strong>
              <p>浏览器未能建立 WebGL 场景。联系信息面板仍可完整浏览和选择。</p>
            </div>
          )}

          {mapStatus !== "error" ? (
            <div className={styles.controls} aria-label="地图视角控制">
              <button type="button" onClick={() => adjustZoom(.84)} aria-label="放大地图" title="放大地图">
                <Plus aria-hidden="true" />
              </button>
              <button type="button" onClick={() => adjustZoom(1.18)} aria-label="缩小地图" title="缩小地图">
                <Minus aria-hidden="true" />
              </button>
              <button type="button" onClick={resetView} aria-label="重置地图视角" title="重置地图视角">
                <RotateCcw aria-hidden="true" />
              </button>
            </div>
          ) : null}
          <p className={styles.srOnly}>拖动地图可旋转视角，滚轮或双指可缩放。</p>
        </div>

        <aside className={styles.details} aria-label="联系地点信息">
          <div className={styles.detailsHeader}>
            <span lang="en">ACTIVE LOCATION</span>
            <small>{String(cityNodes.findIndex((node) => node.id === activeCity.id) + 1).padStart(2, "0")} / {String(cityNodes.length).padStart(2, "0")}</small>
          </div>

          <div className={styles.cityTabs} role="tablist" aria-label="选择联系城市">
            {cityNodes.map((node, index) => (
              <button
                type="button"
                role="tab"
                id={`partner-city-tab-${node.id}`}
                aria-controls={`partner-city-panel-${node.id}`}
                aria-selected={node.id === activeCity.id}
                tabIndex={node.id === activeCity.id ? 0 : -1}
                key={node.id}
                ref={(element) => {
                  if (element) cityTabRefs.current.set(node.id, element);
                  else cityTabRefs.current.delete(node.id);
                }}
                onClick={() => setActiveCityId(node.id)}
                onKeyDown={(event) => handleCityTabKeyDown(event, index)}
              >
                <small>{String(index + 1).padStart(2, "0")}</small>
                <span className={styles.cityLabels}>
                  <span className={styles.cityEnglish} lang="en">{node.englishName}</span>
                  <strong>{node.name}</strong>
                </span>
              </button>
            ))}
          </div>

          <div
            className={styles.cityPanel}
            role="tabpanel"
            id={`partner-city-panel-${activeCity.id}`}
            aria-labelledby={`partner-city-tab-${activeCity.id}`}
            aria-live="polite"
          >
            <h3>{activeCity.name}</h3>
            <p className={styles.cityPanelLead}>{activeCity.locations.length} 个已公开联系地点</p>

            <div className={styles.locationList}>
              {activeCity.locations.map((location, index) => (
                <article className={styles.location} key={`${location.city}-${location.address}`}>
                  <span className={styles.locationIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <div className={styles.locationBody}>
                    <div className={styles.locationHeading}>
                      <span className={styles.locationEnglish} lang="en">{location.englishLabel}</span>
                      <strong>{location.city}</strong>
                    </div>
                    <span className={styles.contactLine}>
                      <MapPin aria-hidden="true" />
                      <span>{location.address}</span>
                    </span>
                    <span className={styles.contactLine}>
                      <Phone aria-hidden="true" />
                      <a href={`tel:${location.phone}`}>{location.phone}</a>
                    </span>
                    {location.email ? (
                      <span className={styles.contactLine}>
                        <Mail aria-hidden="true" />
                        <a href={`mailto:${location.email}`}>{location.email}</a>
                      </span>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
