let allGroups = []
let winnerContainer
let tableBody

document.addEventListener("DOMContentLoaded", function() {
  tableBody = document.getElementById('table-body')
  winnerContainer = document.getElementById('winner')

  fetch('http://localhost:3000/a_cappella_groups')
    .then(response => response.json())
    .then(groupsJson => {
      tableBody.innerHTML = renderAllGroups(groupsJson)
      allGroups = groupsJson
    })

    tableBody.addEventListener("click", function (event) {
      if (event.target.dataset.id !== undefined) {
        let formerWinner = checkForCurrentWinner()
        let foundGroup = findGroup(event.target.dataset.id)
        winnerContainer.innerHTML = `
          <div data-winnerId="${foundGroup.id}">
            Winner: ${foundGroup.college.name} - ${foundGroup.name}
          </div>`
        removeFromTable(foundGroup)
        reAddFormerWinner(formerWinner)
      }

      if (event.target.dataset.deleteid !== undefined) {
        let groupToDelete = findGroup(event.target.dataset.deleteid)
        let foundRowDelete = document.querySelector(`.group-row[data-rowId="${groupToDelete.id}"]`)
        fetch(`http://localhost:3000/a_cappella_groups/${groupToDelete.id}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (response.ok) {
            allGroups = allGroups.filter(group => group.id != groupToDelete.id)
            tableBody.removeChild(foundRowDelete)
          }
        })
      }
    })

}) // End of DOMContentLoaded

function renderAllGroups(groups) {
  return groups.map((group) => {
    return `
    <tr class="group-row" data-rowId=${group.id}>
      <td>${group.college.name}</td>
       <td>${group.name}</td>
       <td>${group.membership}</td>
       <td>${group.college.division}</td>
       <td>
        <img src='./assets/trophy.png' data-id='${group.id}'/>
        <button type="button" name="delete" data-deleteId="${group.id}">Delete</button>
        </td>
     </tr>`
 }).join("")
}

function findGroup(id) {
  return allGroups.find((group) => group.id == id)
}

function removeFromTable(group) {
  let foundRow = document.querySelector(`.group-row[data-rowId="${group.id}"]`)
  foundRow.remove()
}

function checkForCurrentWinner() {
  if (!!winnerContainer.querySelector('[data-winnerId]')) {
    let winnerId = parseInt(winnerContainer.querySelector('[data-winnerid]').dataset.winnerid)
    return allGroups.find((group) => group.id == winnerId)
  }
}

function reAddFormerWinner(formerWinner){
  tableBody.innerHTML += `
    <tr class="group-row" data-rowId=${formerWinner.id}>
      <td>${formerWinner.college.name}</td>
       <td>${formerWinner.name}</td>
       <td>${formerWinner.membership}</td>
       <td>${formerWinner.college.division}</td>
       <td>
        <img src='./assets/trophy.png' data-id='${formerWinner.id}'/>
        <button type="button" name="delete" data-deleteId="${formerWinner.id}">Delete</button>
        </td>
     </tr>
    `
}
