import { prisma } from "database";

export const getAncestorChaptersByName = async (name: string) => {
  const ancestors = [];
  let chapter = await prisma.chapter.findFirst({ where: { name } });
  if (!chapter) return [];
  ancestors.push(chapter);
  while (chapter?.parentId) {
    chapter = await prisma.chapter.findFirst({
      where: { id: chapter.parentId },
    });
    if (!chapter) break;
    ancestors.push(chapter);
  }
  return ancestors;
};
