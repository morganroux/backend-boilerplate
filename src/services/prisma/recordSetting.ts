import { prisma } from "database";
import { splitAndMergeForkedItems } from "../../utils/objects";

export const getRecordSettings = async (chapterIds?: string[]) => {
  const recordSettings = await prisma.recordSetting.findMany({
    where: {
      chapterId: { in: chapterIds },
    },
    include: { recordSettingsOnRules: { include: { rule: true } } },
  });
  const recSettingsWithRules = recordSettings.map((recordSetting) => ({
    ...recordSetting,
    rules: recordSetting.recordSettingsOnRules.map((el) => el.rule),
  }));
  return recSettingsWithRules;
};

export const getMergedRecordSettings = async (chapterIds?: string[]) => {
  const recSettingsWithRules = await getRecordSettings(chapterIds);

  const { mergedItems } = splitAndMergeForkedItems(recSettingsWithRules);
  return mergedItems;
};
