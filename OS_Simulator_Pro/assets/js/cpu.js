(() => {
  let algo = "FCFS";
  let lastResult = null;
  const $ = s => document.querySelector(s);
  const tabs = document.querySelectorAll("#cpuTabs button");
  const demo = `P1,0,7,2\nP2,1,4,1\nP3,2,5,3\nP4,3,2,2`;
  tabs.forEach(btn => btn.addEventListener("click", () => {
    tabs.forEach(x => x.classList.remove("active")); btn.classList.add("active");
    algo = btn.dataset.algo; $("#algoLabel").textContent = algo;
    $("#quantBox").hidden = algo !== "RR";
  }));
  $("#demoBtn").onclick = () => { $("#procInput").value = demo; run(); };
  $("#clearBtn").onclick = () => {
    $("#procInput").value = ""; $("#gantt").className = "gantt empty-state"; $("#gantt").textContent = "Enter process data and run the simulation.";
    $("#cpuTable").innerHTML = '<tr><td colspan="7" class="empty-cell">No results yet.</td></tr>';
    ["#avgWait","#avgTat","#util","#total"].forEach(x => $(x).textContent = "—");
  };
  function parse() {
    const lines = $("#procInput").value.trim().split(/\n+/).filter(Boolean);
    const ps = lines.map((line,i) => {
      const a = line.split(",").map(v => v.trim());
      if (a.length < 3) throw new Error(`Line ${i+1}: use PID, Arrival, Burst, Priority`);
      const at = Number(a[1]), bt = Number(a[2]), pr = Number(a[3] ?? 0);
      if (![at,bt,pr].every(Number.isFinite) || at < 0 || bt <= 0) throw new Error(`Line ${i+1}: invalid numeric values`);
      return {id:a[0] || `P${i+1}`, at, bt, pr, rem:bt};
    });
    if (!ps.length) throw new Error("Add at least one process.");
    return ps;
  }
  function schedule(input) {
    const ps = input.map(p => ({...p}));
    let t = 0, gantt = [];
    if (algo === "FCFS") {
      ps.sort((a,b) => a.at-b.at || a.id.localeCompare(b.id));
      ps.forEach(p => { if(t<p.at)t=p.at; const s=t;t+=p.bt;gantt.push({id:p.id,s,e:t});p.ct=t;p.tat=t-p.at;p.wt=p.tat-p.bt; });
    } else if (algo === "RR") {
      const all=[...ps].sort((a,b)=>a.at-b.at), ready=[]; let i=0;
      const q=Math.max(1,Number($("#quantum").value)||1);
      while (ready.length || i<all.length) {
        if(!ready.length && t<all[i].at)t=all[i].at;
        while(i<all.length && all[i].at<=t)ready.push(all[i++]);
        const p=ready.shift(); const run=Math.min(q,p.rem); const s=t;t+=run;p.rem-=run;gantt.push({id:p.id,s,e:t});
        while(i<all.length && all[i].at<=t)ready.push(all[i++]);
        if(p.rem>0) ready.push(p); else {p.ct=t;p.tat=t-p.at;p.wt=p.tat-p.bt;}
      }
    } else {
      const remain=[...ps];
      while(remain.length){
        const available=remain.filter(p=>p.at<=t);
        if(!available.length){t=Math.min(...remain.map(p=>p.at));continue;}
        const p=(algo==="SJF"
          ? available.sort((a,b)=>a.bt-b.bt||a.at-b.at)
          : available.sort((a,b)=>a.pr-b.pr||a.at-b.at))[0];
        remain.splice(remain.indexOf(p),1); if(t<p.at)t=p.at; const s=t;t+=p.bt;gantt.push({id:p.id,s,e:t});p.ct=t;p.tat=t-p.at;p.wt=p.tat-p.bt;
      }
    }
    return {ps,gantt,total:t};
  }
  function run(){
    try{
      const r=schedule(parse()); lastResult=r;
      const colors={}; r.ps.forEach((p,i)=>colors[p.id]=i%6);
      $("#gantt").className="gantt";
      $("#gantt").innerHTML=r.gantt.map(x=>`<div class="gantt-item tone-${colors[x.id]}" style="flex:${Math.max(.5,x.e-x.s)}"><b>${x.id}</b><small>${x.s} → ${x.e}</small></div>`).join("");
      $("#timelineScale").innerHTML=`<span>0</span><span>Total = ${r.total}</span>`;
      $("#cpuTable").innerHTML=[...r.ps].sort((a,b)=>a.id.localeCompare(b.id)).map(p=>`<tr><td><b>${p.id}</b></td><td>${p.at}</td><td>${p.bt}</td><td>${p.pr}</td><td>${p.ct}</td><td>${p.wt}</td><td>${p.tat}</td></tr>`).join("");
      const work=r.ps.reduce((s,p)=>s+p.bt,0), aw=r.ps.reduce((s,p)=>s+p.wt,0)/r.ps.length, at=r.ps.reduce((s,p)=>s+p.tat,0)/r.ps.length;
      $("#avgWait").textContent=aw.toFixed(2);$("#avgTat").textContent=at.toFixed(2);$("#total").textContent=r.total;$("#util").textContent=(work/r.total*100).toFixed(1)+"%";
    }catch(e){ alert(e.message); }
  }
  $("#runCpu").onclick=run;
  $("#exportCpu").onclick=()=>{ if(!lastResult){alert("Run a simulation first.");return;} const blob=new Blob([JSON.stringify({algorithm:algo,...lastResult},null,2)],{type:"application/json"}); const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`cpu-${algo.toLowerCase()}-result.json`;a.click();URL.revokeObjectURL(a.href); };
  run();
})();