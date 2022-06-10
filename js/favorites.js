import { GithubUser } from "./GithubUser.js";
// classe que vai conter a logica dos dados
//como os dados serão estruturados
class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }
  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }
  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }
  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username);
      if (userExists) {
        throw new Error("Usuário já cadastrado");
      }
      const user = await GithubUser.search(username);
      console.log(user);
      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      }
      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }
  delete(user) {
    this.entries = this.entries.filter((entry) => entry.login !== user.login);
    this.update();
    this.save();
  }
}

//classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("table tbody");
    this.update();
    this.onadd();
  }
  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();
      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;
      this.tbody.append(row);
      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem Certeza que deseja remover essa linha?");
        if (isOk) {
          this.delete(user);
        }
      };
    });
  }
  createRow() {
    const tr = document.createElement("tr");
    const data = `
            <td class="user">
                <img src="./images/goku_trw2.jpg" alt="">
                <a href="" target="_blank">
                    <p>Goku</p>
                    <span>GokuCode</span>
                </a>
            </td>
            <td class="repositories">200</td>
            <td class="followers">1900</td>
            <td>
                <button class="remove">&times;</button>
            </td>
        `;
    tr.innerHTML = data;
    return tr;
  }
  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
