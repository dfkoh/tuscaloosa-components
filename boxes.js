
const container = document.getElementById("container");

const makeElement = (tag, className) => {
  const elem = document.createElement(tag);
  elem.className = className;
  return elem;
}

const makeProjectClassName = (name) => (
  name.toLowerCase().replace(/[^a-z]+/g, '-')
)

const getCategory = (project) => (
  CATEGORIES.filter((c) => c.orgNumber === project.orgNumber)[0]
)


const makeStyle = () => {
  const style = document.createElement("style")
  let styleText = ``;

  CATEGORIES.forEach((category) => {
    styleText += `
.box.${category.className} {
    border-color: #${category.color};
    background-color: #${category.color};
}

.project-box.${category.className} {
    border-color: #${category.color};
    background-color: #${category.color};
}

.fade .box.${category.className} {
    border-color: #${category.colorFade};
    background-color: #${category.colorFade};
}

.shrink.${category.className} .box.${category.className} {
    transform: scale(1.0);
}

  `
  })

  PROJECTION.forEach((project) => {
    const cls = makeProjectClassName(project.project);
    const category = getCategory(project);
    styleText += `
.${cls} .fade .box.${cls} {
    border-color: #${category.color};
    background-color: #${category.color};
}
.${cls} .selected .project.${cls} {
    background-color: rgba(151, 151, 151, 0.1);
}
    `
  })
  style.innerHTML = styleText;
  return style;
}

container.appendChild(makeStyle());

const projection = makeElement("div", "projection");
container.appendChild(projection)

const boxContainer = makeElement("div", "boxContainer");
projection.appendChild(boxContainer)

const title = makeElement("span", "title");
title.innerText = "CURRENT 10 YEAR PROPOSAL"
const subtitle = makeElement("span", "subtitle");
subtitle.innerText = "Click to explore"
boxContainer.appendChild(title)
boxContainer.appendChild(subtitle)

const boxes = makeElement("div", "boxes");
// Use the wrapper for events so that there aren't "gaps" in the
// highlightable area
boxes.onmouseenter = () => { 
  boxes.classList.add('fade');
}
boxes.onmouseleave = () => { 
  boxes.classList.remove('fade');
}

boxContainer.appendChild(boxes);

const makeLegend = () => {
  const legend = makeElement("div", "legend");

  const key = makeElement("span", "legend-key");
  key.innerText = "Key:"
  legend.appendChild(key);
  CATEGORIES.forEach((category) => {
    const categoryLegend = makeElement("div", "legend-category");
    legend.appendChild(categoryLegend)

    const box = makeElement("div", "box");
    box.classList.add(category.className);
    categoryLegend.appendChild(box);

    const label = makeElement("span", "legend-label");
    label.innerText = category.name;
    categoryLegend.appendChild(label);
  })
  const scale = makeElement("div", "legend-scale");
  legend.appendChild(scale);
  scale.appendChild(makeElement("div", "box"));

  const label = makeElement("span", "legend-label");
  label.innerText = "= $1 million";
  scale.appendChild(label);

  return legend;
}

boxContainer.appendChild(makeLegend());

const numBoxes = PROJECTION.reduce((acc, proj) => (
  acc + Math.round(proj.estimate / 1000000)
), 0)
console.log(numBoxes)

for (let i = 0; i < numBoxes; i++) {
  const boxWrapper = document.createElement("div");
  boxWrapper.appendChild(makeElement("div", "box"));
  boxes.appendChild(boxWrapper);
}

const projectsDiv = makeElement("div", "projects");
projection.appendChild(projectsDiv)

var currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

const ROW_WIDTH = 15

// Snakes around so all project boxes are adjacent
const getNextBox = (() => {
  let currBox = 0;
  return () => {
    const currRow = Math.floor(currBox / ROW_WIDTH);
    const currCol = currBox % ROW_WIDTH;
    let currIndex;
    if (currRow % 2 == 1) {
      currIndex = currRow * ROW_WIDTH + (ROW_WIDTH - 1 - currCol);
    } else {
      currIndex = currRow * ROW_WIDTH + currCol;
    }

    currBox += 1;
    const wrapper = boxes.children[currIndex];
    return [wrapper.children[0], wrapper];
  }
})()


let categoryDivs = [];

const makeCategory = (category) => {
  const categoryDiv = makeElement("div", "category");
  categoryDivs.push(categoryDiv);

  const clickHandler = (event) => {
    if (categoryDiv.classList.contains("selected")) {
      categoryDiv.classList.remove("selected");
      boxes.classList.remove("shrink");
      boxes.classList.remove(category.className);
    } else {
      categoryDivs.forEach((c) => {
        c.classList.remove("selected");
        CATEGORIES.forEach((other) => {
          boxes.classList.remove(other.className);
        })
      })
      categoryDiv.classList.add("selected");
      boxes.classList.add("shrink");
      boxes.classList.add(category.className);
    }
  }


  const title = makeElement("span", "category-title");
  title.onclick = clickHandler;
  title.innerText = category.name + " Projects"
  categoryDiv.appendChild(title);

  const projects = PROJECTION.filter((p) => p.orgNumber === category.orgNumber);
  for (let project of projects) {
    const projectClass = makeProjectClassName(project.project);
    const div = makeElement("div", "project");
    div.classList.add(projectClass);
    div.onmouseenter = () => { 
      boxes.classList.add('fade')
      projection.classList.add(projectClass);
    }
    div.onmouseleave = () => { 
      boxes.classList.remove('fade')
      projection.classList.remove(projectClass);
    }

    categoryDiv.appendChild(div);

    // Add t-shirt size boxes for project
    const projectBoxes = makeElement("div", "project-boxes");
    div.appendChild(projectBoxes);
    const numProjectBoxes = Math.round(project.estimate / 1000000)
    for (let i = 0; i < numProjectBoxes; i++) {
      const projectBox = makeElement("div", "project-box")
      projectBox.classList.add(category.className); 
      projectBoxes.appendChild(projectBox);
      const [box, wrapper] = getNextBox();
      box.classList.add(category.className);
      box.classList.add(makeProjectClassName(project.project));

      // Use the wrapper for events so that there aren't "gaps" in the
      // clickable/highlightable area
      wrapper.onclick = clickHandler;
      wrapper.onmouseenter = () => { 
        projection.classList.add(projectClass);
      }
      wrapper.onmouseleave = () => { 
        projection.classList.remove(projectClass);
      }

    }

    const projectDetails = makeElement("div", "project-details");
    div.appendChild(projectDetails);

    const title = makeElement("span", "project-title");
    title.innerText = project.project;
    projectDetails.appendChild(title);

    const status = makeElement("span", "project-status");
    status.innerHTML = "<b>Status:</b> " + project.budgetStatus;
    projectDetails.appendChild(status);

    const budget = makeElement("span", "project-budget");
    if (project.budgetStatus === "Finalized") {
      budget.innerHTML = "<b>Budget:</b> " + 
        currencyFormat.format(project.estimate.toString());
    } else {
      budget.innerHTML = "<b>Budget:</b> Pending design proposal";
    }
    projectDetails.appendChild(budget);
  }
  return categoryDiv;
}

for (let category of CATEGORIES) {
  const categoryDiv = makeCategory(category)
  projectsDiv.appendChild(categoryDiv);
}




