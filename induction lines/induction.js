class Vector {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
  
  get norm() {
    return Math.hypot(this.x, this.y);
  }
  
  static from(v) {
    return new Vector(v.x, v.y);
  }
  
  setZero() {
    this.x = 0;
    this.y = 0;
    return this;
  }
  
  set(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  
  mul(c) {
    this.x *= c;
    this.y *= c;
    return this;
  }
  
  div(c) {
    this.x /= c;
    this.y /= c;
    return this;
  }
  
  normalize() {
    this.div(this.norm);
    return this;
  }
  
  distanceFrom(v) {
    return Math.hypot(this.x - v.x, this.y - v.y);
  }
  
  angleFrom(v) {
    return Math.atan2(v.x*this.y - v.y*this.x, v.x*this.x + v.y*this.y);
  }
}


function toggleAutoStartPoints() {
  if (document.getElementById("autoStartPoints").checked) {
    document.getElementById("startPoints").disabled = true;
    document.getElementById("numStartPoints").disabled = false;
  } else {
    document.getElementById("startPoints").disabled = false;
    document.getElementById("numStartPoints").disabled = true;
  }
}


function toggleAutoSteps() {
  if (document.getElementById("autoSteps").checked) {
    document.getElementById("ds").value = 0.1;
    document.getElementById("ds").disabled = true;
    document.getElementById("maxSteps").value = 100000;
    document.getElementById("maxSteps").disabled = true;
  } else {
    document.getElementById("ds").disabled = false;
    document.getElementById("maxSteps").disabled = false;
  }
}


function parseWires(numWires) {
	const wires = [];
  for (let i = 1; i <= numWires; i++)
    wires.push({
      x: Number(document.getElementById("wire"+i+"x").value),
      y: Number(document.getElementById("wire"+i+"y").value),
      I: Number(document.getElementById("wire"+i+"I").value)
    });
  return wires;
}


function parseVectors(text) {
	const vectors = [];
	for (let point of text.split(" ")) {
    point = point.split(",");
    vectors.push(new Vector(Number(point[0]), Number(point[1])));
	}
  return vectors;
}


function generateStartPoints() {
  // 'l' values represent the position along the l-axis connecting two wires
  const
    L = 700, // maximum distance from midpoint at which start points are chosen
    R = 10, // minimum distance from wires at which start points are chosen
    wires = parseWires(2),
    midPoint = Vector.from(wires[0]).add(wires[1]).div(2),
    N = document.getElementById("numStartPoints").value,
    ds = document.getElementById("ds").value;
  wires[0].l = -Vector.from(wires[0]).distanceFrom(midPoint);
  wires[1].l =  Vector.from(wires[1]).distanceFrom(midPoint);
  
  // Integrate the flux and find the proportionality factor C
  const
    B = l => wires[0].I/(l - wires[0].l) + wires[1].I/(l - wires[1].l),
    a = (wires[1].x - wires[0].x)/(wires[1].l - wires[0].l),
    b = (wires[0].x*wires[1].l - wires[1].x*wires[0].l)/(wires[1].l - wires[0].l),
    c = (wires[1].y - wires[0].y)/(wires[1].l - wires[0].l),
    d = (wires[0].y*wires[1].l - wires[1].y*wires[0].l)/(wires[1].l - wires[0].l),
    toVector = l => new Vector(a*l + b, c*l + d),
    dirTest = Math.sign(wires[0].I) > Math.sign(wires[1].I) ? l => B(l) > 0 : l => B(l) < 0,
    grid = new Array(Math.round(2*L/ds));
  let
    flux = 0,
    l;
  for (let i = 0; i < grid.length; i++) {
    l = -L + (i+0.5)*ds;
    if (dirTest(l) && Math.abs(l - wires[0].l) > R && Math.abs(l - wires[1].l) > R) {
      grid[i] = l;
      flux += Math.abs(B(l))*ds;
    }
  }
  const C = N/flux;
  
  // Integrate the flux using C and arrange field lines
  flux = 0;
  let n = 0;
  const startPoints = [];
  for (let l of grid) {
    if (l != undefined) {
      flux += C*Math.abs(B(l))*ds;
      if (flux > n) {
        startPoints.push(toVector(l));
        n += 1;
      }
    }
  }
  
  return startPoints;
}


const arrow = (r, d, a) => `<polygon points="${r.x},${r.y} ${r.x+a/2*(d.y-d.x)},${r.y-a/2*(d.x+d.y)} ${r.x+a/2*d.x},${r.y+a/2*d.y} ${r.x-a/2*(d.x+d.y)},${r.y+a/2*(d.x-d.y)}"/>`;


function draw() {
  let canvas = ``;

  // Read data from form
  const
    wires = parseWires(2),
    startPoints = document.getElementById("autoStartPoints").checked ?
    generateStartPoints() : parseVectors(document.getElementById("startPoints").value);
  
  // Draw wires
  const R = 10;
  for (let wire of wires) {
    canvas += `<circle cx="${wire.x}" cy="${wire.y}" r="${R}" stroke="black" fill="white"/>`;
    if (wire.I < 0) {
      canvas += `<circle cx="${wire.x}" cy="${wire.y}" r="2" fill="black"/>`;
    } else if (wire.I > 0) {
      canvas += `<line x1="${wire.x-R/Math.SQRT2}" y1="${wire.y-R/Math.SQRT2}" x2="${wire.x+R/Math.SQRT2}" y2="${wire.y+R/Math.SQRT2}" stroke="black"/>`;
      canvas += `<line x1="${wire.x-R/Math.SQRT2}" y1="${wire.y+R/Math.SQRT2}" x2="${wire.x+R/Math.SQRT2}" y2="${wire.y-R/Math.SQRT2}" stroke="black"/>`;
    }
  }
  
  // Draw field lines
  const
    a = 10, // arrowhead size
    point = new Vector(),
    r = new Vector(),
    B = new Vector(),
    d = new Vector(),
    d0 = new Vector(),
    step = new Vector(),
    ds = document.getElementById("ds").value,
    maxSteps = document.getElementById("maxSteps").value;
  let
    stopAngle,
    C,
    lines = ``,
    arrows = ``;
  for (let startPoint of startPoints) {
    point.set(startPoint);
    stopAngle = Math.PI;
    for (let i = 0; i < maxSteps; i++) {
      B.setZero();
      for (let wire of wires) {
        r.set(point).sub(wire);
        C = wire.I/r.norm**2;
        B.x += -r.y*C;
        B.y +=  r.x*C;
      }
      d.set(B).normalize();
      if (i == 0) {
        arrows += arrow(point, d, a);
        lines += `<polyline class="fieldLine" points="${point.x},${point.y}`;
        d0.set(d);
      }
      point.add(step.set(d).mul(ds));
      lines += ` ${point.x},${point.y}`;
      if (d.angleFrom(d0) < stopAngle+0.01 && d.angleFrom(d0) > stopAngle-0.01)
        if (stopAngle == 0 && point.distanceFrom(startPoint) < 5) {
          lines += ` ${startPoint.x},${startPoint.y}`;
          break;
        } else if (stopAngle == Math.PI) {
          arrows += arrow(point, d, a);
          stopAngle = 0;
        }
    }
    lines += `"/>`;
  }
  
  canvas += lines + arrows;
  document.getElementById("canvas").innerHTML = canvas;
}