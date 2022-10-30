import { prisma } from "database";

export const storeOIDCToken = async ({
  login,
  token,
  type,
}: {
  login: string;
  token: string;
  type: string;
}) => {
  await prisma.oidcToken.upsert({
    create: { login, token, type },
    update: { token },
    where: { login_type: { login, type } },
  });
};

export const getOIDCToken = async ({
  login,
  type,
}: {
  login: string;
  type: string;
}) => {
  const token = await prisma.oidcToken.findUnique({
    where: { login_type: { login, type } },
  });
  return token?.token;
};
