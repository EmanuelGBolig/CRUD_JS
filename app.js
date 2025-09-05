// ===============================
// CONFIG: URL base de la API
// ===============================
const API_URL = "http://localhost:3000"; // reemplazar por la URL real

// ===============================
// LISTAR TODOS LOS OBJETOS
// ===============================
async function getAllObjects() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const tbody = document.getElementById("object-list");
    if (tbody) {
      tbody.innerHTML = "";
      data.forEach((obj) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${obj.id}</td>
            <td>${obj.firstName}</td>
            <td>${obj.lastName}</td>
            <td>${obj.email}</td>
            <td>${obj.gender}</td>
            <td>
              <button onclick="editObject(${obj.id})">Editar</button>
              <button onclick="deleteObject(${obj.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
      });
    }
  } catch (err) {
    console.error("Error obteniendo objetos:", err);
  }
}

// ===============================
// AGREGAR UN NUEVO OBJETO
// ===============================
async function addObject(newObj) {
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newObj),
    });
    alert("Objeto agregado!");
    window.location.href = "index.html";
  } catch (err) {
    console.error("Error agregando objeto:", err);
  }
}

// ===============================
// EDITAR (REDIRECCIÓN AL FORM)
// ===============================
function editObject(id) {
  window.location.href = `form.html?id=${id}`;
}

// ===============================
// ACTUALIZAR UN OBJETO
// ===============================
async function updateObject(id, updatedObj) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedObj),
    });
    alert("Objeto actualizado!");
    window.location.href = "index.html";
  } catch (err) {
    console.error("Error actualizando objeto:", err);
  }
}

// ===============================
// ELIMINAR UN OBJETO
// ===============================
async function deleteObject(id) {
  if (!confirm("¿Seguro que deseas eliminar este objeto?")) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    alert("Objeto eliminado!");
    getAllObjects();
  } catch (err) {
    console.error("Error eliminando objeto:", err);
  }
}

// ===============================
// CARGAR DATOS EN EL FORMULARIO (EDICIÓN)
// ===============================
async function loadObjectForEdit(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const obj = await response.json();

    if (!obj) {
      alert("Objeto no encontrado");
      window.location.href = "index.html";
      return;
    }

    document.getElementById("form-title").textContent = "Editar Objeto";
    document.getElementById("object-id").value = obj.id;
    document.getElementById("firstName").value = obj.firstName;
    document.getElementById("lastName").value = obj.lastName;
    document.getElementById("email").value = obj.email;
    document.getElementById("gender").value = obj.gender;
    document.getElementById("submit-btn").textContent = "Actualizar";
  } catch (err) {
    console.error("Error cargando objeto:", err);
  }
}

// ===============================
// MANEJO DEL FORMULARIO
// ===============================
const form = document.getElementById("object-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("object-id").value;
    const obj = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      gender: document.getElementById("gender").value,
    };

    if (id) {
      updateObject(id, obj);
    } else {
      addObject(obj);
    }
  });

  // Si entramos al form con un ID → es edición
  const params = new URLSearchParams(window.location.search);
  if (params.has("id")) {
    loadObjectForEdit(params.get("id"));
  }
}

// ===============================
// EJECUCIÓN AUTOMÁTICA
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("object-list")) {
    getAllObjects();
  }
});
