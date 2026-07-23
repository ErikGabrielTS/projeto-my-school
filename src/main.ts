import {
  createAluno,
  getAllAluno,
  deleteAluno,
  updateAluno,
  getAlunoById,
} from "./services/AlunoService";
import {
  createCurso,
  getAllCurso,
  getCursoById,
  updateCurso,
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
const cursosCadastradosTbody =
  document.querySelector<HTMLDivElement>("#alunos-cadastrados__tbody") || null;
const cursosCadastradosTable =
  document.querySelector<HTMLTableElement>("#cursos-cadastrados__table") ||
  null;
const cursosEmptyMessageP =
  document.querySelector<HTMLParagraphElement>(".cursos-cadastrados p") || null;

const alunosCadastradosTable =
  document.querySelector<HTMLDivElement>("#alunos-cadastrados__table") || null;

let alunoEditandoId: string | null = null;
let cursoEditandoId: string | null = null;

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

studentForm?.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  const formData = new FormData(studentForm);

  const aluno: Aluno = {
    nome: formData.get("nome")?.toString() || "",
    dtNascimento: new Date(formData.get("nascimento")?.toString() || ""),
    sexo: formData.get("sexo")?.toString() || "",
    cursoId: formData.get("curso")?.toString() || "",
  };

  try {
    if (alunoEditandoId) {
      await updateAluno(alunoEditandoId, aluno);
      showFeedback("Aluno atualizado com sucesso!");
      alunoEditandoId = null;

      const submitBtn = studentForm.querySelector<HTMLButtonElement>(
        "button[type='submit']",
      );
      if (submitBtn) submitBtn.textContent = "Cadastrar Aluno";
    } else {
      await createAluno(aluno);
      showFeedback("Aluno cadastrado com sucesso!");
    }

    studentForm.reset();
    listarAlunos();
  } catch (error) {
    console.error("Erro ao salvar aluno:", error);
    showFeedback("Erro ao salvar dados do aluno.");
  }
});

cursoForm?.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  const formData = new FormData(cursoForm);

  const curso: Curso = {
    nome: formData.get("nome")?.toString() || "",
    periodo: Number(formData.get("periodo")),
  };

  try {
    if (cursoEditandoId) {
      await updateCurso(cursoEditandoId, curso);
      showFeedback("Curso atualizado com sucesso!");
      cursoEditandoId = null;

      const submitBtn = cursoForm.querySelector<HTMLButtonElement>(
        "button[type='submit']",
      );
      if (submitBtn) submitBtn.textContent = "Cadastrar";
    } else {
      await createCurso(curso);
      showFeedback("Curso cadastrado com sucesso!");
    }

    cursoForm.reset();
    await listarCursos();
  } catch (error) {
    console.error("Erro ao salvar curso:", error);
    showFeedback("Erro ao salvar dados do curso.");
  }
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

const carregarCursosSelect = async () => {
  if (!cursosSelect) return;

  try {
    const cursos: Curso[] = await getAllCurso();
    cursosSelect.innerHTML = `
      <option value="" disabled selected>Selecione uma opção</option>
      ${cursos.map((curso) => `<option value="${curso.id}">${curso.nome}</option>`).join("")}
    `;
  } catch (error) {
    console.error("Erro ao carregar os cursos:", error);
  }
};

if (alunosCadastradosTbody) {
  alunosCadastradosTbody.addEventListener("click", async (evt) => {
    const target = evt.target as HTMLElement;

    const deleteBtn = target.closest<HTMLButtonElement>(
      'button[title="Excluir"][data-id]',
    );
    if (deleteBtn) {
      const alunoId = deleteBtn.dataset.id;
      if (!alunoId) return;

      const confirmed = window.confirm("Deseja realmente excluir este aluno?");
      if (!confirmed) return;

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
      return;
    }

    const editBtn = target.closest<HTMLButtonElement>(
      'button[title="Editar"][data-id]',
    );
    if (editBtn) {
      const alunoId = editBtn.dataset.id;
      if (!alunoId) return;

      const aluno = await getAlunoById(alunoId);

      if (aluno && studentForm) {
        const inputNome =
          studentForm.querySelector<HTMLInputElement>('[name="nome"]');
        const inputNascimento = studentForm.querySelector<HTMLInputElement>(
          '[name="nascimento"]',
        );
        const inputsSexo =
          studentForm.querySelectorAll<HTMLInputElement>('input[name="sexo"]');
        const selectCurso =
          studentForm.querySelector<HTMLSelectElement>('[name="curso"]');

        if (inputNome) inputNome.value = aluno.nome;
        if (inputNascimento) {
          const data = new Date(aluno.dtNascimento);
          inputNascimento.value = data.toISOString().split("T")[0];
        }
        inputsSexo.forEach((radio) => {
          radio.checked = radio.value === aluno.sexo;
        });
        if (selectCurso) selectCurso.value = aluno.cursoId;

        alunoEditandoId = alunoId;

        const submitBtn = studentForm.querySelector<HTMLButtonElement>(
          "button[type='submit']",
        );
        if (submitBtn) submitBtn.textContent = "Atualizar";

        studentForm.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}

// Page cadastrarCurso.html

const listarCursos = async () => {
  const cursos: Curso[] = await getAllCurso();

  if (cursosCadastradosTbody && cursosCadastradosTable && cursosEmptyMessageP) {
    if (cursos.length === 0) {
      cursosCadastradosTable.classList.add("disabled");
      cursosEmptyMessageP.classList.remove("disabled");
      cursosCadastradosTbody.innerHTML = "";
      return;
    }

    cursosCadastradosTable.classList.remove("disabled");
    cursosEmptyMessageP.classList.add("disabled");

    const tbodyContent = cursos
      .map(
        (curso) => `
      <tr>
        <td>${curso.nome}</td>
        <td>${curso.periodo}</td>
        <td class="acoes">
          <button type="button" class="btn-acao" title="Editar" data-id="${curso.id}">
            <img src="/icons/edit.png" alt="Editar" />
          </button>
        </td>
      </tr>
    `,
      )
      .join("");

    cursosCadastradosTbody.innerHTML = tbodyContent;
  }
};

if (cursosCadastradosTbody) {
  cursosCadastradosTbody.addEventListener("click", async (evt) => {
    const target = evt.target as HTMLElement;

    const editBtn = target.closest<HTMLButtonElement>(
      'button[title="Editar"][data-id]',
    );

    if (editBtn) {
      const cursoId = editBtn.dataset.id;
      if (!cursoId) return;

      const curso = await getCursoById(cursoId);

      if (curso && cursoForm) {
        const inputNome =
          cursoForm.querySelector<HTMLInputElement>('[name="nome"]');
        const inputPeriodo =
          cursoForm.querySelector<HTMLInputElement>('[name="periodo"]');

        if (inputNome) inputNome.value = curso.nome;
        if (inputPeriodo) inputPeriodo.value = String(curso.periodo);

        cursoEditandoId = cursoId;

        const submitBtn = cursoForm.querySelector<HTMLButtonElement>(
          "button[type='submit']",
        );
        if (submitBtn) submitBtn.textContent = "Atualizar";

        cursoForm.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}

// Chamadas Gerais

carregarCursosSelect();
listarAlunos();
listarCursos();
