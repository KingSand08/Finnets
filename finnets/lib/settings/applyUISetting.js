'use client';

export const applyColor = async ({ varName, newColor }) => {
  const root = document.documentElement;
  root.style.setProperty(varName, newColor);
};
