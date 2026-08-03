const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Load map image
const img = new Image();
img.src = "./Images/Map.png";

const locationPoints = {
  "Main Gate": [
        1550,
        457
    ],
  "Gents Hostel 1": [
        1110,
        475
    ],
  "Gents Hostel 2": [
        1010,
        470
    ],
    "Gents Hostel 3": [
        1094,
        519
    ],
    "Gents hostel 4": [
        1080,
        601
    ],
    "Gents hostel 5": [
        1080,
        631
    ],
    "Gents hostel 6": [
        1175,
        610
    ],
    "UG Mess(Gents)": [
        1166,
        665
    ],
    "PG Mess(Gents)": [
        1022,
        533
    ],
    "Gents hostel 7, 8, 9": [
        1110,
        700
    ],
  "BME & Chimcal dept.": [
        923,
        710
    ],

    "EEE & Civil Dept": [
        784,
        725
    ],
    "Mini aditorium": [
        502,
        557
    ],
    "Phy & Che Lab": [
        502,
        587
    ],
    "Mechanical workshop": [
        532,
        537
    ],
    "SNU AB 1": [
        397,
        409
    ],
    "SNU AB 2": [
        397,
        479
    ],
    "SNU AB 3": [
        397,
        309
    ],
    "Football ground": [
        235,
        390
    ],
    "Cricket ground": [
        100,
        430
    ],
    "Sport complus": [
        542,
        334
    ],
    "GYM": [
        540,
        284
    ],
    "Main cateen": [
        600,
        292
    ],
    "Ladies Hostel": [
        709,
        277
    ],
    "Ashwins": [
        790,
        279
    ],
    "Clock Tower": [
        795,
        335
    ],
    "MBA block": [
        1100,
        307
    ],
    "ATM & TM Bank": [
        1032,
        290
    ],
    "Main Aditorium": [
        1198,
        312
    ],
    "School of Law": [
        843,
        232
    ],
    "Incubation Center": [
        1435,
        357
    ],
    "Staff quarters": [
        1200,
        190
    ],
    "CDC": [
        773,
        452
    ],
    "Fountain": [
        725,
        468
    ],
    "SSN Admin": [
        674,
        443
    ],
    "Vamma Sundhari park": [
        1000,
        368
    ],
    "CSE & IT Dept": [
        861,
        503
    ],
    "First year block": [
        861,
        430
    ],
    "ECE": [
        769,
        561
    ],
    "Library": [
        790,
        511
    ],
    "Rishabhs & snow cube": [
        665,
        495
    ]
};


img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  drawLocationLabels();
};

// Load locations
fetch("https://campus-navigator-gt32.onrender.com/locations")
  .then(res => res.json())
  .then(locations => {
    const list = document.getElementById("locations");

    locations.forEach(loc => {
      const option = document.createElement("option");
      option.value = loc;
      list.appendChild(option);
    });
  });

// Start marker
function drawStart(x, y) {
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();
}

// End marker (📍)
function drawEnd(x, y) {
  ctx.fillStyle = "green";

  ctx.beginPath();
  ctx.arc(x, y - 6, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x, y + 6);
  ctx.lineTo(x - 4, y);
  ctx.lineTo(x + 4, y);
  ctx.closePath();
  ctx.fill();
}

// Find path
function findPath() {
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!start || !end) {
    alert("Please enter both locations");
    return;
  }

  document.getElementById("legend-start").textContent = `🔵 ${start}`;
  document.getElementById("legend-end").textContent = `🟢 ${end}`;

  ctx.drawImage(img, 0, 0);
  drawLocationLabels();

  fetch("https://campus-navigator-gt32.onrender.com/find-path", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ start, end })
  })
  .then(res => res.json())
  .then(data => {
    if (!data.path) {
      alert("Invalid place Entered");
      return;
    }

    ctx.strokeStyle = "rgba(255,0,0,0.3)";
    ctx.lineWidth = 10;
    ctx.beginPath();
    data.path.forEach(([x,y],i)=> i?ctx.lineTo(x,y):ctx.moveTo(x,y));
    ctx.stroke();

    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;
    ctx.beginPath();
    data.path.forEach(([x,y],i)=> i?ctx.lineTo(x,y):ctx.moveTo(x,y));
    ctx.stroke();

    drawStart(...data.path[0]);
    drawEnd(...data.path[data.path.length - 1]);
  })
  .catch(() => alert("Backend not reachable"));
}

function drawLocationLabels() {
  ctx.font = "14px Inter, Arial";
  ctx.fillStyle = "#111";
  ctx.textAlign = "left";

  Object.entries(locationPoints).forEach(([name, [x, y]]) => {
    // Marker dot
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#2563eb";
    ctx.fill();

    // Label background (optional but improves readability)
    const padding = 4;
    const textWidth = ctx.measureText(name).width;

    ctx.fillStyle = "#111";
    ctx.fillText(name, x + 10, y - 3);

    // Label text
    ctx.fillStyle = "#111";
    ctx.fillText(name, x + 10, y - 3);
  });
}
