const projectData = {
  startDate: new Date(2019, 5) // June 2019
}
const data = [
  {
    name: 'Planning',
    targetDate: new Date(2019, 9), // Oct 2019
    description: "Planning blurb for demo",
    deliverable: "Plans for project",
  },
  {
    name: 'Design',
    targetDate: new Date(2020, 1), // Feb 2020
    description: "Design blurb for demo",
    deliverable: "Design for project",
  },
  {
    name: 'Bids',
    targetDate: new Date(2020, 3), // Apr 2020
    description: "The city will seek construction bids based on the final design. Vendors will submit bids for review and selection.",
    deliverable: "A bid is selected and finalized, with an associated construction timeline and budget",
    current: true,
  },
  {
    name: 'Construction',
    targetDate: new Date(2020, 9), // Oct 2020
    description: "Construction work for the project is underway",
    deliverable: "Constructed amenity",
  },
  {
    name: 'Close',
    targetDate: new Date(2020, 10), // Nov 2020
    description: "Finalize construction timeline",
    deliverable: "Project is completed and open for public use",
  }
];

const getPhaseLength = (startDate, endDate) => {
  return (
    (endDate.getFullYear() - startDate.getFullYear()) * 12
    + endDate.getMonth() - startDate.getMonth()
  )
}

const getPhaseStatus = (startDate, endDate) => {
  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();
  if (nowYear < startDate.getFullYear()
    || (nowYear == startDate.getFullYear() && nowMonth <= startDate.getMonth()))
  {
    return "future";
  }

  if (nowYear < endDate.getFullYear()
    || (nowYear == endDate.getFullYear() && nowMonth <= endDate.getMonth()))
  {
    return "current";
  }

  return "";
}

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

const makePhase = (phase, width, status) => {
  const elem = document.createElement("div");
  elem.classList.add('timeline-phase-container')
  elem.setAttribute("style", `width: ${width}%`);
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

const formatDate = (date) => `${date.getMonth() + 1}/${date.getFullYear() % 100}`;

const makeDot = (date, width) => {
  const dot = document.createElement("div")
  dot.className = "dot";
  dot.setAttribute("style", `width: ${width}%`);
  const dateLabel = document.createElement("span");
  dateLabel.textContent = formatDate(startDate)
  dateLabel.className = "dot-label";
  dot.appendChild(dateLabel);
  return dot;
}

const dots = document.createElement("div");
dots.className = "dots";
container.appendChild(dots);
const line = document.createElement("span");
line.className = "line";
dots.appendChild(line);


const timeline = document.createElement("div");
timeline.setAttribute("class", "timeline");
container.appendChild(timeline);

let startDate = projectData.startDate;
const totalLength = getPhaseLength(startDate, data[data.length - 1].targetDate);
console.log('total', totalLength);
for (let phase of data) {
  const phaseLength = getPhaseLength(startDate, phase.targetDate);
  console.log(startDate, phase.targetDate, phaseLength);
  const width = (phaseLength / totalLength) * 100
  const phaseElem = makePhase(
    phase, width, getPhaseStatus(startDate, phase.targetDate));

  timeline.appendChild(phaseElem);
  dots.appendChild(makeDot(startDate, width));

  startDate = phase.targetDate;
}

dots.appendChild(makeDot(startDate, 0));

