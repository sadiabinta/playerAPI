const allPlayer = (pName = '') => {
  fetch(
    `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${pName}`
  )
    .then((res) => res.json())
    .then((data) => {
      dispalyPlayer(data.player.slice(0, 20));
    });
};

const dispalyPlayer = (players) => {
  const cardContainer = document.getElementById('card-container');
  cardContainer.innerHTML = '';
  players.forEach((player) => {
    const [name, rest] = player.strDescriptionEN.split('(');
    const div = document.createElement('div');
    div.classList.add('col');
    div.innerHTML = `
    <div class="card">
            <img src=${player.strCutout} alt="Image Unavailable"
            class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
              <p class="card-text">
              <b>Gender:</b> ${player.strGender} <br/>
                <b>Nationality:</b> ${player.strNationality} <br/>
                <b>Sport:</b> ${player.strSport} <br/>
                <b>Position:</b> ${player.strPosition} <br/>
                <b>Team:</b> ${player.strTeam} <br/>
                <b>About:</b> ${player.strDescriptionEN.slice(0, 50)}... <br/>

                <a href="${
                  player.strTwitter
                }"><i class="fa-brands fa-twitter text-primary"></i></a>
                <a href="${
                  player.strYoutube
                }"><i class="fa-brands fa-youtube text-danger"></i></a>
              </p>
              <div>
        <button onclick="singlePlayer(${
          player.idPlayer
        })" type="button" class="btn btn-primary">
  Details
</button>
        <button id="addBtn" onclick="handleAddToCart('${name}', '${
      player.dateBorn
    }', '${player.strCutout}','${player.strGender} ',this)"
        class="btn btn-primary">Add to Group</button>
    </div>
            </div>
          </div>
    `;
    cardContainer.appendChild(div);
  });
};

const openModal = (player) => {
  const myModal = document.getElementById('my-modal');
  myModal.innerHTML = '';

  const [name, rest] = player.strDescriptionEN.split('(');
  const div = document.createElement('div');
  div.innerHTML = `
    <!-- Modal -->
<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">${name}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <img class="modalImg" src="${player.strThumb}">
       <p>
       <b>Date Of Birth: </b>${player.dateBorn}<br/>
       <b>Birth Location: </b>${player.strBirthLocation}<br/>
       <b>Weight: </b>${player.strWeight}<br/>
       <b>Height: </b>${player.strHeight}<br/>
       <b>Team: </b>${player.strTeam}<br/>
       <b>About: </b>${player.strDescriptionEN} <br/>
       <a href="${player.strTwitter}"><i class="fa-brands fa-twitter text-primary"></i></a>
                <a href="${player.strYoutube}"><i class="fa-brands fa-youtube text-danger"></i></a>

       </p>
      </div>
      <div class="modal-footer">
        <button  type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Understood</button>
      </div>
    </div>
  </div>
</div>
    `;
  myModal.appendChild(div);
};

const handleAddToCart = (name, dob, img, gender, button) => {
  let total = parseInt(document.getElementById('total').innerText);
  let male = parseInt(document.getElementById('male').innerText);
  let female = parseInt(document.getElementById('female').innerText);

  if (total >= 11) {
    alert('You Can not have more than 11 people in your group');
    return;
  } else {
    document.getElementById('total').innerText = total += 1;
  }
  if (gender.trim().toLowerCase() === 'male') {
    male += 1;
    document.getElementById('male').innerText = male;
  } else {
    console.log(gender);
    document.getElementById('female').innerText = female += 1;
  }
  const cart = document.getElementById('cart');
  const list = document.createElement('li');
  list.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-center'
  );
  list.innerHTML = `
  <div class="ms-2 me-auto d-flex justify-content-center align-items-center">
                <div class="fw-bold">${name}</div>
                <img  src="${img}" class="cart-img rounded-circle mw-25">
                <button onclick="removeFromCart(this,'${gender}')" type="button" class="btn btn-danger">X</button>
              </div>
  `;
  cart.appendChild(list);
  button.innerText = 'Already Added';
  button.disabled = true;
};
const removeFromCart = (button, gender) => {
  const listItem = button.parentElement.parentElement;
  listItem.remove();

  let total = parseInt(document.getElementById('total').innerText);
  let male = parseInt(document.getElementById('male').innerText);
  let female = parseInt(document.getElementById('female').innerText);

  document.getElementById('total').innerText = total -= 1;
  if (gender.trim().toLowerCase() === 'male') {
    male -= 1;
    document.getElementById('male').innerText = male;
  } else {
    document.getElementById('female').innerText = female -= 1;
  }
};

const singlePlayer = (id) => {
  fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
    .then((res) => res.json())
    .then((data) => {
      openModal(data.players[0]);
      const myModal = new bootstrap.Modal(
        document.getElementById('staticBackdrop')
      );
      myModal.show();
    });
};

const searchPlayers = () => {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  console.log(searchTerm);
  allPlayer(searchTerm);
};

allPlayer();
