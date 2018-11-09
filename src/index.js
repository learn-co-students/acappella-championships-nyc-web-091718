document.addEventListener('DOMContentLoaded', ()=>{

  const tBody = document.getElementById('table-body');
  const winnerH2 = document.getElementById('winner');
  let groupsArray = [];

  // on load fetch
  fetch('http://localhost:3000/a_cappella_groups')
  .then(resp => resp.json())
  .then(groupsJSON =>{
    groupsArray = groupsJSON;
    tBody.innerHTML = renderAllGroups(groupsArray);
  })

  // event listeners
  tBody.addEventListener('click', tBodyEventHandler)


  // helper functions
  function renderAllGroups(array) {
    return array.map(group => renderSingleGroup(group)).join('');
  }

  function renderSingleGroup(group) {
    return `
      <tr><td>${group.college.name}</td> <td>${group.name}</td> <td>${group.membership}</td> <td>${group.college.division}</td> <td><img src='./assets/trophy.png' data-id='${group.id}'/></td><td><button id="delete">Delete</button></td> </tr>
    `
  }

  function tBodyEventHandler(event) {
    if (event.target.dataset.id != undefined) {
      const gId = event.target.dataset.id;
      const gIndex = groupsArray.findIndex(g => g.id == gId);
      let targetGroup = groupsArray[gIndex];
      let targetRow = event.target.parentElement.parentElement;
      if (winnerH2.dataset.gId == undefined) {
        winnerH2.dataset.gId = targetGroup.id;
      } else if (winnerH2.dataset.gId != undefined) {
        winnerH2.dataset.gId = targetGroup.id;
        let filteredArray = groupsArray.filter(g => g.id != winner.dataset.gId)
        tBody.innerHTML = renderAllGroups(filteredArray)
      }
      targetRow.remove();
      winnerH2.innerText = updateWinner(targetGroup);
    } // end checking for dataset.id if stmt

    if (event.target.id === 'delete') {
      console.log(groupsArray)

      const targetRow = event.target.parentElement.parentElement;
      const gId = targetRow.querySelector('img').dataset.id;
      const gIndex = groupsArray.findIndex(g => g.id == gId);
      let targetGroup = groupsArray[gIndex];
      fetch(`http://localhost:3000/a_cappella_groups/${targetGroup.id}`, {
        method: 'DELETE'
      })
        .then(resp => {
          if (resp.ok) {
            targetRow.remove();
            groupsArray = groupsArray.filter(g => g.id != gId)
          }
        })
    }

  } // end tBodyEventHandler helper fn

  function updateWinner(group) {
    return `Winner: ${group.college.name} - ${group.name}`
  }

}) // end DOMContentLoaded event listener
