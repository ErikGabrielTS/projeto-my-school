import { createAluno, getAllAluno, deleteAluno } from "./services/AlunoService";
import {
  createCurso,
  getAllCurso,
  getCursoById,
} from "./services/CursoService";
import "./style.css";
import type Aluno from "./types/Aluno";
import type Curso from "./types/Curso";

const studentForm =
  document.querySelector<HTMLFormElement>("#form-aluno") || null;
const cursoForm =
  document.querySelector<HTMLFormElement>("#form-curso") || null;
const cursosSelect =
  document.querySelector<HTMLSelectElement>("#cursos") || null;
const alunosCadastradosTbody =
  document.querySelector<HTMLDivElement>("#alunos-cadastrados__tbody") || null;
const emptyMessageP =
  document.querySelector<HTMLParagraphElement>("#empty-message") || null;

const alunosCadastradosTable =
  document.querySelector<HTMLDivElement>("#alunos-cadastrados__table") || null;

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

const listarAlunos = async () => {
  const alunos: Aluno[] = await getAllAluno();

  if (alunosCadastradosTbody && alunosCadastradosTable && emptyMessageP) {
    if (alunos.length === 0) {
      alunosCadastradosTable.classList.add("disabled");
      emptyMessageP.classList.remove("disabled");
      alunosCadastradosTbody.innerHTML = "";
      return;
    }

    alunosCadastradosTable.classList.remove("disabled");
    emptyMessageP.classList.add("disabled");

    const alunosComCurso = await Promise.all(
      alunos.map(async (aluno) => {
        const curso = await getCursoById(aluno.cursoId);
        return { ...aluno, nomeCurso: curso ? curso.nome : "Não encontrado" };
      }),
    );

    const tbodyContent = alunosComCurso
      .map(
        (aluno) => `
      <tr>
        <td>${aluno.nome}</td>
        <td>${new Date(aluno.dtNascimento).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</td>
        <td>${aluno.nomeCurso}</td>
        <td class="acoes">
          <button type="button" class="btn-acao" title="Editar" data-id="${aluno.id}">
            <img src="/icons/edit.png" alt="Editar" />
          </button>
          <button type="button" class="btn-acao" title="Excluir" data-id="${aluno.id}">
            <img src="/icons/trash.png" alt="Excluir" />
          </button>
        </td>
      </tr>
    `,
      )
      .join("");

    alunosCadastradosTbody.innerHTML = tbodyContent;
  }
};

if (cursosSelect) {
  cursosSelect.innerHTML = `
    <option value="" disabled selected>Selecione uma opção</option>
    ${cursos.map((curso) => `<option value="${curso.id}">${curso.nome}</option>`).join("")}
  `;
}

if (alunosCadastradosTbody) {
  alunosCadastradosTbody.addEventListener("click", async (evt) => {
    const target = evt.target as HTMLElement;
    const button = target.closest<HTMLButtonElement>(
      'button[title="Excluir"][data-id]',
    );

    if (!button) {
      return;
    }

    const alunoId = button.dataset.id;
    if (!alunoId) {
      return;
    }

    const confirmed = window.confirm("Deseja realmente excluir este aluno?");
    if (!confirmed) {
      return;
    }

    try {
      const success = await deleteAluno(alunoId);
      if (success) {
        showFeedback("Aluno excluído com sucesso!");
        listarAlunos();
      } else {
        showFeedback("Falha ao excluir o aluno.");
      }
    } catch {
      showFeedback("Falha ao excluir o aluno.");
    }
  });
}

listarAlunos();
