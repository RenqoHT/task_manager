import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: 'Логин', type: 'text' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              user_login: credentials.login as string,
            },
          });

          if (!user || user.user_password !== credentials.password) {
            return null;
          }

          return {
            id: user.user_id.toString(),
            name: user.user_login,
            admin_role: user.admin_role,
            SMM_role: user.SMM_role,
            designer_role: user.designer_role,
            photographer_role: user.photographer_role,
            coordinator_role: user.coordinator_role,
          };

        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.admin_role = (user as any).admin_role;
        token.SMM_role = (user as any).SMM_role;
        token.designer_role = (user as any).designer_role;
        token.photographer_role = (user as any).photographer_role;
        token.coordinator_role = (user as any).coordinator_role;
      }
      return token;
    },


    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.admin_role = token.admin_role;
        session.user.SMM_role = token.SMM_role;
        session.user.designer_role = token.designer_role;
        session.user.photographer_role = token.photographer_role;
        session.user.coordinator_role = token.coordinator_role;
      }
      return session;
    },
  },
};
