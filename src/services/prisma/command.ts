import { prisma } from "database";
import { splitAndMergeForkedItems } from "../../utils/objects";

export const getCommands = async (chapterIds?: string[]) => {
  const commands = await prisma.command.findMany({
    where: {
      chapterId: { in: chapterIds },
    },
    include: { commandsOnRules: { include: { rule: true } } },
  });
  const recSettingsWithRules = commands.map((command) => ({
    ...command,
    rules: command.commandsOnRules.map((el) => el.rule),
  }));
  return recSettingsWithRules;
};

export const getMergedCommands = async (chapterIds?: string[]) => {
  const recSettingsWithRules = await getCommands(chapterIds);

  const { mergedItems } = splitAndMergeForkedItems(recSettingsWithRules);
  return mergedItems;
};
