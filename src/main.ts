import { createAluno } from "./services/AlunoService";
import { createCurso, getAllCurso } from "./services/CursoService";
import "./style.css";
import type Aluno from "./types/Aluno";
import type Curso from "./types/Curso";

const studentForm =
  document.querySelector<HTMLFormElement>("#form-aluno") || null;
const cursoForm =
  document.querySelector<HTMLFormElement>("#form-curso") || null;
const cursosSelect =
  document.querySelector<HTMLSelectElement>("#cursos") || null;

const cursos: Curso[] = await getAllCurso();

const showFeedback = (message: string) => {
  const existingFeedback = document.querySelector(".feedback-cadastro");
  if (existingFeedback) {
    existingFeedback.remove();
  }

  const feedback = document.createElement("div");
  feedback.className = "feedback-cadastro";
  feedback.textContent = message;
  document.body.appendChild(feedback);

  setTimeout(() => {
    feedback.remove();
  }, 3000);
};

studentForm?.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formData = new FormData(studentForm);

  const aluno: Aluno = {
    nome: formData.get("nome")?.toString() || "",
    dtNascimento: new Date(formData.get("nascimento")?.toString() || ""),
    sexo: formData.get("sexo")?.toString() || "",
    cursoId: formData.get("curso")?.toString() || "",
  };

  createAluno(aluno);
  showFeedback("Aluno cadastrado com sucesso!");
  studentForm.reset();
});

cursoForm?.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const formData = new FormData(cursoForm);

  const curso: Curso = {
    nome: formData.get("nome")?.toString() || "",
    periodo: Number(formData.get("periodo")),
  };

  createCurso(curso);
  showFeedback("Curso cadastrado com sucesso!");
  cursoForm.reset();
});

if (cursosSelect) {
  cursosSelect.innerHTML = `
    <option value="" disabled selected>Selecione uma opção</option>
    ${cursos.map((curso) => `<option value="${curso.id}">${curso.nome}</option>`).join("")}
  `;
}
