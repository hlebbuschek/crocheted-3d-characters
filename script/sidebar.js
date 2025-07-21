import { createModells } from "./creating.js";
import { modells, Modell } from "./objects.js";

updateSidebar();

// delete
function setDeleteListeners() {
  document.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('delete btn wurde gedrückt');
      const idStr = btn.id; // z.B. "desc-1"
      console.log(`idSTR: ${idStr}`);
      const index = parseInt(idStr.split('-')[1]); // -> 1
      console.log(`id: ${index}`);

      if (!isNaN(index) && index >= 0 && index < modells.length) {
        console.log(modells[index].name);
        modells.splice(index, 1); // Modell aus Array löschen
        localStorage.setItem('modells', JSON.stringify(modells)); // speichern
        updateSidebar();
        createModells(); // 3D-Objekte neu erzeugen
      }
    });
  });
}
  
// changing
// function setChangeListeners() {
//   document.querySelectorAll('.change')
//   .forEach(btn => {
//     let html = '';
//     btn.addEventListener('click', () => {
//       document.querySelectorAll('.obj-desc')
//         .forEach(obj => {
//           if (obj.id === btn.id) {
//             html = `
//               <a class="label">label-obj</a>    
//               <div class="box" id="1">
//                 <div class="row" id="row-0">
//                   <ul>
//                     <li>
//                       <span>name:</span>
//                       <input class="inp-txt" id="1" type="text" value="label-obj">
//                     </li>
//                     <li>
//                       <span class="row-index">0.</span>
//                       <span class="mesh-num">
//                         <input class="inp-nmb" id="1" type="number" value="6">
//                       </span>
//                       <span class="desc">in kreis</span>
//                     </li>
//                     <li>
//                       <span>position</span>
//                       <input class="inp-nmb" type="number" id="3-x" placeholder="x">
//                       <input class="inp-nmb" type="number" id="3-y" placeholder="y">
//                       <input class="inp-nmb" type="number" id="3-z" placeholder="z">
//                     </li>
//                   </ul>
//                 </div>
//                 <button class="save emodji-btn" id="1" title="speichern">✅</button>
//               </div>`;
//             obj.innerHTML = html;
//           }
//         });
//     });
//   });
// }
// saving 
// document.querySelectorAll('.save')
//   .forEach(btn => {
//     btn.addEventListener('click', () => {
//       // save changing
//     createModells();
//     });
//   });

//creating
document.querySelectorAll('.create')
  .forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.id.toString().slice(0, 1));
      const name = document.getElementById(`${id}-name`).value;
      const color = document.getElementById(`${id}-color`).value;
      const x = parseInt(document.getElementById(`${id}-x`).value || 0);
      const y = parseInt(document.getElementById(`${id}-y`).value || 0);
      const z = parseInt(document.getElementById(`${id}-z`).value || 0);
      const position = {x, y, z};
      const initialStitches = parseInt(document.getElementById(`${id}-initialStitches`).value);
      const stitchCountMax = parseInt(document.getElementById(`${id}-stitchCountMax`).value);
      let rows = [];
      if ((isNaN(initialStitches) || isNaN(stitchCountMax)) || (initialStitches <= 0 || stitchCountMax <= 0)) {
        alert("Bitte gültige Zahlen für Maschen eingeben.");
        return;
      }
      // breite erreichen
      for (let i = initialStitches; i <= stitchCountMax; i += initialStitches) {
        rows.push(i);
      }
      // lange erreichen: kugel - lange === initialStitches; tube - lange defined
      const counter = stitchCountMax / initialStitches + 2;
      // console.log(counter)
      switch (id) {
        case 1:
          for (let i = 0; i < counter; i++) {
            rows.push(stitchCountMax);
            // console.log(i);
          }
          break;
        case 2:
          const rowsCount = parseInt(document.getElementById(`${id}-rowsCount`).value);
          for (let i = 0; i < rowsCount; i++) {
            rows.push(stitchCountMax);
          }
          break;
      }
      // schließen
      for (let i = stitchCountMax; i >= initialStitches; i -= initialStitches) {
        if (i === stitchCountMax) {
          continue;
        }
        rows.push(i);
      }

      const obj = new Modell(name, position, rows, color);
      modells.push(obj);
      localStorage.setItem('modells', JSON.stringify(modells));
      
      addModellDescription(obj, modells.indexOf(obj));
      createModells();
    });
  });


function addModellDescription(obj, index_obj) {
  let html = ``;
  obj.rows.forEach((row, index_r) => {
    html += `
      <div class="row" id="row-${index_r}">
        <ul>
          <li>
            <span class="row-index">${index_r}.</span>
            <span class="mesh-num">${row.count},</span>
            <span class="desc">${row.desc}</span>
          </li>
        </ul>
      </div>
    `;
  });
  

  const element = document.querySelector('.sec-objs-descriptions');
  element.innerHTML += `
    <div class="description" id="desc-${index_obj}">
      <a class="label">${obj.name}</a>
      <button class="change emodji-btn" id="desc-${index_obj}" title="ändern">🔁</button>
      <button class="delete emodji-btn" id="desc-${index_obj}" title="löschen">❌</button>
      <span class="pos">${obj.position.x}, ${obj.position.y}, ${obj.position.z}</span>
      <div class="box" id="${index_obj}">
        ${html}
      </div>
    </div>
  `;
}

function updateSidebar() {
  const container = document.querySelector('.sec-objs-descriptions');
  container.innerHTML = '';
  modells.forEach((obj, index) => {
    addModellDescription(obj, index);
  });
  setDeleteListeners();
  createModells();
  // setChangeListeners();
}


document.querySelector('.save-as-txt')
  .addEventListener('click', () => {
    exportTextFromList();
    // saveCanvasAsImage();
  });

function exportTextFromList() {
  const allDescriptions = document.querySelectorAll('.description'); // alle Objekte
  let output = '';

  allDescriptions.forEach((desc, i) => {
    const label = desc.querySelector('.label')?.innerText || `Objekt ${i}`;
    output += `🧵 ${label}\n`;

    const rows = desc.querySelectorAll('.row');
    rows.forEach(row => {
      const spans = row.querySelectorAll('span');
      const line = Array.from(spans).map(s => s.innerText.trim()).join(' ');
      output += `  ${line}\n`;
    });

    output += '\n';
  });

  // Datei erzeugen und herunterladen
  const blob = new Blob([output], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'modell.txt';
  link.click();
}

// function saveCanvasAsImage(format = 'png') {
//   const canvas = document.querySelector('canvas');
//   const dataURL = canvas.toDataURL(`image/${format}`);
  
//   const link = document.createElement('a');
//   link.href = dataURL;
//   link.download = `3d-modell.${format}`;
//   link.click();
// }
