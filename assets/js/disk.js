(() => {
  let alg="FCFS"; const $=s=>document.querySelector(s);
  document.querySelectorAll("#diskTabs button").forEach(b=>b.onclick=()=>{document.querySelectorAll("#diskTabs button").forEach(x=>x.classList.remove("active"));b.classList.add("active");alg=b.dataset.algo;run();});
  $("#demoBtn").onclick=()=>{$("#req").value="98 183 37 122 14 124 65 67";$("#head").value=53;$("#size").value=200;$("#dir").value="right";run();};
  $("#clearBtn").onclick=()=>{$("#req").value="";$("#chips").innerHTML='<div class="empty-state">Enter requests and run the simulation.</div>';["#move","#count","#avg","#alg","#seq"].forEach(x=>$(x).textContent="—");$("#headMarker").hidden=true;};
  function parse(){const a=$("#req").value.trim().split(/[,\s]+/).filter(Boolean).map(Number),head=Number($("#head").value),size=Number($("#size").value);if(!a.length)throw new Error("Add at least one disk request.");if(!Number.isInteger(head)||!Number.isInteger(size)||head<0||head>=size||size<2)throw new Error("Use a valid head and disk size.");if(a.some(x=>!Number.isInteger(x)||x<0||x>=size))throw new Error("Every request must be inside the disk range.");return{a,head,size,dir:$("#dir").value};}
  function sequence({a,head,size,dir}){
    if(alg==="FCFS")return [...a];
    if(alg==="SSTF"){const rem=[...a],out=[];let cur=head;while(rem.length){rem.sort((x,y)=>Math.abs(x-cur)-Math.abs(y-cur)||x-y);const x=rem.shift();out.push(x);cur=x;}return out;}
    const left=a.filter(x=>x<head).sort((x,y)=>y-x),right=a.filter(x=>x>=head).sort((x,y)=>x-y);
    if(dir==="right") return alg==="CSCAN" ? [...right,size-1,0,...left] : [...right,size-1,...left];
    return alg==="CSCAN" ? [...left,0,size-1,...right] : [...left,0,...right];
  }
  function run(){try{const d=parse(),seq=sequence(d);let cur=d.head,m=0;seq.forEach(x=>{m+=Math.abs(x-cur);cur=x;});
    $("#chips").innerHTML=[d.head,...seq].map((x,i)=>`<span class="chip ${i===0?"start":""}">${i?"→ ":""}${x}</span>`).join("");
    $("#move").textContent=m+" cyl";$("#count").textContent=d.a.length;$("#avg").textContent=(m/d.a.length).toFixed(2);$("#alg").textContent=alg;$("#seq").textContent=`${seq.length} stops • ${d.dir}`;
    $("#maxLabel").textContent=d.size-1; const marker=$("#headMarker");marker.hidden=false;marker.style.left=`calc(${(d.head/(d.size-1))*100}% - 2px)`;
  }catch(e){alert(e.message)}}
  $("#run").onclick=run;run();
})();