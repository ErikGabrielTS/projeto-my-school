import type Aluno from "../types/Aluno";
import { baseUrl } from "../config";

export const getAlunoById = async (id: String): Promise<Aluno> => {
  const response = await fetch(`${baseUrl}/aluno/${id}`);

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return await response.json();
};

export const getAllAluno = async (): Promise<Aluno[]> => {
  const response = await fetch(`${baseUrl}/aluno`);

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return await response.json();
};

export const createAluno = async (aluno: Aluno) => {
  const response = await fetch(`${baseUrl}/aluno`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aluno),
  });

  return await response.json();
};

export const updateAluno = async (id: string, aluno: Aluno) => {
  const response = await fetch(`${baseUrl}/aluno/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aluno),
  });

  return await response.json();
};

export const deleteAluno = async (id: string): Promise<boolean> => {
  const response = await fetch(`${baseUrl}/aluno/${id}`, {
    method: "DELETE",
  });

  return response.ok;
};
