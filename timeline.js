const projectData = {
  startMonth: 'April',
  startYear: 2019,
}
const data = [
  {
    name: 'Planning',
    targetMonth: 'January',
    tagertYear: 2020,
    description: "Planning blurb for demo",
    deliverable: "Plans for project",
  },
  {
    name: 'Design',
    targetMonth: 'March',
    tagertYear: 2020,
    description: "Design blurb for demo",
    deliverable: "Design for project",
  },
  {
    name: 'Bids',
    targetMonth: 'April',
    tagertYear: 2020,
    description: "The city will seek construction bids based on the final design. Vendors will submit bids for review and selection.",
    deliverable: "A bid is selected and finalized, with an associated construction timeline and budget",
    current: true,
  },
  {
    name: 'Construction',
    targetMonth: 'January',
    tagertYear: 2021,
    description: "Construction work for the project is underway",
    deliverable: "Constructed amenity",
  },
  {
    name: 'Close',
    targetMonth: 'March',
    tagertYear: 2021,
    description: "Finalize construction timeline",
    deliverable: "Project is completed and open for public use",
  }
];

const container = document.getElementById("container");

// TODO: migrate from css file
const makeStyle = () => {
  const style = document.createElement("style")
  styleElement.innerHTML = `
    `;
  return styleElement;
}

const makePhaseContent = (phase, phaseElem) => {
  const content = document.createElement("div")
  content.className = "content"

  const header = document.createElement("span")
  header.innerText = phase.name;
  header.className = "header"
  content.appendChild(header)

  const description = document.createElement("span")
  description.innerText = phase.description;
  description.className = "description"
  content.appendChild(description)

  const deliverable = document.createElement("span")
  deliverable.innerHTML = `<em>Deliverable:</em> ${phase.deliverable}`;
  deliverable.className = "deliverable"
  content.appendChild(deliverable)

  phaseElem.appendChild(content);

  const arrow = document.createElement("arrow")
  arrow.className = "arrow"
  const arrowOutline = document.createElement("arrow-outline")
  arrowOutline.className = "arrow-outline"
  phaseElem.appendChild(arrow)
  phaseElem.appendChild(arrowOutline)
}

const makePhase = (phase, status) => {
  const elem = document.createElement("div");
  elem.classList.add('timeline-phase-container')
  if (status) { elem.classList.add(status) }

  const input = document.createElement("input");
  input.setAttribute("type", "radio");
  input.setAttribute("name", "timeline");
  input.classList.add('timeline-phase')
  if (status) { input.classList.add(status) }
  if (status === "current") {
    input.setAttribute("checked", true);
  }
  elem.appendChild(input)

  const label = document.createElement("span");
  label.innerText = phase.name;
  label.className = status;
  label.onclick = () => {input.click();}
  elem.appendChild(label)


  makePhaseContent(phase, elem)
  return elem;
}

const timeline = document.createElement("div");
timeline.setAttribute("class", "timeline");
container.appendChild(timeline);
let foundCurrent = false;
for (let phase of data) {
  console.log(phase);
  let phaseElem;
  if (phase.current) {
    phaseElem = makePhase(phase, "current");
    foundCurrent = true;
  } else {
    phaseElem = makePhase(phase, foundCurrent ? "future": "");
  }
  timeline.appendChild(phaseElem);
}
