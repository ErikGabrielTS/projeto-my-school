import { createAluno } from "./services/AlunoService";
import "./style.css";
import type Aluno from "./types/Aluno";

const form = document.querySelector<HTMLFormElement>("form");

form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formData = new FormData(form);

  const aluno: Aluno = {
    nome: formData.get("nome").toString() || "",
    dtNascimento: new Date(formData.get("nascimento").toString() || ""),
    sexo: formData.get("sexo").toString() || "",
    cursoId: Number(formData.get("curso")),
  };

  createAluno(aluno);
});
