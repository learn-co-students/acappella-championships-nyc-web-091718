document.addEventListener('DOMContentLoaded', () => {

  let allSchools = []
  const schoolTable = document.getElementById('table-body')
    const winnerBar = document.getElementById('winner')

  fetch('http://localhost:3000/a_cappella_groups')
  .then((response) => response.json())
     .then((json) => {
       allSchools = json
      schoolTable.innerHTML = renderSchools(allSchools)

    })

schoolTable.addEventListener('click', (event) => {

  if(event.target.dataset.action === "win") {
  let winner =  allSchools.find((school) => {
      return school.id == event.target.dataset.id
    })
    let winnertxt = "Winner " + winner.college.name + " " +  winner.name
 winnerBar.innerText = winnertxt
} else if(event.target.dataset.action === "delete") {
 let id = event.target.dataset.id

 fetch(`http://localhost:3000/a_cappella_groups/${id}`,
      {
        method: 'DELETE'
      })
    .then(response => {
      if (response.ok) {
    allSchools = allSchools.filter((school) => (school.id != id))
schoolTable.removeChild(event.target.parentNode.parentElement);

      } //end if
    })
} //End table Listener
})

}) ///END DOM LISTENEr

function renderSchools(schools) {
  return schools.map((school) => {
    return `
    <tr>
    <td>${school.college.name}<button  data-id='${school.id}' data-action = "delete">Delete</button></td>
    <td>${school.name}</td>
    <td>${school.membership}</td>
    <td>${school.college.division}</td>
    <td><img src='./assets/trophy.png' data-action="win" data-id='${school.id}'/></td>
    </tr>

    `
  }).join(' ')
}
