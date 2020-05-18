const CATEGORIES = [
  {
    orgNumber: 10802020, 
    name: "Connectivity",
    className: "connectivity",
    color: "0072bd",
    colorFade: "80b9de",
  },
  {
    orgNumber: 10802030, 
    name: "Cultural Arts & Tourism",
    className: "cultural",
    color: "9659a6",
    colorFade: "cbacd2",
  },
  {
    orgNumber: 10802040, 
    name: "Parks & Recreation",
    className: "parks",
    color: "75a738",
    colorFade: "bad39b",
  },
  {
    orgNumber: 10802050, 
    name: "Education",
    className: "education",
    color: "c14f44",
    colorFade: "e0a7a2",
  },
]
const PROJECTION = [
    {
        "estimate": 16500000.00,
        "budgetStatus": "Exploratory",
        "orgNumber": 10802030,
        "date": "3/3/2020",
        "accountNumber": "10802030-20567",
        "project": "Athletic and Events Center"
    },
    {
        "estimate": 3000000.00,
        "budgetStatus": "Planning",
        "orgNumber": 10802030,
        "date": "3/3/2020",
        "accountNumber": "10802030-20552",
        "project": "Bama Theatre"
    },
    {
        "estimate": 10000000.00,
        "budgetStatus": "Not begun",
        "orgNumber": 10802040,
        "date": "3/3/2020",
        "accountNumber": 10802040,
        "project": "Bowers Park"
    },
    {
        "estimate": 5024861.00,
        "budgetStatus": "Planning",
        "orgNumber": 10802020,
        "date": "3/3/2020",
        "accountNumber": "10802020-20551",
        "project": "Downtown, Riverfront and Workforce Transit"
    },
    {
        "estimate": 7500000.00,
        "budgetStatus": "Not begun",
        "orgNumber": 10802020,
        "date": "3/3/2020",
        "accountNumber": 10802020,
        "project": "Downtown-University Corridor"
    },
    {
        "estimate": 43000000.00,
        "budgetStatus": "Exploratory",
        "orgNumber": 10802030,
        "date": "3/3/2020",
        "accountNumber": "10802030-20567",
        "project": "Experience Venue(s)"
    },
    {
        "estimate": 3000000.00,
        "budgetStatus": "Planning",
        "orgNumber": 10802040,
        "date": "3/3/2020",
        "accountNumber": "10802040-20557",
        "project": "Harris-Nicol Water Recreation and Trails "
    },
    {
        "estimate": 5000000.00,
        "budgetStatus": "Exploratory",
        "orgNumber": 10802040,
        "date": "3/3/2020",
        "accountNumber": "10802040-20553",
        "project": "McAbee Senior Center"
    },
    {
        "estimate": 1500000.00,
        "budgetStatus": "Finalized",
        "orgNumber": 10802040,
        "date": "3/3/2020",
        "accountNumber": "10802040-20554",
        "project": "McDonald Hughes Phase I"
    },
    {
        "estimate": 5000000.00,
        "budgetStatus": "Planning",
        "orgNumber": 10802020,
        "date": "3/3/2020",
        "accountNumber": "10802020-20563",
        "project": "Northern Riverwalk"
    },
    {
        "estimate": 5000000.00,
        "budgetStatus": "Not begun",
        "orgNumber": 10802040,
        "date": "3/3/2020",
        "accountNumber": 10802040,
        "project": "Phelps Center"
    },
    {
        "estimate": 7500000.00,
        "budgetStatus": "Not begun",
        "orgNumber": 10802020,
        "date": "3/3/2020",
        "accountNumber": 10802020,
        "project": "Project Trinity"
    },
    {
        "estimate": 5000000.00,
        "budgetStatus": "Planning",
        "orgNumber": 10802040,
        "date": "3/3/2020",
        "accountNumber": "10802040-20571",
        "project": "River District Park"
    },
    {
        "estimate": 12000000.00,
        "budgetStatus": "Planning",
        "orgNumber": 10802030,
        "date": "3/3/2020",
        "accountNumber": "10802030-19524",
        "project": "Saban Center - purchase, engineering, and design"
    },
    {
        "estimate": 2300000.00,
        "budgetStatus": "Planning",
        "orgNumber": 10802040,
        "date": "3/3/2020",
        "accountNumber": "10802040-20555",
        "project": "Snow Hinton Park"
    },
    {
        "estimate": 9500000.00,
        "budgetStatus": "Not begun",
        "orgNumber": 10802040,
        "date": "3/3/2020",
        "accountNumber": 10802040,
        "project": "Sokol Park"
    },
    {
        "estimate": 500000.00,
        "budgetStatus": "Finalized",
        "orgNumber": 10802040,
        "date": "3/3/2020",
        "accountNumber": "10802040-20566",
        "project": "All-inclusive playground at Sokol Park"
    },
    {
        "estimate": 15000000.00,
        "budgetStatus": "Not begun",
        "orgNumber": 10802020,
        "date": "3/3/2020",
        "accountNumber": 10802020,
        "project": "Tuscaloosa National Airport"
    },
    {
        "estimate": 3500000.00,
        "budgetStatus": "Exploratory",
        "orgNumber": 10802040,
        "date": "3/3/2020",
        "accountNumber": "10802040-20556",
        "project": "Tuscaloosa Tennis Center"
    },
    {
        "estimate": 5000000.00,
        "budgetStatus": "Planning",
        "orgNumber": 10802020,
        "date": "3/3/2020",
        "accountNumber": "10802020-20565",
        "project": "Western Riverwalk"
    },
    {
      "project": "Dual Enrollment Scholarships",
      "estimate": 7815967,
      "orgNumber": 10802050,
      "budgetStatus": "Finalized",
      "date": "3/3/2020",
    },
    {
      "project": "Tuscaloosa Pre-K Initiative",
      "estimate": 3832403,
      "orgNumber": 10802050,
      "budgetStatus": "Finalized",
      "date": "3/3/2020",
    },
    {
      "project": "Summer Learning Academies",
      "estimate": 2737427,
      "orgNumber": 10802050,
      "budgetStatus": "Finalized",
      "date": "3/3/2020",
    },
]

window.onload = () => {
  const elem = document.getElementById("myboxes");
  elem.setAttribute('item-data', JSON.stringify({
    categories: CATEGORIES,
    projection: PROJECTION,
  }));
}
