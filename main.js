(()=>{"use strict";const t={apiKey:"AIzaSyAyPj-i9tN6KR43kMyclNaYY0BgCCZ5gQk",authDomain:"votenow-1d7fb.firebaseapp.com",databaseURL:"https://votenow-1d7fb-default-rtdb.firebaseio.com",projectId:"votenow-1d7fb",storageBucket:"votenow-1d7fb.appspot.com",messagingSenderId:"28139119211",appId:"1:28139119211:web:132c637874e4ad1fcb072e",measurementId:"G-6D6R3J0TJ7"};class e{constructor(){this.timestamp=Date.now(),this.groupId=this.timestamp,firebase.initializeApp(t),this.db=firebase.database(),this.affirmitiveVotes=[]}createGroup(){return this.db.ref("votegroup/"+this.groupId).set({timestamp:this.timestamp,status:"active"}),this.groupId}closeVote(){this.db.ref("votegroup/"+this.groupId).update({status:"closed"})}addOption(t){const e=Date.now();this.db.ref("votegroup/"+this.groupId+"/options/"+e).set({option:t,id:e,votes:0})}checkOption(t){this.affirmitiveVotes.push(t);const e=`votegroup/${this.groupId}/options/${t}`;this.db.ref(e).once("value",(t=>{const o=t.val();this.db.ref(e).update({votes:o.votes+=1})}))}uncheckOption(t){const e=`votegroup/${this.groupId}/options/${t}`;this.db.ref(e).once("value",(t=>{const o=t.val();this.db.ref(e).update({votes:o.votes-=1})}))}getGroup(t,e){this.groupId=t,this.db.ref(`votegroup/${t}`).once("value",(o=>{o&&this.db.ref(`votegroup/${t}/options`).on("child_added",e)}))}getVotes(){return this.affirmitiveVotes}subscribeToStatusChanges(t){this.db.ref(`votegroup/${this.groupId}`).on("value",(e=>{const o=e.val();o&&o.status&&"closed"==o.status&&t(o)}))}}window.voteNow=new class{constructor(){this.votingService=new e,this.createGroupButton=document.getElementById("create-group-button"),this.addOptionForm=document.getElementById("add-option"),this.closeGroupButton=document.getElementById("close-group-button"),this.optionsContainer=document.getElementById("options"),this.init()}init(){this.bindButtons(),this.onWindowLoad()}bindButtons(){this.createGroupButton.addEventListener("click",(t=>{const e=this.votingService.createGroup();window.location=`${window.location}?groupId=${e}`})),this.addOptionForm.onsubmit=t=>{t.preventDefault();const e=document.getElementById("option");this.votingService.addOption(e.value),e.value=""},this.closeGroupButton.addEventListener("click",(t=>{this.votingService.closeVote()}))}onWindowLoad(){window.addEventListener("load",(t=>{let e=new URLSearchParams(window.location.search).get("groupId");e&&(this.addOptionForm.classList.remove("hidden"),this.closeGroupButton.classList.remove("hidden"),this.createGroupButton.classList.add("hidden"),this.votingService.getGroup(e,(t=>{const e=t.val(),o=this.buildOption(e);this.optionsContainer.appendChild(o)})),this.votingService.subscribeToStatusChanges((t=>{this.onVoteClose(t)})))}))}buildOption(t){const e=this.votingService.getVotes(),o=document.createElement("input");o.type="checkbox",o.checked=e.includes(t.id),o.id=t.id,o.onchange=t=>{this.handleVote(t)};const i=document.createElement("label");return i.appendChild(o),i.append(t.option),i}handleVote(t){const e=t.target.checked,o=t.target.id;e?this.votingService.checkOption(o):this.votingService.uncheckOption(o)}onVoteClose(t){this.optionsContainer.classList.add("hidden"),this.createGroupButton.classList.add("hidden"),this.addOptionForm.classList.add("hidden"),this.closeGroupButton.classList.add("hidden");const e=Object.values(t.options).reduce(((t,e)=>t.votes>e.votes?t:e));document.getElementById("result").append(`The winner is ${e.option}`)}}})();