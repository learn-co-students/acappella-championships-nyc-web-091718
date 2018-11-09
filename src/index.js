  // TRIPLE BONUS: Can you make clicking on a table headers sort by that column attribute?

  document.addEventListener("DOMContentLoaded", () => {
    // find table
    const groupTable = document.querySelector('#table-body')
    // find winner box
    const winnerBox = document.querySelector('#winner').parentElement

    let allGroups

    // fetch all on page
    fetch(`http://localhost:3000/a_cappella_groups`)
      .then(resp => resp.json())
      .then(groupData => {
        allGroups = groupData
        allGroups.forEach(group => {
          groupTable.innerHTML += `
          <tr data-id='${group.id}'>
            <td>${group.college.name}</td>
            <td>${group.name}</td>
            <td>${group.membership}</td>
            <td>${group.college.division}</td>
            <td><img src='./assets/trophy.png' data-id='${group.id}'/><br>
            <button type="button" data-id='${group.id}'/>Delete</button></td>
          </tr>
          `
        }) // end of forEach
      }) // end of initial fetch

    groupTable.addEventListener('click', (event) => {
      // debugger
      if (event.target.nodeName == "IMG") {
        let groupNum = event.target.dataset.id
          // determine if first winner
            if (winnerBox.innerText.length == 7){
              console.log('announcing');
              announceWinner(groupNum)
            } else {
              console.log('replacing');
              replaceWinner(groupNum)
            }

      } else if (event.target.nodeName == "BUTTON") {
        let groupNum = event.target.dataset.id
        findAndRemoveRow(groupNum)
        deleteGroup(groupNum)
      }
    }) // end of groupTable listener

    function announceWinner(groupNum) {
      let winner = allGroups.find(group => (groupNum == group.id))
      // remove winner from table
      // announce winner
      winnerBox.innerHTML = `<h2 id="winner" class="padding yellow border-round" data-id="${winner.id}">Winner: ${winner.college.name} ${winner.name}</h2>`
      findAndRemoveRow(groupNum)
    } // end of announceWinner

    function replaceWinner(groupNum) {
      // store current winner ID
      let winnerNameBox = document.querySelector('#winner')
      let lastNum = winnerNameBox.dataset.id
      let group = allGroups.find(group => (lastNum == group.id))
      groupTable.innerHTML += `
        <tr data-id='${group.id}'>
          <td>${group.college.name}</td>
          <td>${group.name}</td>
          <td>${group.membership}</td>
          <td>${group.college.division}</td>
          <td><img src='./assets/trophy.png' data-id='${group.id}'/></td>
        </tr>
        `
      // add back to table
      announceWinner(groupNum)
    } // end of replaceWinner

    function findAndRemoveRow(groupNum) {
      let arrayOfRows = Array.from(groupTable.children)
      let winnerRow = arrayOfRows.find(row => (row.dataset.id == groupNum))
      winnerRow.remove()
    } // end of findAndRemoveRow

    function deleteGroup(groupNum) {

      fetch(`http://localhost:3000/a_cappella_groups/${groupNum}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
      })
    }

  })
