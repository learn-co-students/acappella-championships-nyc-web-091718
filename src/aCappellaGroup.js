let acappellaGroups = [];
let alphaSort = 1;

document.addEventListener('DOMContentLoaded', () => {
  let acGroupTableforRendering = document.getElementById('table-body')
  let sortTable = document.getElementById('sort')
  // const winnerHeader = document.getElementById('winner')

  fetch('http://localhost:3000/a_cappella_groups')
  .then(response => response.json())
  .then(acappellaGJSON => {
    acappellaGroups = acappellaGJSON
    acGroupTableforRendering.innerHTML = renderGroups(acappellaGroups)
  })

  acGroupTableforRendering.addEventListener('click', winner)
  acGroupTableforRendering.addEventListener('click', deleteGroup)
  sortTable.addEventListener('click', sort)

}) // end of DOM content loaded

function sort(e){
  let acGroupTableforRendering = document.getElementById('table-body')
  if (e.target.innerText.includes(["College"])) {
    acappellaGroups = acappellaGroups.sort((group1, group2) => group1.college.name.localeCompare(group2.college.name)*alphaSort)
    alphaSort *= -1
    acGroupTableforRendering.innerHTML = ''
    acGroupTableforRendering.innerHTML = renderGroups(acappellaGroups)
  } else if ((e.target.innerText.includes(["Group Name"]))) {
    acappellaGroups = acappellaGroups.sort((group1, group2) => group1.name.localeCompare(group2.name)*alphaSort)
    alphaSort *= -1
    acGroupTableforRendering.innerHTML = ''
    acGroupTableforRendering.innerHTML = renderGroups(acappellaGroups)
  } else if ((e.target.innerText.includes(["Membership"]))) {
    acappellaGroups = acappellaGroups.sort((group1, group2) => group1.membership.localeCompare(group2.membership)*alphaSort)
    alphaSort *= -1
    acGroupTableforRendering.innerHTML = ''
    acGroupTableforRendering.innerHTML = renderGroups(acappellaGroups)
  } else if ((e.target.innerText.includes(["Division"]))) {
    acappellaGroups = acappellaGroups.sort((group1, group2) => group1.college.division.localeCompare(group2.college.division)*alphaSort)
    alphaSort *= -1
    acGroupTableforRendering.innerHTML = ''
    acGroupTableforRendering.innerHTML = renderGroups(acappellaGroups)
  }
}

function renderGroups(groups) {
  return groups.map((group) => {
    return `
    <tr data-action="toggle">
      <td>${group.college.name}</td>
      <td>${group.name}</td>
      <td>${group.membership}</td>
      <td>${group.college.division}</td>
      <td><img src='./assets/trophy.png' data-id='${group.id}'/></td>
      <td><button data-action="${group.id}">Delete</td>
    </tr>`
  }).join('')
}

function renderWinnerHeader(winner){
  const winnerHeader = document.getElementById('winner')
  winnerHeader.innerText = `Winner: ${winner.college.name} ${winner.name}`
}

function deleteGroup(e){
  let acGroupTableforRendering = document.getElementById('table-body')
  if (e.target.dataset.action) {
    let targetGroupToDelete = acappellaGroups.find(group => group.id == e.target.dataset.action)
    let idx = acappellaGroups.indexOf(targetGroupToDelete)
    if (idx != -1) {
      acappellaGroups.splice(idx, 1)
      acGroupTableforRendering.innerHTML = renderGroups(acappellaGroups)
      let id = targetGroupToDelete.id

      fetch(`http://localhost:3000/a_cappella_groups/${id}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: idx})
      })
    } // if conditional
  } // if conditional
} // end of function

function winner(e) {
  let acGroupTableforRendering = document.getElementById('table-body')
  if (e.target.dataset.id) {
    let winnerGroup = acappellaGroups.find(group => group.id == e.target.dataset.id)
    renderWinnerHeader(winnerGroup)
    let newGroups = acappellaGroups.filter(group => group.id != e.target.dataset.id)
    acGroupTableforRendering.innerHTML = renderGroups(newGroups)
  }
}
