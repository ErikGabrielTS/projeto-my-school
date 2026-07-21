import { baseUrl } from "../config";
import type Curso from "../types/Curso";

export const createCurso = async (curso: Curso) => {
  const response = await fetch(`${baseUrl}/curso`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(curso),
  });

  return await response.json();
};

export const updateCurso = async (id: string, curso: Curso) => {
  const response = await fetch(`${baseUrl}/curso/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(curso),
  });

  return await response.json();
};

export const deleteAluno = async (id: string): Promise<boolean> => {
  const response = await fetch(`${baseUrl}/curso/${id}`, {
    method: "DELETE",
  });

  return response.ok;
};
