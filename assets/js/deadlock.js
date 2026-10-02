(() => {
  const $=s=>document.querySelector(s); let last=null;
  $("#demo").onclick=()=>{$("#avail").value="3 3 2";$("#max").value="7 5 3; 3 2 2; 9 0 2; 2 2 2; 4 3 3";$("#alloc").value="0 1 0; 2 0 0; 3 0 2; 2 1 1; 0 0 2";run();};
  $("#clearBtn").onclick=()=>{$("#avail").value="";$("#max").value="";$("#alloc").value="";$("#need").innerHTML='<tr><td colspan="4" class="empty-cell">No analysis yet.</td></tr>';$("#result").textContent="Run the analyzer to calculate Need and the safe sequence.";$("#statePill").textContent="Waiting";};
  function nums(s){return s.trim().split(/[,\s]+/).filter(Boolean).map(Number)}
  function matrix(s){return s.split(";").map(r=>nums(r)).filter(r=>r.length)}
  function run(){try{
    const av=nums($("#avail").value),mx=matrix($("#max").value),al=matrix($("#alloc").value);
    if(av.length!==3||!mx.length||mx.length!==al.length)throw new Error("Use 3 resources and matching matrix row counts.");
    if(mx.some(r=>r.length!==3)||al.some(r=>r.length!==3))throw new Error("Every matrix row must contain exactly 3 values.");
    if(mx.some((r,i)=>r.some((v,j)=>v<0||al[i][j]<0||al[i][j]>v)))throw new Error("Allocation cannot exceed Maximum.");
    const need=mx.map((r,i)=>r.map((v,j)=>v-al[i][j])),work=[...av],finish=Array(mx.length).fill(false),safe=[];
    while(safe.length<mx.length){let found=false;for(let i=0;i<mx.length;i++){if(!finish[i]&&need[i].every((v,j)=>v<=work[j])){work.splice(0,3,...work.map((v,j)=>v+al[i][j]));finish[i]=true;safe.push(i);found=true;}}if(!found)break;}
    last={available:av,max:mx,allocation:al,need,safe:safe.map(i=>`P${i}`),safeState:safe.length===mx.length};
    $("#need").innerHTML=need.map((r,i)=>`<tr><td><b>P${i}</b></td>${r.map(x=>`<td>${x}</td>`).join("")}</tr>`).join("");
    const safeState=safe.length===mx.length;
    $("#statePill").textContent=safeState?"SAFE STATE":"UNSAFE STATE";$("#statePill").className="result-pill "+(safeState?"safe-pill":"danger-pill");
    $("#result").innerHTML=safeState
      ? `<div class="result-success"><span class="result-icon">✓</span><div><h3>System is in a SAFE state</h3><p>A complete execution order was found without exceeding available resources.</p></div></div><div class="safe-sequence"><span>SAFE SEQUENCE</span><div>${safe.map(i=>`<b>P${i}</b>`).join("<i>→</i>")}</div></div>`
      : `<div class="result-danger"><span class="result-icon">!</span><div><h3>System is UNSAFE</h3><p>The available resources could not satisfy all remaining processes, so no complete safe sequence was found.</p></div></div>`;
  }catch(e){alert(e.message)}}
  $("#run").onclick=run;
  $("#exportDeadlock").onclick=()=>{if(!last){alert("Run analysis first.");return;}const blob=new Blob([JSON.stringify(last,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="bankers-analysis.json";a.click();URL.revokeObjectURL(a.href);};
  run();
})();