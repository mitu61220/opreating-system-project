(() => {
  let algo="FIFO", last=null; const $=s=>document.querySelector(s);
  document.querySelectorAll("#memTabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll("#memTabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");algo=b.dataset.algo;run();});
  $("#demoBtn").onclick=()=>{$("#refs").value="7 0 1 2 0 3 0 4 2 3 0 3 2";$("#frames").value=3;run();};
  $("#clearBtn").onclick=()=>{$("#refs").value="";$("#memoryOut").className="empty-state";$("#memoryOut").textContent="Enter a reference string and run the simulation.";["#faults","#hits","#rate","#hitrate"].forEach(x=>$(x).textContent="—");};
  function simulate(){
    const ref=$("#refs").value.trim().split(/[,\s]+/).filter(Boolean); const n=Number($("#frames").value);
    if(!ref.length)throw new Error("Add at least one page reference."); if(!Number.isInteger(n)||n<1||n>12)throw new Error("Frames must be between 1 and 12.");
    let frames=[], rows=[], faults=0, fifo=[];
    ref.forEach((page,i)=>{
      const hit=frames.includes(page); let victim=null;
      if(!hit){faults++;
        if(frames.length<n){frames.push(page);fifo.push(page);}
        else if(algo==="FIFO"){victim=fifo.shift();frames[frames.indexOf(victim)]=page;fifo.push(page);}
        else if(algo==="LRU"){
          const scores=frames.map(x=>ref.slice(0,i).lastIndexOf(x)); victim=frames[scores.indexOf(Math.min(...scores))]; frames[frames.indexOf(victim)]=page;
        } else {
          const next=frames.map(x=>{const z=ref.slice(i+1).indexOf(x);return z===-1?Infinity:z;}); victim=frames[next.indexOf(Math.max(...next))]; frames[frames.indexOf(victim)]=page;
        }
      }
      rows.push({page,hit,frames:[...frames],victim});
    }); return {ref,n,rows,faults,hits:ref.length-faults};
  }
  function run(){try{last=simulate();const r=last;
    $("#memoryOut").className="memory-table-wrap";
    $("#memoryOut").innerHTML=`<div class="table-wrap"><table class="data-table memory-table"><thead><tr><th>Step</th><th>Reference</th>${Array.from({length:r.n},(_,i)=>`<th>Frame ${i+1}</th>`).join("")}<th>Status</th></tr></thead><tbody>${r.rows.map((x,i)=>`<tr><td>${i+1}</td><td><b>${x.page}</b></td>${x.frames.map(v=>`<td>${v??"—"}</td>`).join("")}${Array.from({length:r.n-x.frames.length},()=>"<td>—</td>").join("")}<td><span class="status-tag ${x.hit?"hit":"fault"}">${x.hit?"HIT":"FAULT"}</span></td></tr>`).join("")}</tbody></table></div>`;
    $("#faults").textContent=r.faults;$("#hits").textContent=r.hits;$("#rate").textContent=(r.faults/r.ref.length*100).toFixed(1)+"%";$("#hitrate").textContent=(r.hits/r.ref.length*100).toFixed(1)+"%";$("#summary").textContent=`${algo} • ${r.n} frames • ${r.ref.length} refs`;
  }catch(e){alert(e.message)}}
  $("#run").onclick=run;run();
})();