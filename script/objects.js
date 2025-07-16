export class Modell {
  constructor(/*form, counter,*/ name, position, rows, color) {
    // self.id = `${form}-${counter}`;//kreis-1/ tube-1...
    this.name = name;
    this.position = position;//[x, y]
    this.color = color;
    this.rows = this.getRows(rows);
  }
  getRows(rows) {
    let result = rows.map((r, i) => {
      let desc = '';
      if (i === 0) {
        desc = 'in kreis';
      } else if (i === (rows.count - 1)) {
        desc = 'abnahme, schließen';
      } else if (r > rows[i-1]) {
        desc = 'zunahme';
      } else if (r < rows[i-1]) {
        desc = 'abnahme';
      } else if (r === rows[i-1]) {
        desc = 'km';
      } 
      return {count: r, desc};
    });
    return result;
    
  }
}

let rawModells = JSON.parse(localStorage.getItem('modells')) || []
export let modells = rawModells.map(m => new Modell(m.name, m.position, m.rows.map(r => r.count), m.color));