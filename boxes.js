
const makeElement = (tag, className) => {
  const elem = document.createElement(tag);
  elem.className = className;
  return elem;
}

const makeProjectClassName = (name) => (
  name.toLowerCase().replace(/[^a-z]+/g, '-')
)

var currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

const ROW_WIDTH = 15

class Projection extends HTMLElement {
	constructor() {
		super();

    const div = document.createElement('div');		
    div.setAttribute("class", "container");
    this.container = div;

    // Dummy data for preview
    this.projectionData = []
    this.categories = []

    this.projection = null;
    this.boxes = null;
    this.categoryDivs = [];
    this.currBox = 0;
	}

	static get observedAttributes() {
		return ['item-data'];
	}

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'item-data') {
      const {projection, categories} = JSON.parse(newValue);
      this.projectionData = projection;
      this.categories = categories;
    }
	}

	get projectionData() {
		return this._projectionData;
	}

	set projectionData(d) {
    this._projectionData = d;
    if (this._connected && this.categories.length) {
      this.render();
    }
	}

	get categories() {
		return this._categories;
	}

	set categories(d) {
		this._categories = d;
    if (this._connected && this.projectionData.length) {
      this.render();
    }
	}
  connectedCallback() {
    for (let child of this.children) {
      this.removeChild(child);
    }

    //this.appendChild(createStyle());
    this.appendChild(this.container);
    this._connected = true;
    this.render();
  }

  getCategory(project) {
    return this.categories.filter((c) => c.orgNumber === project.orgNumber)[0]
  }


  makeStyle()  {
    const style = document.createElement("style")
    let styleText = ``;

    this.categories.forEach((category) => {
      styleText += `
.box.${category.className} {
    border-color: #${category.color};
    background-color: #${category.color};
}

.project-box.${category.className} {
    border-color: #${category.color};
    background-color: #${category.color};
}

.fade-hover .box.${category.className} {
    border-color: #${category.colorFade};
    background-color: #${category.colorFade};
}

.fade-click .box.${category.className} {
    border-color: #${category.colorFade};
    background-color: #${category.colorFade};
}

.shrink.${category.className}-clicked .box.${category.className} {
    transform: scale(1.0);
}
  `
    });

    this.projectionData.forEach((project) => {
      const cls = makeProjectClassName(project.project);
      const category = this.getCategory(project);
      styleText += `
/* Un-fade boxes on hover */
.${cls}-hover .fade-hover .box.${cls} {
    border-color: #${category.color};
    background-color: #${category.color};
}

/* Un-fade boxes on click */
.fade-click.${cls}-clicked .box.${cls} {
    border-color: #${category.color};
    background-color: #${category.color};
}

/* Un-fade project on hover */
.${cls}-hover .selected .project.${cls} {
    background-color: rgba(151, 151, 151, 0.1);
}
/* Un-fade project on click*/
.${cls}-clicked .selected .project.${cls} {
    background-color: rgba(151, 151, 151, 0.1);
}

    `
    })
    style.innerHTML = styleText;
    return style;
  }

  clearSelection() {
    this.boxes.classList.remove("shrink");
    this.categoryDivs.forEach((c) => {
      c.classList.remove("selected");
      this.categories.forEach((other) => {
        this.boxes.classList.remove(`${other.className}-clicked`);
      })
      this.boxes.classList.remove("fade-click");
    })
    this.projectionData.forEach((p) => {
      this.projection.classList.remove(`${makeProjectClassName(p.project)}-clicked`);
      this.boxes.classList.remove(`${makeProjectClassName(p.project)}-clicked`);
    })
  };


  // Snakes around so all project boxes are adjacent
  getNextBox() {
    const currRow = Math.floor(this.currBox / ROW_WIDTH);
    const currCol = this.currBox % ROW_WIDTH;
    let currIndex;
    if (currRow % 2 == 1) {
      currIndex = currRow * ROW_WIDTH + (ROW_WIDTH - 1 - currCol);
    } else {
      currIndex = currRow * ROW_WIDTH + currCol;
    }

    this.currBox += 1;
    const wrapper = this.boxes.children[currIndex];
    return [wrapper.children[0], wrapper];
  }

  makeLegend() {
    const legend = makeElement("div", "legend");

    const key = makeElement("span", "legend-key");
    key.innerText = "Key:"
    legend.appendChild(key);
    this.categories.forEach((category) => {
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

  makeCategory (category)  {
    const categoryDiv = makeElement("div", "category");
    this.categoryDivs.push(categoryDiv);

    const categoryClickHandler = (event) => {
      this.clearSelection();
      categoryDiv.classList.add("selected");
      this.boxes.classList.add("shrink");
      this.boxes.classList.add(`${category.className}-clicked`);
      event.stopPropagation();
    }


    const title = makeElement("span", "category-title");
    title.onclick = categoryClickHandler;
    title.innerText = category.name + " Projects"
    categoryDiv.appendChild(title);

    const projects = this.projectionData.filter((p) => p.orgNumber === category.orgNumber);
    for (let project of projects) {
      const projectClass = makeProjectClassName(project.project);
      const projectClickHandler = (event) => {
        categoryClickHandler(event);

        this.boxes.classList.add("fade-click");
        this.projection.classList.add(`${projectClass}-clicked`);
        this.boxes.classList.add(`${projectClass}-clicked`);
      }

      const div = makeElement("div", "project");
      div.classList.add(projectClass);
      div.onclick = projectClickHandler;
      div.onmouseenter = () => { 
        this.boxes.classList.add('fade-hover')
        this.projection.classList.add(`${projectClass}-hover`);
      }
      div.onmouseleave = () => { 
        this.boxes.classList.remove('fade-hover')
        this.projection.classList.remove(`${projectClass}-hover`);
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
        const [box, wrapper] = this.getNextBox();
        box.classList.add(category.className);
        box.classList.add(makeProjectClassName(project.project));

        // Use the wrapper for events so that there aren't "gaps" in the
        // clickable/highlightable area
        wrapper.onclick = projectClickHandler;
        wrapper.onmouseenter = () => { 
          this.projection.classList.add(`${projectClass}-hover`);
        }
        wrapper.onmouseleave = () => { 
          this.projection.classList.remove(`${projectClass}-hover`);
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


  render() {
    console.log(this.container.children);
    let child = this.container.children[0];
    while (child) {
      this.container.removeChild(child);
      child = this.container.children[0];
    }

    //for (let child of this.projection.children) {
    //  this.projection.removeChild(child);
    //}

    this.container.appendChild(this.makeStyle());

    this.projection = makeElement("div", "projection");
    this.container.appendChild(this.projection)

    const boxContainer = makeElement("div", "boxContainer");
    this.projection.appendChild(boxContainer)

    const title = makeElement("span", "title");
    title.innerText = "CURRENT 10 YEAR PROPOSAL"
    const subtitle = makeElement("span", "subtitle");
    subtitle.innerText = "Click to explore"
    boxContainer.appendChild(title)
    boxContainer.appendChild(subtitle)

    this.boxes = makeElement("div", "boxes");
    // Use the wrapper for events so that there aren't "gaps" in the
    // highlightable area
    this.boxes.onmouseenter = () => { 
      this.boxes.classList.add('fade-hover');
    }
    this.boxes.onmouseleave = () => { 
      this.boxes.classList.remove('fade-hover');
    }
    const numBoxes = this.projectionData.reduce((acc, proj) => (
      acc + Math.round(proj.estimate / 1000000)
    ), 0)

    for (let i = 0; i < numBoxes; i++) {
      const boxWrapper = document.createElement("div");
      boxWrapper.appendChild(makeElement("div", "box"));
      this.boxes.appendChild(boxWrapper);
    }

    boxContainer.appendChild(this.boxes);
    boxContainer.appendChild(this.makeLegend());

    const projectsDiv = makeElement("div", "projects");
    this.projection.appendChild(projectsDiv)

    for (let category of this.categories) {
      const categoryDiv = this.makeCategory(category)
      projectsDiv.appendChild(categoryDiv);
    }

    this.projection.onclick = this.clearSelection.bind(this);
  }
}

window.customElements.define('projection-chart', Projection);
